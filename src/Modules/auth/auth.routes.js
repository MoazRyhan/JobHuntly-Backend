import { Router } from "express";
import * as authController from "./controllers/auth.controller.js"
import validate from "../../Middlewares/validate.js";
import { registerSchema , loginSchema } from "./validators/auth.validator.js";

const AuthRouter = Router();

AuthRouter.post("/register"/*, validate(registerSchema)*/, authController.register);
AuthRouter.post("/login"/*,validate(loginSchema)*/, authController.login);
AuthRouter.post("/refresh", authController.refresh);

export default AuthRouter;
