import express from "express";
import LivroController from "../controller/livroController.js";
import { validaLivro } from "../validators/livroValidator.js";

const routes = express.Router();

routes.get("/livros", validaLivro, LivroController.listarLivros);
routes.post("/livros", validaLivro, LivroController.cadastrarLivro);
routes.get("/livros/:id", validaLivro, LivroController.listaLivroPorId);
routes.put("/livros/:id", validaLivro, LivroController.atualizaLivro);
routes.delete("/livros/:id", validaLivro, LivroController.deletarLivro);

export default routes;