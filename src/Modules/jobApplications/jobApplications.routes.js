import { Router } from 'express'
import * as jobApplicationsController from './controllers/jobApplications.controller.js'

const JobApplicationRouter = Router({ mergeParams: true })

JobApplicationRouter.get(
  '/applications',
  jobApplicationsController.getAllJobApplications
)

JobApplicationRouter.get(
  '/applications/:applicationId',
  jobApplicationsController.getJobApplicationById
)

export default JobApplicationRouter
