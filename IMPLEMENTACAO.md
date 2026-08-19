# Implementação: PostgreSQL + Docker, Prisma ORM e Autenticação JWT

Este documento descreve, em detalhes, todas as mudanças feitas nesta branch
(`claude-teste`) para migrar a API-Livraria do Supabase para uma stack baseada
em **PostgreSQL rodando em Docker**, **Prisma como ORM** e **autenticação via
JWT com senhas protegidas por bcrypt**.

O objetivo é que qualquer pessoa consiga entender *o que* mudou, *por que* mudou
e *como* rodar o projeto do zero.

---

## Sumário

1. [Visão geral da arquitetura](#1-visão-geral-da-arquitetura)
2. [Banco de dados PostgreSQL com Docker](#2-banco-de-dados-postgresql-com-docker)
3. [Variáveis de ambiente (.env)](#3-variáveis-de-ambiente-env)
4. [Prisma ORM](#4-prisma-orm)
5. [Migração dos controllers (Supabase → Prisma)](#5-migração-dos-controllers-supabase--prisma)
6. [Tratamento de erros do Prisma](#6-tratamento-de-erros-do-prisma)
7. [Autenticação com JWT + bcrypt](#7-autenticação-com-jwt--bcrypt)
8. [Proteção das rotas](#8-proteção-das-rotas)
9. [Como rodar o projeto do zero](#9-como-rodar-o-projeto-do-zero)
10. [Como testar a API](#10-como-testar-a-api)
11. [Estrutura de arquivos](#11-estrutura-de-arquivos)

---

## 1. Visão geral da arquitetura

Antes, a API usava o cliente `@supabase/supabase-js`, que conversava com um banco
Postgres hospedado no Supabase por meio de uma API HTTP (PostgREST). Cada
controller montava queries no estilo `supabase.from('tabela').select(...)`.

Agora o fluxo é:

```
Cliente HTTP
   │
   ▼
Express (rotas)  ──►  Middlewares (autenticação + validação Zod)
   │
   ▼
Controllers  ──►  Prisma Client  ──►  PostgreSQL (container Docker)
   │
   ▼
Middleware de erros (traduz erros do Prisma/app em respostas HTTP)
```

Principais ganhos:

- **Banco local e reproduzível**: qualquer pessoa sobe o mesmo Postgres com um
  comando (`docker compose up -d`).
- **ORM com tipos e migrations**: o schema do banco vira código versionado
  (`prisma/schema.prisma` + pasta `prisma/migrations`).
- **Autenticação própria**: cadastro/login com senha em hash e token JWT.

---

## 2. Banco de dados PostgreSQL com Docker

Arquivo: **`docker-compose.yml`**

```yaml
services:
  db:
    image: postgres:16-alpine
    container_name: livraria_db
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-livraria}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-livraria}
      POSTGRES_DB: ${POSTGRES_DB:-livraria}
    ports:
      - "55432:5432"
    volumes:
      - livraria_pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-livraria} -d ${POSTGRES_DB:-livraria}"]
      interval: 5s
      timeout: 5s
      retries: 10

volumes:
  livraria_pgdata:
```

Explicando cada ponto importante:

- **`image: postgres:16-alpine`** — versão enxuta e estável do Postgres 16.
- **`environment`** — o container cria automaticamente o usuário, a senha e o
  banco na primeira inicialização. Os valores vêm do `.env` (interpolação
  `${VAR:-default}`), então basta editar o `.env` para trocar as credenciais.
- **`ports: "55432:5432"`** — a porta interna do Postgres é `5432`, mas ela foi
  exposta na máquina host como **`55432`**. Isso foi necessário porque a porta
  `5432` da máquina já estava ocupada por outra instância de Postgres. Se você
  não tiver esse conflito, pode voltar para `5432:5432` (e ajustar o
  `DATABASE_URL`).
- **`volumes: livraria_pgdata`** — um volume nomeado guarda os dados do banco
  fora do container. Assim, se o container for recriado, os dados persistem.
- **`healthcheck`** — usa `pg_isready` para o Docker saber quando o banco está
  realmente pronto para aceitar conexões (útil para automações).

Comandos úteis (também expostos como scripts npm):

```bash
docker compose up -d     # sobe o banco em segundo plano   (npm run db:up)
docker compose down      # derruba o container              (npm run db:down)
docker compose down -v   # derruba E apaga os dados do volume
```

---

## 3. Variáveis de ambiente (.env)

Arquivo: **`.env`** (não versionado) — há um **`.env.example`** versionado como
modelo.

```env
# Postgres (usado pelo docker-compose)
POSTGRES_USER=livraria
POSTGRES_PASSWORD=livraria
POSTGRES_DB=livraria

# Prisma
DATABASE_URL="postgresql://livraria:livraria@localhost:55432/livraria?schema=public"

# JWT
JWT_SECRET="troque-este-segredo-em-producao"
JWT_EXPIRES_IN="1d"
```

- **`DATABASE_URL`** — string de conexão que o Prisma usa. Formato:
  `postgresql://USUARIO:SENHA@HOST:PORTA/BANCO?schema=public`. Repare que a porta
  é `55432` (a porta exposta pelo Docker no host).
- **`JWT_SECRET`** — chave secreta usada para **assinar e validar** os tokens.
  Em produção, use um valor longo e aleatório e **nunca** o comite.
- **`JWT_EXPIRES_IN`** — tempo de validade do token (`1d` = 1 dia).

O `.gitignore` foi atualizado para ignorar `.env` e variações, mas manter o
`.env.example`:

```
node_modules
.env
.env.*
!.env.example
```

---

## 4. Prisma ORM

### 4.1. Pacotes

Instalados:

- `prisma` — CLI (migrations, generate, studio).
- `@prisma/client` — client usado em runtime pelos controllers.

> **Nota sobre a versão:** o projeto usa **Prisma 6**. A versão 7 introduziu uma
> mudança grande (removeu `url` de dentro do `schema.prisma`, exigindo
> *driver adapters* e um arquivo `prisma.config.ts`). Para manter a configuração
> simples e alinhada com a maior parte da documentação/tutoriais, fixamos o
> Prisma na linha `6.x`.

### 4.2. Schema

Arquivo: **`prisma/schema.prisma`**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Autor {
  id                  String  @id @default(uuid()) @db.Uuid
  autor_nome          String
  nacionalidade_autor String
  data_nascimento     String
  biografia           String
  livros              Livro[]

  @@map("autores")
}

model Editora {
  id            String  @id @default(uuid()) @db.Uuid
  nome_editora  String
  pais_editora  String
  site_editora  String
  email_contato String
  livros        Livro[]

  @@map("editoras")
}

model Livro {
  id             String  @id @default(uuid()) @db.Uuid
  titulo         String
  autor_id       String  @db.Uuid
  editora_id     String  @db.Uuid
  isbn           String  @unique
  preco          Float
  paginas        Int
  ano_publicacao Int
  genero         String
  estoque        Int
  sinopse        String
  autor          Autor   @relation(fields: [autor_id], references: [id])
  editora        Editora @relation(fields: [editora_id], references: [id])

  @@map("livros")
}

model Usuario {
  id        String   @id @default(uuid()) @db.Uuid
  nome      String
  email     String   @unique
  senha     String
  criado_em DateTime @default(now())

  @@map("usuarios")
}
```

Detalhes importantes:

- **`@@map("...")`** — mantém os nomes das tabelas em minúsculas/plural
  (`autores`, `editoras`, `livros`, `usuarios`), iguais aos que a API já usava.
- **`@id @default(uuid()) @db.Uuid`** — a chave primária é um UUID gerado
  automaticamente, armazenado como tipo nativo `uuid` do Postgres.
- **Relações** — `Livro` tem `autor` e `editora`; do outro lado, `Autor` e
  `Editora` têm a lista `livros[]`. O Postgres cria as *foreign keys*
  correspondentes.
- **`@unique`** — `isbn` (livros) e `email` (usuários) não podem se repetir.
- **`Usuario.senha`** guarda **o hash** da senha, nunca a senha em texto puro.

### 4.3. Migration

A primeira migration foi criada e aplicada com:

```bash
npx prisma migrate dev --name init
```

Isso gerou a pasta `prisma/migrations/<timestamp>_init/` com o `migration.sql`
(o SQL que cria as tabelas) e já rodou esse SQL no banco. O mesmo comando também
executa `prisma generate`, que produz o Prisma Client tipado dentro de
`node_modules/@prisma/client`.

### 4.4. Client compartilhado

Arquivo: **`src/lib/prisma.js`**

```js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default prisma
```

Uma **única instância** do `PrismaClient` é criada e importada por todos os
controllers, evitando abrir várias conexões desnecessárias com o banco.

---

## 5. Migração dos controllers (Supabase → Prisma)

Os três controllers (`livroController`, `autoresController`, `editoraController`)
foram reescritos. O padrão de tradução foi:

| Operação Supabase                              | Equivalente Prisma                                   |
|------------------------------------------------|------------------------------------------------------|
| `.from('t').select('*')`                       | `prisma.t.findMany()`                                |
| `.select('*', { count: 'exact' })` + `.range`  | `findMany({ skip, take })` + `count()`               |
| `.ilike('col', '%x%')`                         | `where: { col: { contains: x, mode: 'insensitive' }}`|
| `.eq('col', v)`                                | `where: { col: { equals: v } }`                      |
| `.insert({...})`                               | `prisma.t.create({ data: {...} })`                   |
| `.update({...}).eq('id', id)`                  | `prisma.t.update({ where: { id }, data: {...} })`    |
| `.delete().eq('id', id)`                       | `prisma.t.delete({ where: { id } })`                 |

Pontos de atenção:

- **Paginação** — antes usava `range(from, to)`. Agora usa `skip`/`take`. A
  contagem total e a busca são feitas juntas em uma transação:

  ```js
  const [dados, total] = await prisma.$transaction([
      prisma.livro.findMany({ where, skip, take: limite, orderBy: { titulo: 'asc' } }),
      prisma.livro.count({ where })
  ])
  ```

- **Filtros dinâmicos** — o objeto `where` é montado incrementalmente; só entra
  o filtro que foi informado na query string.
- **Busca por ID inexistente** — `findUnique` retorna `null`. Nesse caso o
  controller dispara `next(new ErroNaoEncontrado())` (HTTP 404).
- **Tratamento de erros** — cada método está dentro de `try/catch` e encaminha
  o erro com `next(erro)`, para o middleware central tratar.

O arquivo antigo `src/lib/supabase.js` foi **removido**, assim como o import
morto no `src/app.js` e a dependência `@supabase/supabase-js` do `package.json`.

---

## 6. Tratamento de erros do Prisma

Antes existia `src/lib/errosSupabase.js` mapeando códigos do PostgREST
(`PGRST116`, `23505`, ...). Ele foi substituído por
**`src/lib/errosPrisma.js`**, que mapeia os códigos de erro do Prisma:

```js
const errosPrisma = {
    'P2002': new ErroConflito('Registro já cadastrado (valor único duplicado)'),
    'P2003': new ErroValidacao('ID de autor ou editora não existe'),
    'P2025': new ErroNaoEncontrado(),
}
```

- **`P2002`** — violação de restrição `@unique` (ex.: `isbn` ou `email`
  repetido) → 409 Conflito.
- **`P2003`** — violação de *foreign key* (ex.: `autor_id`/`editora_id` que não
  existe) → 400 Validação.
- **`P2025`** — registro não encontrado em `update`/`delete` → 404.

O **`src/middleware/manipuladorDeErros.js`** passou a consultar esse novo mapa.
Ele também loga no console erros inesperados antes de devolver o 500 genérico.

---

## 7. Autenticação com JWT + bcrypt

A autenticação foi construída do zero. Conceitos:

- **bcrypt** (`bcryptjs`) — algoritmo de *hashing* de senha. A senha nunca é
  guardada em texto puro; guardamos o hash. No login, comparamos a senha enviada
  com o hash usando `bcrypt.compare`.
- **JWT** (`jsonwebtoken`) — após o login, o servidor gera um *token* assinado
  com o `JWT_SECRET`. O cliente envia esse token no header `Authorization` das
  próximas requisições. O servidor valida a assinatura, sem precisar guardar
  sessão (autenticação *stateless*).

### 7.1. Controller de autenticação

Arquivo: **`src/controller/authController.js`**

- **`registrar`**:
  1. Recebe `{ nome, email, senha }`.
  2. Gera o hash: `bcrypt.hash(senha, SALT_ROUNDS)` (`SALT_ROUNDS = 10`).
  3. Cria o usuário com a senha já em hash.
  4. Responde `201` com `{ id, nome, email, token }` (nunca devolve a senha).

- **`login`**:
  1. Recebe `{ email, senha }`.
  2. Busca o usuário pelo email.
  3. Se não existir **ou** a senha não bater, devolve `401` com a mensagem
     genérica `"Email ou senha invalidos"` (de propósito — não revela se o email
     existe).
  4. Se bater, gera e devolve o token.

A geração do token:

```js
jwt.sign(
    { sub: usuario.id, email: usuario.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
)
```

O `sub` (subject) carrega o ID do usuário — é o campo padrão do JWT para
identificar o dono do token.

### 7.2. Validação das entradas

Arquivo: **`src/validators/authValidator.js`** (usando Zod):

- Registro: `nome` (mín. 1), `email` (formato válido), `senha` (mín. 6).
- Login: `email` válido e `senha` presente.

### 7.3. Middleware de autenticação

Arquivo: **`src/middleware/autenticacao.js`**

```js
function autenticacao(req, res, next) {
    const header = req.headers.authorization
    if (!header) return next(new ErroAutenticacao("Token nao informado"))

    const [esquema, token] = header.split(' ')            // "Bearer <token>"
    if (esquema !== 'Bearer' || !token) {
        return next(new ErroAutenticacao("Formato de token invalido"))
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.usuario = { id: payload.sub, email: payload.email }
        next()
    } catch {
        return next(new ErroAutenticacao("Token invalido ou expirado"))
    }
}
```

- Espera o header no formato **`Authorization: Bearer <token>`**.
- Valida a assinatura e a expiração com `jwt.verify`.
- Em caso de sucesso, injeta `req.usuario` para os controllers usarem.
- Qualquer falha vira `ErroAutenticacao` (HTTP 401), tratado pelo middleware de
  erros.

Foi criada também a classe **`src/errors/ErroAutenticacao.js`** (status 401),
seguindo o mesmo padrão das outras classes de erro do projeto.

### 7.4. Rotas de autenticação

Arquivo: **`src/routes/authRoutes.js`**

```
POST /auth/registrar   → cria usuário e retorna token
POST /auth/login       → autentica e retorna token
```

Registradas no `src/routes/index.js`.

---

## 8. Proteção das rotas

Conforme decidido, **apenas as rotas de escrita** (POST, PUT, DELETE) exigem
login. As rotas de leitura (GET de listagem e por ID) continuam **públicas**.

O middleware `autenticacao` foi adicionado antes do controller nas rotas de
escrita dos três recursos. Exemplo (`livrosRoutes.js`):

```js
routes.get("/livros", LivroController.listarLivros);                          // público
routes.post("/livros", autenticacao, validaLivro, LivroController.cadastrarLivro);   // protegido
routes.get("/livros/:id", LivroController.listaLivroPorId);                   // público
routes.put("/livros/:id", autenticacao, validaLivro, LivroController.atualizaLivro); // protegido
routes.delete("/livros/:id", autenticacao, LivroController.deletarLivro);     // protegido
```

O mesmo padrão foi aplicado a `autoresRoutes.js` e `editoraRoutes.js`.

---

## 9. Como rodar o projeto do zero

```bash
# 1. Instalar dependências
npm install

# 2. Criar o arquivo .env a partir do modelo e ajustar se necessário
cp .env.example .env

# 3. Subir o banco PostgreSQL no Docker
npm run db:up          # docker compose up -d

# 4. Aplicar as migrations (cria as tabelas)
npx prisma migrate dev

# 5. Rodar a API em modo desenvolvimento
npm run dev            # nodemon server.js  → http://localhost:3000
```

Ferramentas extras:

```bash
npm run prisma:studio  # abre uma UI web para inspecionar o banco
npm run db:down        # derruba o container do banco
```

---

## 10. Como testar a API

Fluxo típico com `curl`:

```bash
# 1. Registrar um usuário (retorna um token)
curl -X POST http://localhost:3000/auth/registrar \
  -H "Content-Type: application/json" \
  -d '{"nome":"Rafael","email":"rafael@teste.com","senha":"123456"}'

# 2. Login (retorna um token)
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"rafael@teste.com","senha":"123456"}'

# 3. Listar livros (público, não precisa de token)
curl http://localhost:3000/livros

# 4. Cadastrar uma editora (precisa de token)
curl -X POST http://localhost:3000/editoras \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <SEU_TOKEN>" \
  -d '{"nome_editora":"Editora X","pais_editora":"Brasil","site_editora":"https://x.com","email_contato":"contato@x.com"}'
```

Comportamentos esperados:

- `POST`/`PUT`/`DELETE` **sem** token → `401 { "mensagem": "Token nao informado" }`.
- `POST`/`PUT`/`DELETE` **com** token válido → sucesso normal.
- `GET` sempre funciona sem token.

> **Ordem de cadastro:** para criar um **livro** é preciso já ter um `autor_id`
> e um `editora_id` válidos (chaves estrangeiras). Cadastre autor e editora
> primeiro; se enviar IDs inexistentes, a API responde
> `400 "ID de autor ou editora não existe"` (erro Prisma `P2003`).

---

## 11. Estrutura de arquivos

Arquivos **novos** / **alterados** nesta branch:

```
docker-compose.yml            (novo)  Postgres em Docker
.env / .env.example           (novo)  variáveis de ambiente
.gitignore                    (alt.)  ignora .env, mantém .env.example
package.json                  (alt.)  novas deps + scripts db/prisma
prisma/schema.prisma          (novo)  modelos do banco
prisma/migrations/…           (novo)  SQL das migrations

src/lib/prisma.js             (novo)  instância única do Prisma Client
src/lib/errosPrisma.js        (novo)  mapa de erros do Prisma
src/lib/supabase.js           (removido)
src/lib/errosSupabase.js      (removido)

src/controller/livroController.js     (reescrito p/ Prisma)
src/controller/autoresController.js   (reescrito p/ Prisma)
src/controller/editoraController.js   (reescrito p/ Prisma)
src/controller/authController.js      (novo)  registrar/login

src/validators/authValidator.js       (novo)
src/validators/*Validator.js          (alt.)  correção Zod v4 (.issues)

src/middleware/autenticacao.js        (novo)  verificação de JWT
src/middleware/manipuladorDeErros.js  (alt.)  usa errosPrisma

src/errors/ErroAutenticacao.js        (novo)  erro 401

src/routes/authRoutes.js              (novo)
src/routes/index.js                   (alt.)  registra authRoutes
src/routes/livrosRoutes.js            (alt.)  protege escrita
src/routes/autoresRoutes.js           (alt.)  protege escrita
src/routes/editoraRoutes.js           (alt.)  protege escrita
src/app.js                            (alt.)  remove import do supabase
```
