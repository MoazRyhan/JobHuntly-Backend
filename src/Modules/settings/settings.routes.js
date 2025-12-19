import { Router } from "express";
import * as SettingsController from "./controllers/SettingsApplicant.controller.js"
import validate from "../../Middlewares/validate.js";
import { registerSchema , loginSchema } from "./validators/SettingsApplicant.validator.js";

const SettingsRouter = Router();

SettingsRouter.post("/register"/*, validate(registerSchema)*/, SettingsController.register);


export default SettingsRouter;
