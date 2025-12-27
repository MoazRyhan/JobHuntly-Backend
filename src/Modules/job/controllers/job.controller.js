import { asyncHandler } from '../../../Utils/asyncHandler.utils.js'
import {
  getAllJobsService,
  getJobService,
  createJobApplicationService,
} from '../services/job.service.js'

export const getAllJobs = asyncHandler(async (req, res) => {
  const jobs = await getAllJobsService()

  res.status(200).json({
    results: jobs.length,
    data: jobs,
  })
})

export const getJobById = asyncHandler(async (req, res) => {
  const seekerId = req.login_user?._id || null
  const job = await getJobService(req.params.id, seekerId)

  res.status(200).json({
    data: job,
  })
})

export const applyToJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params
  const user = req.login_user // takes it from the request

  const application = await createJobApplicationService({
    jobId,
    user,
    resumeUrl: req.body.resumeUrl,
    responses: req.body.responses,
  })

  res.status(201).json({
    message: 'Application submitted successfully',
    data: application,
  })
})
