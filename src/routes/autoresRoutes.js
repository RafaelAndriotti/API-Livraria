import express from "express";
import AutoresController from "../controller/autoresController.js"
import { validaAutores } from "../validators/autoresValidator.js";

const routes = express.Router();

routes.get("/autores", validaAutores, AutoresController.listarAutores);
routes.post("/autores", validaAutores, AutoresController.cadastrarAutor);
routes.get("/autores/:id", validaAutores, AutoresController.listarAutorPorId);
routes.put("/autores/:id", validaAutores, AutoresController.atualizarAutor);
routes.delete("/autores/:id", validaAutores, AutoresController.deletarAutor);

export default routes;