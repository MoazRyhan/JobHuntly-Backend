import { Router } from "express";
import * as SettingsController from "./controllers/SettingsApplicant.controller.js"
import validate from "../../Middlewares/validate.js";
import { registerSchema , loginSchema } from "./validators/SettingsApplicant.validator.js";
import { AuthenticationMiddleware } from "../../Middlewares/AuthenticationMiddleware.js";

const SettingsRouter = Router();

// =======>  Applicant 
SettingsRouter.use( AuthenticationMiddleware() )

SettingsRouter.put("/updataProfile", SettingsController.updataProfile);


export default SettingsRouter;


/*
========================================== Applicant =============================
👤 My Profile (الصفحة العامة)
PUT    http://localhost:3000/users/me/profile
GET    http://localhost:3000/users/me/profile
POST   http://localhost:3000/users/me/avatar

📝 background image
PUT    http://localhost:3000/users/me/BG-image

📝 About Me
PUT    http://localhost:3000/users/me/about

💼 Experiences
POST   http://localhost:3000/users/me/experiences
PUT    http://localhost:3000/experiences/:id
DELETE http://localhost:3000/experiences/:id

🎓 Educations
POST   http://localhost:3000/users/me/educations
PUT    http://localhost:3000/educations/:id
DELETE http://localhost:3000/educations/:id

🧠 Skills
POST   http://localhost:3000/users/me/skills
DELETE http://localhost:3000/users/me/skills/:id

🖼 Portfolios
POST   http://localhost:3000/users/me/portfolios
DELETE http://localhost:3000/portfolios/:id

🔗 Social Links
PUT    http://localhost:3000/users/me/social-links





⚙️ Settings → My Profile ❌❌❌
PUT    http://localhost:3000/users/me





⚙️ Settings → Login Details
تغيير الإيميل
PUT    http://localhost:3000/users/me/email

تغيير الباسورد
PUT    http://localhost:3000/users/me/password

❌ Delete account
DELETE http://localhost:3000/companies/me


*/