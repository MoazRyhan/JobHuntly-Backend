import { Router } from 'express'
import * as jobController from '../job/controllers/job.controller.js'
import {
  AuthenticationMiddleware,
  OptionalAuthenticationMiddleware,
} from '../../Middlewares/AuthenticationMiddleware.js'
const JobRouter = Router()

JobRouter.get('/', jobController.getAllJobs)

// Get similar jobs by category - must be before /:id to avoid collision
JobRouter.get('/similar', jobController.getSimilarJobs)

JobRouter.get(
  '/:id',
  OptionalAuthenticationMiddleware(),
  jobController.getJobById
)

// protected route need auth and a user object in req body
JobRouter.post(
  '/:jobId/apply',
  AuthenticationMiddleware(),
  jobController.applyToJob
)

export default JobRouter
