import express from "express";
import AuthController from "../controller/authController.js";
import { validaRegistro, validaLogin } from "../validators/authValidator.js";

const routes = express.Router();

routes.post("/auth/registrar", validaRegistro, AuthController.registrar);
routes.post("/auth/login", validaLogin, AuthController.login);

export default routes;
