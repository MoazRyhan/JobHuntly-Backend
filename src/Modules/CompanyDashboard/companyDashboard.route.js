import { Router } from "express";
import companyDashboardController from "./controllers/companyDashboard.controller.js";
import { AuthenticationMiddleware, AuthorizationMiddleware } from "../../Middlewares/AuthenticationMiddleware.js";
import {CompanyFromUserMiddleware} from "../../Middlewares/CompanyFromUserMiddleware.js"
import { SYSTEM_ROLE } from "../../Constants/constants.js";

const companyDashboardRouter = Router()

companyDashboardRouter.use(AuthenticationMiddleware());
companyDashboardRouter.use(AuthorizationMiddleware(SYSTEM_ROLE.COMPANY))
companyDashboardRouter.use(CompanyFromUserMiddleware())

companyDashboardRouter.get(
    "/jobViews",
    companyDashboardController.getJobViewStatistics
)

companyDashboardRouter.get(
    "/jobApplications",
    companyDashboardController.getJobApplicationStatistics
)

companyDashboardRouter.get(
    "/newJobApplications",
    companyDashboardController.getNewJobApplicationsCount
)

companyDashboardRouter.get(
    "/reviewedJobApplications",
    companyDashboardController.getReviewedJobApplicationsCount
)

companyDashboardRouter.get(
    "/openJobs",
    companyDashboardController.getOpenJobsCount
)

export default companyDashboardRouter