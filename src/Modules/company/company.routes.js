import {Router} from'express'
import { getCompanyById, createCompany,getMyCompanyJobs} from './controllers/company.controller.js';
import { AuthenticationMiddleware } from '../../Middlewares/AuthenticationMiddleware.js';
// import { getCompanyById, createCompany } from '/controllers/company.controller';

const router=Router();

router.get("/:companyId", getCompanyById);

router.post("/", createCompany);

//router.get("/:companyId/jobs", AuthenticationMiddleware(), getMyCompanyJobs);
router.get("/:companyId/jobs", getMyCompanyJobs);


export default router;