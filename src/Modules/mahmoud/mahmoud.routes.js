import { Router } from "express";
import { getLatestJobs, getAllJobs, getCategories, getCompaniesWeHelped } from "./controllers/job.controller.js";

const MahmoudRouter = Router();

// Jobs APIs
MahmoudRouter.get("/latestJobs", getLatestJobs);
MahmoudRouter.get("/jobs", getAllJobs);

// Categories API
MahmoudRouter.get("/categories", getCategories);

// Companies API
MahmoudRouter.get("/companiesWeHelped", getCompaniesWeHelped);

export default MahmoudRouter;