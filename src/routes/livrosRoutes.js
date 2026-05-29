import express from "express";
import LivroController from "../controller/livroController.js";

const routes = express.Router();

routes.get("/livros", LivroController.listarLivros);
routes.post("/livros", LivroController.cadastrarLivro);
routes.get("/livros/:id", LivroController.listaLivroPorId);
routes.put("/livros/:id", LivroController.atualizaLivro);
routes.delete("/livros/:id", LivroController.deletarLivro);

export default routes;