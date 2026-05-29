import express from "express";
import AutoresController from "../controller/autoresController.js"

const routes = express.Router();

routes.get("/autores", AutoresController.listarAutores);
routes.post("/autores", AutoresController.cadastrarAutor);

export default routes;