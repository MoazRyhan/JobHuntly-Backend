import { Router } from "express";
import { OptionalAuthenticationMiddleware } from '../../Middlewares/AuthenticationMiddleware.js';
import { getLatestJobs, getAllJobs, getCategories, getCompaniesWeHelped , getJobById , searchJobs ,    filterJobs,  getAllCompanies, filterCompanies, getCompanyById} from "./controllers/job.controller.js";

const MahmoudRouter = Router();

// Jobs APIs
MahmoudRouter.get("/latestJobs", getLatestJobs);
MahmoudRouter.get("/jobs", OptionalAuthenticationMiddleware(), getAllJobs);
MahmoudRouter.get("/jobs/:id", getJobById);

// Search API
MahmoudRouter.get("/search", searchJobs); 
MahmoudRouter.get("/filter", OptionalAuthenticationMiddleware(), filterJobs); 

// Categories API
MahmoudRouter.get("/categories", getCategories);

// Companies API
MahmoudRouter.get("/companiesWeHelped", getCompaniesWeHelped);
MahmoudRouter.get("/companies", getAllCompanies);
MahmoudRouter.get("/companies/filter", filterCompanies);
MahmoudRouter.get("/companies/:id", getCompanyById);

export default MahmoudRouter;