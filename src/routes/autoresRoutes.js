import express from "express";
import AutoresController from "../controller/autoresController.js"
import { validaAutores } from "../validators/autoresValidator.js";
import autenticacao from "../middleware/autenticacao.js";

const routes = express.Router();

routes.get("/autores", AutoresController.listarAutores);
routes.post("/autores", autenticacao, validaAutores, AutoresController.cadastrarAutor);
routes.get("/autores/:id", AutoresController.listarAutorPorId);
routes.put("/autores/:id", autenticacao, validaAutores, AutoresController.atualizarAutor);
routes.delete("/autores/:id", autenticacao, AutoresController.deletarAutor);

export default routes;