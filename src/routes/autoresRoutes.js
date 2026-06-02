import express from "express";
import AutoresController from "../controller/autoresController.js"

const routes = express.Router();

routes.get("/autores", AutoresController.listarAutores);
routes.post("/autores", AutoresController.cadastrarAutor);
routes.get("/autores/:id", AutoresController.listarAutorPorId);
routes.put("/atualizarAutor/:id", AutoresController.atualizarAutor);
routes.delete("/deletarAutor/:id", AutoresController.deletarAutor);

export default routes;