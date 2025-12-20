import { Router } from 'express'
import * as jobController from '../job/controllers/job.controller.js'
const JobRouter = Router()

JobRouter.get('/', jobController.getAllJobs)
JobRouter.get('/:id', jobController.getJobById)

// protected route need auth and a user object in req body
JobRouter.post('/:jobId', jobController.applyToJob)

export default JobRouter
