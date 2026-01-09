import { Router } from "express";
import * as SettingsController from "./controllers/Settings.controller.js"
import { AuthenticationMiddleware, AuthorizationMiddleware } from "../../Middlewares/AuthenticationMiddleware.js";
import { ImageExtensions, SYSTEM_ROLE } from "../../Constants/constants.js";
import { MulterLocalMiddleware } from './../../Middlewares/MulterMiddleware.js';



const SettingsRouter = Router();

/* ================= AUTH ================= */
SettingsRouter.use( AuthenticationMiddleware() )
SettingsRouter.use( AuthorizationMiddleware([SYSTEM_ROLE.JOB_SEEKER,SYSTEM_ROLE.COMPANY,SYSTEM_ROLE.ADMIN]));




// ==========================  applicants 

SettingsRouter.put("/updateProfile", SettingsController.updateProfile);

SettingsRouter.get("/getProfile",SettingsController.getProfile);

SettingsRouter.get("/getSkills",SettingsController.getSkills);





// ==========================  Recruiter 

SettingsRouter.put("/updateProfileRecruiter",SettingsController.updateCompanyProfile);

SettingsRouter.get("/getProfileRecruiter",SettingsController.getCompanyProfile);


/* ================= Company  Images  ================= */
SettingsRouter.post(
  "/CompanyImages",
  MulterLocalMiddleware("CompanyImages", ImageExtensions).array("files"),
  SettingsController.uploadCompanyImages
)

SettingsRouter.delete( "/CompanyImages",SettingsController.deleteCompanyImage)












// ===================================== all


/* ================= LOGO ================= */
SettingsRouter.post(
  "/logoUrl",
  MulterLocalMiddleware("logo", ImageExtensions).single("file"),
  SettingsController.uploadLogo
)

/* ================= BACKGROUND ================= */
SettingsRouter.post(
  "/backgroundUrl",
  MulterLocalMiddleware("background", ImageExtensions).single("file"),
  SettingsController.uploadBackground
)




/* ================= EMAIL ================= */
SettingsRouter.put(
  "/change-email",
  SettingsController.changeEmail
);

/* ================= PASSWORD ================= */
SettingsRouter.put(
  "/reset-password",
  SettingsController.resetPassword
);

/* ================= DELETE ACCOUNT ================= */
SettingsRouter.delete(
  "/delete-account",
  SettingsController.deleteAccount
);




// skills / and the nodemailer
export default SettingsRouter;

