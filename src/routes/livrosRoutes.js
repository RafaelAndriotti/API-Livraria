import express from "express";
import LivroController from "../controller/livroController.js";
import { validaLivro } from "../validators/livroValidator.js";

const routes = express.Router();

routes.get("/livros", LivroController.listarLivros);
routes.post("/livros", validaLivro, LivroController.cadastrarLivro);
routes.get("/livros/:id", LivroController.listaLivroPorId);
routes.put("/livros/:id", validaLivro, LivroController.atualizaLivro);
routes.delete("/livros/:id", LivroController.deletarLivro);

export default routes;