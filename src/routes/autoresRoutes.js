import express from "express";
import AutoresController from "../controller/autoresController.js"
import { validaAutores } from "../validators/autoresValidator.js";

const routes = express.Router();

routes.get("/autores", AutoresController.listarAutores);
routes.post("/autores", validaAutores, AutoresController.cadastrarAutor);
routes.get("/autores/:id", AutoresController.listarAutorPorId);
routes.put("/autores/:id", validaAutores, AutoresController.atualizarAutor);
routes.delete("/autores/:id", AutoresController.deletarAutor);

export default routes;