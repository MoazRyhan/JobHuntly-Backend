import {Router} from'express'
import { getCompanyById, createCompany,getMyCompanyJobs} from './controllers/company.controller.js';
import { AuthenticationMiddleware,AuthorizationMiddleware } from '../../Middlewares/AuthenticationMiddleware.js';

const router=Router();

router.get("/:companyId",AuthenticationMiddleware(), getCompanyById);

router.post("/", createCompany);

router.get(
  "/:companyId/jobs",
  AuthenticationMiddleware(),
  AuthorizationMiddleware(["COMPANY"]),
  getMyCompanyJobs
);

export default router;