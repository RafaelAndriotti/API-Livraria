<div align="center">
# 📚 API Livraria
 
API RESTful para gerenciamento de um catálogo de livraria — **livros**, **autores** e **editoras** — construída com Node.js, Express e Supabase.
 
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express%205-000000?style=for-the-badge&logo=express&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
 
🚧 Projeto em desenvolvimento ativo
 
</div>
## 📖 Sobre o projeto
 
A **API Livraria** é uma API REST criada para praticar arquitetura de back-end em camadas (rotas → validação → controller → banco de dados), integração com um banco de dados externo e tratamento consistente de erros.
 
Ela gerencia três entidades que se relacionam entre si:
 
- 📕 **Livros** — cadastro de obras, vinculadas a um autor e a uma editora
- ✍️ **Autores** — dados dos autores das obras
- 🏢 **Editoras** — dados das editoras responsáveis pela publicação
## ✨ Funcionalidades
 
- CRUD completo (criar, listar, buscar por ID, atualizar e excluir) para livros, autores e editoras
- Paginação em todas as listagens
- Filtros de busca (título, gênero e ano de publicação para livros; nome e nacionalidade para autores; nome e país para editoras)
- Validação de dados de entrada com [Zod](https://zod.dev/)
- Tratamento centralizado de erros, com mapeamento de erros específicos do Postgres/Supabase (registro não encontrado, duplicidade, chave estrangeira inválida, campo obrigatório ausente)
## 🛠️ Tecnologias utilizadas
 
| Tecnologia | Uso |
|---|---|
| [Node.js](https://nodejs.org/) | Ambiente de execução |
| [Express 5](https://expressjs.com/) | Framework HTTP / rotas |
| [Supabase](https://supabase.com/) | Banco de dados (PostgreSQL) e cliente JS |
| [Zod](https://zod.dev/) | Validação de esquemas |
| [dotenv](https://www.npmjs.com/package/dotenv) | Variáveis de ambiente |
| [ESLint](https://eslint.org/) | Padronização de código |
| [nodemon](https://www.npmjs.com/package/nodemon) | Reinício automático em desenvolvimento |
 
## 📁 Estrutura do projeto
 
```
API-Livraria/
├── server.js                 # Ponto de entrada da aplicação (porta 3000)
├── src/
│   ├── app.js                 # Configuração do Express e middlewares
│   ├── controller/            # Regras de negócio de cada recurso
│   │   ├── livroController.js
│   │   ├── autoresController.js
│   │   └── editoraController.js
│   ├── routes/                # Definição das rotas HTTP
│   │   ├── index.js
│   │   ├── livrosRoutes.js
│   │   ├── autoresRoutes.js
│   │   └── editoraRoutes.js
│   ├── validators/            # Esquemas de validação (Zod)
│   ├── errors/                # Classes de erro customizadas
│   ├── middleware/             # Middleware global de tratamento de erros
│   └── lib/                   # Cliente do Supabase e mapeamento de erros do banco
└── package.json
```
 
## 🚀 Como executar
 
### Pré-requisitos
- [Node.js](https://nodejs.org/) 18 ou superior
- Uma conta e um projeto criado no [Supabase](https://supabase.com/)
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
Crie um arquivo `.env` na raiz do projeto:
 
```bash
SUPABASE_URL=https://SEU_PROJETO.supabase.co
ANON_KEY=sua_chave_anon_do_supabase
```
 
Esses valores ficam em **Project Settings → API** no painel do Supabase.
 
### 4. Crie as tabelas no Supabase
O projeto espera três tabelas no banco. Segue um esquema sugerido, inferido a partir do código (rotas, controllers e validações), já que as migrations não fazem parte do repositório — ajuste conforme sua necessidade:
 
```sql
create table autores (
  id uuid primary key default gen_random_uuid(),
  autor_nome text not null,
  nacionalidade_autor text,
  data_nascimento date,
  biografia text
);
 
create table editoras (
  id uuid primary key default gen_random_uuid(),
  nome_editora text not null,
  pais_editora text,
  site_editora text,
  email_contato text
);
 
create table livros (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  autor_id uuid references autores(id),
  editora_id uuid references editoras(id),
  isbn text unique,
  preco numeric,
  paginas integer,
  ano_publicacao integer,
  genero text,
  estoque integer,
  sinopse text
);
```
 
### 5. Inicie o servidor
```bash
npm run dev
```
A API sobe em `http://localhost:3000` (porta fixa definida em `server.js`).
 
### 6. Teste rapidamente
```bash
curl http://localhost:3000/livros
 
curl -X POST http://localhost:3000/autores \
  -H "Content-Type: application/json" \
  -d '{"autor_nome":"Machado de Assis","nacionalidade_autor":"Brasileira","data_nascimento":"1839-06-21","biografia":"Um dos maiores nomes da literatura brasileira."}'
```
 
## 🔌 Endpoints da API
 
| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/` | Mensagem de status da API |
| GET | `/livros` | Lista livros (paginado e filtrável) |
| POST | `/livros` | Cadastra um livro |
| GET | `/livros/:id` | Busca um livro por ID |
| PUT | `/livros/:id` | Atualiza um livro |
| DELETE | `/livros/:id` | Remove um livro |
| GET | `/autores` | Lista autores (paginado e filtrável) |
| POST | `/autores` | Cadastra um autor |
| GET | `/autores/:id` | Busca um autor por ID |
| PUT | `/autores/:id` | Atualiza um autor |
| DELETE | `/autores/:id` | Remove um autor |
| GET | `/editoras` | Lista editoras (paginado e filtrável) |
| POST | `/editoras` | Cadastra uma editora |
| GET | `/editoras/:id` | Busca uma editora por ID |
| PUT | `/editoras/:id` | Atualiza uma editora |
| DELETE | `/editoras/:id` | Remove uma editora |
 
> Todas as listagens aceitam `pagina` e `limite` (máximo de 10 itens por página) além dos filtros específicos abaixo. Os filtros de texto fazem busca parcial e não diferenciam maiúsculas/minúsculas, exceto `genero`, que exige correspondência exata.
 
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
 
#### `POST /livros`
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
 
#### `GET /livros/:id`
Retorna o objeto do livro, ou erro `404` se o ID não existir.
 
#### `PUT /livros/:id`
Mesmo corpo do cadastro (exceto `autor_id`/`editora_id`). Resposta `200`:
```json
"Informacoes do livro Dom Casmurro atualizadas com sucesso"
```
 
#### `DELETE /livros/:id`
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
 
#### `POST /autores`
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
 
#### `GET /autores/:id` · `PUT /autores/:id` · `DELETE /autores/:id`
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
 
#### `POST /editoras`
```json
{
  "nome_editora": "Editora Nova Fronteira",
  "pais_editora": "Brasil",
  "site_editora": "https://www.novafronteira.com.br",
  "email_contato": "contato@novafronteira.com.br"
}
```
Resposta `201` (texto): `A editora Editora Nova Fronteira foi criada com sucesso.`
 
#### `GET /editoras/:id` · `PUT /editoras/:id` · `DELETE /editoras/:id`
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
| `autor_id` ou `editora_id` inexistente | 400 |
| Registro não encontrado | 404 |
| Registro duplicado (ex: ISBN já cadastrado) | 409 |
| Erro inesperado | 500 |
 
## 🗺️ Roadmap
 
Possíveis evoluções para as próximas versões:
 
- [ ] Autenticação e autorização (ex: JWT)
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
