import express from "express";
import EditoraController from "../controller/editoraController.js";
import { validaEditora } from "../validators/editoraValidator.js";

const routes = express.Router();

routes.get("/editoras", EditoraController.listarEditoras);
routes.post("/editoras",validaEditora , EditoraController.cadastrarEditora);
routes.get("/editoras/:id", EditoraController.listarEditoraPorId);
routes.put("/editoras/:id",validaEditora , EditoraController.atualizarEditora);
routes.delete("/editoras/:id", EditoraController.deletarEditora);

export default routes;