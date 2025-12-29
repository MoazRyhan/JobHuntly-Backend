import express from 'express';
import { getMyJobApplications } from './controllers/applicant.controller.js';
import { AuthorizationMiddleware } from '../../Middlewares/AuthenticationMiddleware.js';

const router = express.Router();

// router.get('/me', AuthorizationMiddleware(),getMyJobApplications);
router.get('/me', getMyJobApplications);


export default router;
