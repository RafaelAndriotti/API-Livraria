# 📚 API Livraria - Sistema de Gerenciamento de Biblioteca
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2018.0.0-blue.svg)](https://nodejs.org)
[![Express](https://img.shields.io/badge/express-v5.x-green.svg)](https://expressjs.com)
[![Supabase](https://img.shields.io/badge/database-Supabase-emerald.svg)](https://supabase.com)
[![Zod](https://img.shields.io/badge/validation-Zod-purple.svg)](https://zod.dev)
[![License](https://img.shields.io/badge/license-ISC-lightgrey.svg)](https://opensource.org/licenses/ISC)
Uma API REST robusta e moderna para gerenciamento de uma livraria/biblioteca, desenvolvida em **Node.js** utilizando o framework **Express**. A API gerencia livros, autores e editoras, integrando o **Supabase** como banco de dados e **Zod** para validação robusta de esquemas.
---
## 🛠️ Tecnologias Utilizadas
- **Runtime:** Node.js (ES Modules)
- **Framework Web:** [Express](https://expressjs.com/)
- **Banco de Dados:** [Supabase](https://supabase.com/) (PostgreSQL gerenciado)
- **Validação de Dados:** [Zod](https://zod.dev/)
- **Variáveis de Ambiente:** [Dotenv](https://github.com/motdotla/dotenv)
- **Linter/Code Style:** [ESLint](https://eslint.org/)
- **Ambiente de Desenvolvimento:** [Nodemon](https://nodemon.io/)
---
## 🚀 Funcionalidades Principais
- **CRUD Completo:** Criação, leitura, atualização e exclusão para as entidades:
  - 📖 **Livros**
  - 👤 **Autores**
  - 🏢 **Editoras**
- **Paginação Inteligente:** Listagens paginadas para evitar sobrecarga de dados no cliente, com controle dinâmico de página e limite.
- **Filtros Avançados:** Pesquisa textual (case-insensitive) e exata nas rotas de busca de livros, autores e editoras.
- **Validação de Entrada:** Validação detalhada dos corpos das requisições via middlewares Zod antes do processamento no banco.
- **Tratamento Global de Erros:** Middleware centralizado para interceptar e formatar respostas de erro, mapeando códigos de erro do banco de dados (Supabase/PostgreSQL) para respostas HTTP adequadas (400, 404, 409, 500).
---
## 📐 Estrutura do Banco de Dados (Supabase)
Para rodar a API, certifique-se de ter as seguintes tabelas criadas no seu banco de dados Supabase:
### 1. Tabela `autores`
- `id` (uuid, Chave Primária, default: `gen_random_uuid()`)
- `autor_nome` (text, obrigatório)
- `nacionalidade_autor` (text)
- `data_nascimento` (date/text)
- `biografia` (text)
### 2. Tabela `editoras`
- `id` (uuid, Chave Primária, default: `gen_random_uuid()`)
- `nome_editora` (text, obrigatório)
- `pais_editora` (text)
- `site_editora` (text)
- `email_contato` (text)
### 3. Tabela `livros`
- `id` (uuid, Chave Primária, default: `gen_random_uuid()`)
- `titulo` (text, obrigatório)
- `autor_id` (uuid, Chave Estrangeira referenciando `autores.id`)
- `editora_id` (uuid, Chave Estrangeira referenciando `editoras.id`)
- `isbn` (text, obrigatório, único)
- `preco` (numeric, obrigatório)
- `paginas` (integer)
- `ano_publicacao` (integer)
- `genero` (text)
- `estoque` (integer, default: 0)
- `sinopse` (text)
---
## 🚦 Rotas da API
### Livros (`/livros`)
|
 Método 
|
 Endpoint 
|
 Descrição 
|
 Parâmetros de Query (Opcionais) 
|
|
:---
|
:---
|
:---
|
:---
|
|
**
GET
**
|
`/livros`
|
 Lista todos os livros cadastrados (paginado) 
|
`pagina`
, 
`limite`
, 
`titulo`
, 
`genero`
, 
`ano_publicacao`
|
|
**
GET
**
|
`/livros/:id`
|
 Retorna os detalhes de um livro específico 
|
 - 
|
|
**
POST
**
|
`/livros`
|
 Cadastra um novo livro (Requer Validação Zod) 
|
 - 
|
|
**
PUT
**
|
`/livros/:id`
|
 Atualiza as informações de um livro 
|
 - 
|
|
**
DELETE
**
|
`/livros/:id`
|
 Remove um livro do catálogo 
|
 - 
|
### Autores (`/autores`)
|
 Método 
|
 Endpoint 
|
 Descrição 
|
 Parâmetros de Query (Opcionais) 
|
|
:---
|
:---
|
:---
|
:---
|
|
**
GET
**
|
`/autores`
|
 Lista todos os autores cadastrados (paginado) 
|
`pagina`
, 
`limite`
, 
`autor_nome`
, 
`nacionalidade_autor`
|
|
**
GET
**
|
`/autores/:id`
|
 Retorna os detalhes de um autor específico 
|
 - 
|
|
**
POST
**
|
`/autores`
|
 Cadastra um novo autor (Requer Validação Zod) 
|
 - 
|
|
**
PUT
**
|
`/autores/:id`
|
 Atualiza as informações de um autor 
|
 - 
|
|
**
DELETE
**
|
`/autores/:id`
|
 Remove um autor do banco 
|
 - 
|
### Editoras (`/editoras`)
|
 Método 
|
 Endpoint 
|
 Descrição 
|
 Parâmetros de Query (Opcionais) 
|
|
:---
|
:---
|
:---
|
:---
|
|
**
GET
**
|
`/editoras`
|
 Lista todas as editoras cadastradas (paginado) 
|
`pagina`
, 
`limite`
, 
`nome_editora`
, 
`pais_editora`
|
|
**
GET
**
|
`/editoras/:id`
|
 Retorna os detalhes de uma editora específica 
|
 - 
|
|
**
POST
**
|
`/editoras`
|
 Cadastra uma nova editora (Requer Validação Zod) 
|
 - 
|
|
**
PUT
**
|
`/editoras/:id`
|
 Atualiza as informações de uma editora 
|
 - 
|
|
**
DELETE
**
|
`/editoras/:id`
|
 Remove uma editora do banco 
|
 - 
|
---
## ⚙️ Configuração e Instalação
### Pré-requisitos
- [Node.js](https://nodejs.org) (v18 ou superior recomendado)
- Uma conta no [Supabase](https://supabase.com) com um projeto ativo.
### Passo a Passo
1. **Clonar o Repositório:**
   ```bash
   git clone https://github.com/RafaelAndriotti/API-Livraria.git
   cd API-Livraria
   ```
2. **Instalar Dependências:**
   ```bash
   npm install
   ```
3. **Configurar as Variáveis de Ambiente:**
   Crie um arquivo `.env` na raiz do projeto (use o `.env.example` como base) com suas credenciais do Supabase:
   ```env
   SUPABASE_URL=sua_url_do_supabase_aqui
   ANON_KEY=sua_anon_key_do_supabase_aqui
   ```
4. **Iniciar o Servidor em Modo de Desenvolvimento:**
   ```bash
   npm run dev
   ```
   O servidor estará ativo em `http://localhost:3000`.
---
## 🤝 Contribuição
Contribuições são super bem-vindas! Sinta-se à vontade para abrir Issues ou enviar Pull Requests.
1. Faça um Fork do projeto.
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFeature`).
3. Faça commit de suas alterações (`git commit -m 'Adiciona nova feature'`).
4. Envie a branch (`git push origin feature/NovaFeature`).
5. Abra um Pull Request.
---
## 📄 Licença
Este projeto está sob a licença ISC. Consulte o arquivo [LICENSE](LICENSE) para obter mais informações.
