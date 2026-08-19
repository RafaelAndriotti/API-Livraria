<div align="center">

# 📚 API Livraria

API RESTful para gerenciamento de um catálogo de livraria — **livros**, **autores** e **editoras** — construída com Node.js, Express, PostgreSQL (Docker) e Prisma, com autenticação via JWT.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express%205-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

🚧 Projeto em desenvolvimento ativo

</div>

## 📖 Sobre o projeto

A **API Livraria** é uma API REST criada para praticar arquitetura de back-end em camadas (rotas → autenticação → validação → controller → banco de dados), uso de um ORM com migrations, banco de dados em container e tratamento consistente de erros.

Ela gerencia três entidades que se relacionam entre si, além do controle de usuários para autenticação:

- 📕 **Livros** — cadastro de obras, vinculadas a um autor e a uma editora
- ✍️ **Autores** — dados dos autores das obras
- 🏢 **Editoras** — dados das editoras responsáveis pela publicação
- 👤 **Usuários** — cadastro e login para proteger as rotas de escrita

## ✨ Funcionalidades

- CRUD completo (criar, listar, buscar por ID, atualizar e excluir) para livros, autores e editoras
- Autenticação com **JWT**; senhas armazenadas como hash **bcrypt**
- Rotas de **escrita** (POST/PUT/DELETE) protegidas por token; rotas de **leitura** (GET) públicas
- Paginação em todas as listagens
- Filtros de busca (título, gênero e ano de publicação para livros; nome e nacionalidade para autores; nome e país para editoras)
- Validação de dados de entrada com [Zod](https://zod.dev/)
- Banco **PostgreSQL** rodando em **Docker**, com schema versionado via **Prisma** (migrations)
- Tratamento centralizado de erros, com mapeamento dos códigos de erro do Prisma (registro não encontrado, duplicidade, chave estrangeira inválida)

## 🛠️ Tecnologias utilizadas

| Tecnologia | Uso |
|---|---|
| [Node.js](https://nodejs.org/) | Ambiente de execução |
| [Express 5](https://expressjs.com/) | Framework HTTP / rotas |
| [PostgreSQL](https://www.postgresql.org/) | Banco de dados |
| [Docker](https://www.docker.com/) | Container do banco de dados |
| [Prisma](https://www.prisma.io/) | ORM (schema, migrations e client) |
| [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) | Geração/validação de tokens JWT |
| [bcryptjs](https://www.npmjs.com/package/bcryptjs) | Hash de senhas |
| [Zod](https://zod.dev/) | Validação de esquemas |
| [dotenv](https://www.npmjs.com/package/dotenv) | Variáveis de ambiente |
| [ESLint](https://eslint.org/) | Padronização de código |
| [nodemon](https://www.npmjs.com/package/nodemon) | Reinício automático em desenvolvimento |

> 📄 Uma explicação detalhada de toda a implementação (Docker, Prisma e autenticação) está em [`IMPLEMENTACAO.md`](./IMPLEMENTACAO.md).

## 📁 Estrutura do projeto

```
API-Livraria/
├── docker-compose.yml         # PostgreSQL em container
├── .env.example               # Modelo das variáveis de ambiente
├── prisma/
│   ├── schema.prisma          # Modelos do banco (Autor, Editora, Livro, Usuario)
│   └── migrations/            # Histórico de migrations versionadas
├── server.js                  # Ponto de entrada da aplicação (porta 3000)
├── src/
│   ├── app.js                 # Configuração do Express e middlewares
│   ├── controller/            # Regras de negócio de cada recurso
│   │   ├── livroController.js
│   │   ├── autoresController.js
│   │   ├── editoraController.js
│   │   └── authController.js   # Registro e login
│   ├── routes/                # Definição das rotas HTTP
│   │   ├── index.js
│   │   ├── authRoutes.js
│   │   ├── livrosRoutes.js
│   │   ├── autoresRoutes.js
│   │   └── editoraRoutes.js
│   ├── validators/            # Esquemas de validação (Zod)
│   ├── errors/                # Classes de erro customizadas
│   ├── middleware/            # Autenticação (JWT) e tratamento de erros
│   └── lib/                   # Prisma Client e mapeamento de erros do banco
└── package.json
```

## 🚀 Como executar

### Pré-requisitos
- [Node.js](https://nodejs.org/) 18 ou superior
- [Docker](https://www.docker.com/) e Docker Compose

### 1. Clone o repositório
```bash
git clone https://github.com/RafaelAndriotti/API-Livraria.git
cd API-Livraria
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Copie o modelo e ajuste se necessário:
```bash
cp .env.example .env
```

O `.env` contém:
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

> A porta do Postgres é exposta no host como **55432** (para evitar conflito com instâncias locais na 5432). O `.env` **nunca** deve ser commitado — ele já está no `.gitignore`.

### 4. Suba o banco de dados
```bash
npm run db:up          # docker compose up -d
```

### 5. Aplique as migrations (cria as tabelas)
```bash
npx prisma migrate dev
```

### 6. Inicie o servidor
```bash
npm run dev
```
A API sobe em `http://localhost:3000` (porta fixa definida em `server.js`).

### Scripts disponíveis
| Script | Ação |
|---|---|
| `npm run dev` | Inicia a API com nodemon |
| `npm run db:up` | Sobe o container do PostgreSQL |
| `npm run db:down` | Derruba o container do PostgreSQL |
| `npm run prisma:migrate` | Cria/aplica migrations |
| `npm run prisma:generate` | Regenera o Prisma Client |
| `npm run prisma:studio` | Abre a UI do Prisma Studio |

### 7. Teste rapidamente
```bash
# Registrar um usuário (retorna um token JWT)
curl -X POST http://localhost:3000/auth/registrar \
  -H "Content-Type: application/json" \
  -d '{"nome":"Rafael","email":"rafael@teste.com","senha":"123456"}'

# Listar livros (rota pública)
curl http://localhost:3000/livros
```

## 🔐 Autenticação

O acesso de **escrita** exige um token JWT. Fluxo:

1. **Registre** um usuário em `POST /auth/registrar` **ou** faça **login** em `POST /auth/login`. Ambos retornam um `token`.
2. Envie o token no header das requisições de escrita:
   ```
   Authorization: Bearer <SEU_TOKEN>
   ```

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/auth/registrar` | Cria um usuário e retorna um token |
| POST | `/auth/login` | Autentica e retorna um token |

- Rotas **GET** (listar e buscar por ID) são **públicas**.
- Rotas **POST/PUT/DELETE** exigem token válido, senão retornam `401`.

## 🔌 Endpoints da API

> 🔒 = requer header `Authorization: Bearer <token>`

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/` | Mensagem de status da API |
| POST | `/auth/registrar` | Cria um usuário |
| POST | `/auth/login` | Autentica um usuário |
| GET | `/livros` | Lista livros (paginado e filtrável) |
| POST | `/livros` 🔒 | Cadastra um livro |
| GET | `/livros/:id` | Busca um livro por ID |
| PUT | `/livros/:id` 🔒 | Atualiza um livro |
| DELETE | `/livros/:id` 🔒 | Remove um livro |
| GET | `/autores` | Lista autores (paginado e filtrável) |
| POST | `/autores` 🔒 | Cadastra um autor |
| GET | `/autores/:id` | Busca um autor por ID |
| PUT | `/autores/:id` 🔒 | Atualiza um autor |
| DELETE | `/autores/:id` 🔒 | Remove um autor |
| GET | `/editoras` | Lista editoras (paginado e filtrável) |
| POST | `/editoras` 🔒 | Cadastra uma editora |
| GET | `/editoras/:id` | Busca uma editora por ID |
| PUT | `/editoras/:id` 🔒 | Atualiza uma editora |
| DELETE | `/editoras/:id` 🔒 | Remove uma editora |

> Todas as listagens aceitam `pagina` e `limite` (máximo de 10 itens por página) além dos filtros específicos abaixo. Os filtros de texto fazem busca parcial e não diferenciam maiúsculas/minúsculas.

<details>
<summary><strong>👤 Autenticação</strong></summary>

#### `POST /auth/registrar`
```json
{
  "nome": "Rafael",
  "email": "rafael@teste.com",
  "senha": "123456"
}
```
Resposta `201`:
```json
{
  "id": "8c093988-fd8f-4308-83b1-9a2fdf7e2a8b",
  "nome": "Rafael",
  "email": "rafael@teste.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### `POST /auth/login`
```json
{
  "email": "rafael@teste.com",
  "senha": "123456"
}
```
Resposta `200`:
```json
{ "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
```
Credenciais inválidas retornam `401 { "mensagem": "Email ou senha invalidos", "status": 401 }`.

</details>

<details>
<summary><strong>📕 Livros</strong></summary>

#### `GET /livros`
Filtros aceitos: `titulo`, `genero`, `ano_publicacao`

Exemplo: `GET /livros?genero=Romance&pagina=1&limite=10`

```json
{
  "dados": [
    {
      "id": "b3f1c2e0-1234-4a5b-8c9d-abcdef123456",
      "titulo": "Dom Casmurro",
      "autor_id": "a4a1f0a0-1111-4a5b-8c9d-abcdef123456",
      "editora_id": "c5b2d1e0-2222-4a5b-8c9d-abcdef123456",
      "isbn": "978-8535911664",
      "preco": 39.9,
      "paginas": 256,
      "ano_publicacao": 1899,
      "genero": "Romance",
      "estoque": 15,
      "sinopse": "A história de Bentinho e sua desconfiança em relação a Capitu."
    }
  ],
  "paginacao": { "total": 1, "pagina": 1, "limite": 10, "total_pagina": 1 }
}
```

#### `POST /livros` 🔒
```json
{
  "titulo": "Dom Casmurro",
  "autor_id": "a4a1f0a0-1111-4a5b-8c9d-abcdef123456",
  "editora_id": "c5b2d1e0-2222-4a5b-8c9d-abcdef123456",
  "isbn": "978-8535911664",
  "preco": 39.9,
  "paginas": 256,
  "ano_publicacao": 1899,
  "genero": "Romance",
  "estoque": 15,
  "sinopse": "A história de Bentinho e sua desconfiança em relação a Capitu."
}
```
Resposta `201`:
```json
{ "message": "O livro Dom Casmurro foi criado com sucesso" }
```

> `autor_id` e `editora_id` precisam existir. IDs inexistentes retornam `400 "ID de autor ou editora não existe"`.

#### `GET /livros/:id`
Retorna o objeto do livro, ou erro `404` se o ID não existir.

#### `PUT /livros/:id` 🔒
Mesmo corpo do cadastro (exceto `autor_id`/`editora_id`). Resposta `200`:
```json
"Informacoes do livro Dom Casmurro atualizadas com sucesso"
```

#### `DELETE /livros/:id` 🔒
Resposta `200` (texto): `Livro deletado com sucesso`

</details>

<details>
<summary><strong>✍️ Autores</strong></summary>

#### `GET /autores`
Filtros aceitos: `autor_nome`, `nacionalidade_autor`

```json
{
  "dados": [
    {
      "id": "a4a1f0a0-1111-4a5b-8c9d-abcdef123456",
      "autor_nome": "Machado de Assis",
      "nacionalidade_autor": "Brasileira",
      "data_nascimento": "1839-06-21",
      "biografia": "Um dos maiores nomes da literatura brasileira, fundador da Academia Brasileira de Letras."
    }
  ],
  "paginacao": { "total": 1, "pagina": 1, "limite": 10, "total_pagina": 1 }
}
```

#### `POST /autores` 🔒
```json
{
  "autor_nome": "Machado de Assis",
  "nacionalidade_autor": "Brasileira",
  "data_nascimento": "1839-06-21",
  "biografia": "Um dos maiores nomes da literatura brasileira, fundador da Academia Brasileira de Letras."
}
```
Resposta `201`:
```json
{ "message": "O autor Machado de Assis foi cadastrado com sucesso." }
```

#### `GET /autores/:id` · `PUT /autores/:id` 🔒 · `DELETE /autores/:id` 🔒
Mesmo padrão de `/livros`: retornam o autor, uma mensagem de confirmação, ou erro `404`.

</details>

<details>
<summary><strong>🏢 Editoras</strong></summary>

#### `GET /editoras`
Filtros aceitos: `nome_editora`, `pais_editora`

```json
{
  "dados": [
    {
      "id": "c5b2d1e0-2222-4a5b-8c9d-abcdef123456",
      "nome_editora": "Editora Nova Fronteira",
      "pais_editora": "Brasil",
      "site_editora": "https://www.novafronteira.com.br",
      "email_contato": "contato@novafronteira.com.br"
    }
  ],
  "paginacao": { "total": 1, "pagina": 1, "limite": 10, "total_pagina": 1 }
}
```

#### `POST /editoras` 🔒
```json
{
  "nome_editora": "Editora Nova Fronteira",
  "pais_editora": "Brasil",
  "site_editora": "https://www.novafronteira.com.br",
  "email_contato": "contato@novafronteira.com.br"
}
```
Resposta `201` (texto): `A editora Editora Nova Fronteira foi criada com sucesso.`

#### `GET /editoras/:id` · `PUT /editoras/:id` 🔒 · `DELETE /editoras/:id` 🔒
Mesmo padrão dos demais recursos.

</details>

## ⚠️ Tratamento de erros

Erros da aplicação seguem o formato:
```json
{
  "mensagem": "Registro nao encontrado.",
  "status": 404
}
```

| Situação | Status |
|---|---|
| Dado obrigatório ausente ou inválido | 400 |
| `autor_id` ou `editora_id` inexistente (FK) | 400 |
| Token ausente, inválido ou expirado | 401 |
| Registro não encontrado | 404 |
| Registro duplicado (ex: ISBN ou email já cadastrado) | 409 |
| Erro inesperado | 500 |

## 🗺️ Roadmap

Possíveis evoluções para as próximas versões:

- [x] Banco PostgreSQL em Docker
- [x] Migração para o ORM Prisma
- [x] Autenticação e autorização (JWT)
- [ ] Autorização por papéis (ex: admin vs. usuário comum)
- [ ] Testes automatizados
- [ ] Documentação interativa (Swagger/OpenAPI)
- [ ] Deploy com URL pública para testes
- [ ] Padronizar o formato de resposta entre os endpoints (hoje mistura JSON e texto simples)

## 🤝 Contribuindo

Este é um projeto pessoal de estudos, mas sugestões e feedback são muito bem-vindos! Sinta-se à vontade para abrir uma issue ou enviar um pull request.

## 👤 Autor

Desenvolvido por [Rafael Andriotti](https://github.com/RafaelAndriotti)

## 📝 Licença

Ainda não definida. Para tornar o uso e a contribuição mais claros, vale considerar uma licença permissiva como a [MIT](https://choosealicense.com/licenses/mit/).
