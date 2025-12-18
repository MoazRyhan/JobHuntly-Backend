import {Router} from'express'
import { getCompanyById, createCompany,getMyCompanyJobs} from './controllers/company.controller.js';
import { AuthenticationMiddleware } from '../../Middlewares/AuthenticationMiddleware.js';
// import { getCompanyById, createCompany } from '/controllers/company.controller';

const router=Router();

router.get("/:companyId", getCompanyById);

router.post("/", createCompany);


export default router;