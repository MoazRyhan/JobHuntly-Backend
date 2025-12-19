import { asyncHandler } from '../../../Utils/asyncHandler.utils.js'
import { getAllJobsService, getJobService } from '../services/job.service.js'

export const getAllJobs = asyncHandler(async (req, res) => {
  const jobs = await getAllJobsService()

  res.status(200).json({
    results: jobs.length,
    data: jobs,
  })
})

export const getJobById = asyncHandler(async (req, res) => {
  const job = await getJobService(req.params.id)

  res.status(200).json({
    data: job,
  })
})
