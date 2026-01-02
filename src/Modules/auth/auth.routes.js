import { Router } from "express";
import * as authController from "./controllers/auth.controller.js"
import validate from "../../Middlewares/validate.js";
import { registerSchema , loginSchema } from "./validators/auth.validator.js";
import { AuthenticationMiddleware} from '../../Middlewares/AuthenticationMiddleware.js';
import { forgotPassword,resetPassword } from "./controllers/forgotPassword.controller.js";

const AuthRouter = Router();

AuthRouter.post("/register"/*, validate(registerSchema)*/, authController.register);
AuthRouter.post("/login"/*,validate(loginSchema)*/, authController.login);
AuthRouter.post("/refresh", authController.refresh);


AuthRouter.get(
  "/me",
  AuthenticationMiddleware(),
  (req, res) => {
    res.status(200).json({
      success: true,
      user: req.login_user,
    });
  }
);

AuthRouter.post("/forgot-password", forgotPassword);
AuthRouter.post("/reset-password", resetPassword);




// 🚨 Use only once (or protect later)
AuthRouter.post("/admin/register", authController.createAdmin);



export default AuthRouter;
