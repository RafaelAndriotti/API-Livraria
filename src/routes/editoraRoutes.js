import express from "express";
import EditoraController from "../controller/editoraController.js";
import { validaEditora } from "../validators/editoraValidator.js";

const routes = express.Router();

routes.get("/editoras",validaEditora , EditoraController.listarEditoras);
routes.post("/editoras",validaEditora , EditoraController.cadastrarEditora);
routes.get("/editoras/:id",validaEditora , EditoraController.listarEditoraPorId);
routes.put("/editoras/:id",validaEditora , EditoraController.atualizarEditora);
routes.delete("/editoras/:id",validaEditora , EditoraController.deletarEditora);

export default routes;