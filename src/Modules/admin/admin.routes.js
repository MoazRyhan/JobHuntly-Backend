import { Router } from "express";
import * as adminController from "./controllers/admin.controller.js";
import { AuthenticationMiddleware, AuthorizationMiddleware } from "../../Middlewares/AuthenticationMiddleware.js";
import { SYSTEM_ROLE } from "../../Constants/constants.js";

const AdminRouter = Router();

// Apply auth middleware to all admin routes
AdminRouter.use(AuthenticationMiddleware());
AdminRouter.use(AuthorizationMiddleware([SYSTEM_ROLE.ADMIN]));

AdminRouter.get("/users", adminController.getUsers);
AdminRouter.get("/companies", adminController.getCompanies);
AdminRouter.patch("/users/:userId/status", adminController.patchUserStatus);
AdminRouter.patch("/jobs/:jobId/status", adminController.patchJobStatus);
AdminRouter.get("/dashboard-stats", adminController.getDashboardStats);
AdminRouter.get("/recent-activity", adminController.getRecentActivity);
AdminRouter.get("/companies/:companyId/jobs", adminController.getCompanyJobs);


export default AdminRouter;
