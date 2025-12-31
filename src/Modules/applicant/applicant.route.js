import express from 'express';
import { getMyJobApplications } from './controllers/applicant.controller.js';
import { AuthorizationMiddleware } from '../../Middlewares/AuthenticationMiddleware.js';

const router = express.Router();

router.get(
  '/me',
  AuthorizationMiddleware(['JOB_SEEKER']),
  getMyJobApplications
);


export default router;
