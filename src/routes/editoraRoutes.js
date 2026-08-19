import express from "express";
import EditoraController from "../controller/editoraController.js";
import { validaEditora } from "../validators/editoraValidator.js";
import autenticacao from "../middleware/autenticacao.js";

const routes = express.Router();

routes.get("/editoras", EditoraController.listarEditoras);
routes.post("/editoras", autenticacao, validaEditora, EditoraController.cadastrarEditora);
routes.get("/editoras/:id", EditoraController.listarEditoraPorId);
routes.put("/editoras/:id", autenticacao, validaEditora, EditoraController.atualizarEditora);
routes.delete("/editoras/:id", autenticacao, EditoraController.deletarEditora);

export default routes;