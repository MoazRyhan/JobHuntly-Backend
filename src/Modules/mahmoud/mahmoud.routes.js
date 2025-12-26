import { Router } from "express";
import { getLatestJobs, getAllJobs, getCategories, getCompaniesWeHelped , getJobById , searchJobs ,    filterJobs} from "./controllers/job.controller.js";

const MahmoudRouter = Router();

// Jobs APIs
MahmoudRouter.get("/latestJobs", getLatestJobs);
MahmoudRouter.get("/jobs", getAllJobs);
MahmoudRouter.get("/jobs/:id", getJobById);

// Search API
MahmoudRouter.get("/search", searchJobs); 
MahmoudRouter.get("/filter", filterJobs); 

// Categories API
MahmoudRouter.get("/categories", getCategories);

// Companies API
MahmoudRouter.get("/companiesWeHelped", getCompaniesWeHelped);

export default MahmoudRouter;