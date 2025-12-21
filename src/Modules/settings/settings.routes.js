import { Router } from "express";
import * as SettingsController from "./controllers/SettingsApplicant.controller.js"
import { AuthenticationMiddleware, AuthorizationMiddleware } from "../../Middlewares/AuthenticationMiddleware.js";
import { SYSTEM_ROLE } from "../../Constants/constants.js";

const SettingsRouter = Router();

// =======>  Applicant 
SettingsRouter.use( AuthenticationMiddleware() )

SettingsRouter.put("/updateProfile", AuthorizationMiddleware([ SYSTEM_ROLE.JOB_SEEKER ]) ,  SettingsController.updateProfile);
SettingsRouter.get("/getProfile", SettingsController.getProfile);


export default SettingsRouter;


/*
========================================== Applicant =============================
👤 My Profile (الصفحة العامة)
PUT    http://localhost:3000/users/me/profile
GET    http://localhost:3000/users/me/profile
POST   http://localhost:3000/users/me/avatar

📝 background image
PUT    http://localhost:3000/users/me/BG-image


💼 Experiences
POST   http://localhost:3000/users/me/experiences
DELETE http://localhost:3000/experiences/:id

🎓 Educations
POST   http://localhost:3000/users/me/educations
DELETE http://localhost:3000/educations/:id

🧠 Skills
DELETE http://localhost:3000/users/me/skills/:id

🖼 Portfolios
DELETE http://localhost:3000/portfolios/:id

🔗 Social Links
 DELETE    http://localhost:3000/users/me/social-links





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