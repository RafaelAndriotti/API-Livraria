import express from "express";
import EditoraController from "../controller/editoraController.js";

const routes = express.Router();

routes.get("/editoras", EditoraController.listarEditoras);
routes.post("/editoras/:id", EditoraController.cadastrarEditora);
routes.get("/editoras/:id", EditoraController.listarEditoraPorId);
routes.put("/atualizarEditora/:id", EditoraController.atualizarEditora);
routes.delete("/deletarEditora/:id", EditoraController.deletarEditora);

export default routes;