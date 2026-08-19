import express from "express";
import LivroController from "../controller/livroController.js";
import { validaLivro } from "../validators/livroValidator.js";
import autenticacao from "../middleware/autenticacao.js";

const routes = express.Router();

routes.get("/livros", LivroController.listarLivros);
routes.post("/livros", autenticacao, validaLivro, LivroController.cadastrarLivro);
routes.get("/livros/:id", LivroController.listaLivroPorId);
routes.put("/livros/:id", autenticacao, validaLivro, LivroController.atualizaLivro);
routes.delete("/livros/:id", autenticacao, LivroController.deletarLivro);

export default routes;