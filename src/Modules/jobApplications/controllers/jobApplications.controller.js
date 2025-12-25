import { asyncHandler } from '../../../Utils/asyncHandler.utils.js'
import {
  getAllJobApplicationsService,
  getJobApplicationService,
} from '../services/jobApplications.service.js'

export const getAllJobApplications = asyncHandler(async (req, res) => {
  const { jobId } = req.params
  const jobs = await getAllJobApplicationsService({ jobId })

  res.status(200).json({
    results: jobs.length,
    data: jobs,
  })
})

export const getJobApplicationById = asyncHandler(async (req, res) => {
  const { applicationId } = req.params
  const job = await getJobApplicationService(applicationId)

  res.status(200).json({
    data: job,
  })
})
