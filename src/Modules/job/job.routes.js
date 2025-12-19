import { Router } from 'express'
import * as jobController from '../job/controllers/job.controller.js'

const JobRouter = Router()

JobRouter.get('/', jobController.getAllJobs)
JobRouter.get('/:id', jobController.getJobById)

export default JobRouter
