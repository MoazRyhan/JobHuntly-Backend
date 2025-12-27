import { asyncHandler } from '../../../Utils/asyncHandler.utils.js'
import {
  getAllJobsService,
  getJobService,
  createJobApplicationService,
  getSimilarJobsByCategoryService,
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

export const getSimilarJobs = asyncHandler(async (req, res) => {
  // Get categories from query params - can be single category, comma-separated, or array
  // Handle both 'categories' and 'categories[]' (common with Axios)
  let { categories, excludeJobId, limit } = req.query
  if (!categories && req.query['categories[]']) {
    categories = req.query['categories[]']
  }

  if (!categories) {
    return res.status(400).json({
      message: 'Categories parameter is required',
    })
  }

  // Parse categories: handle array, comma-separated string, or single string
  let categoryArray
  if (Array.isArray(categories)) {
    // If already an array (from query like ?categories[]=cat1&categories[]=cat2)
    categoryArray = categories.map((cat) => String(cat).trim()).filter(Boolean)
  } else if (typeof categories === 'string') {
    // If comma-separated string, split it
    categoryArray = categories
      .split(',')
      .map((cat) => cat.trim())
      .filter(Boolean)
  } else {
    return res.status(400).json({
      message: 'Invalid categories format',
    })
  }

  if (categoryArray.length === 0) {
    return res.status(400).json({
      message: 'At least one valid category is required',
    })
  }

  const similarJobs = await getSimilarJobsByCategoryService(
    categoryArray,
    excludeJobId || null,
    limit ? parseInt(limit) : 6
  )

  res.status(200).json({
    results: similarJobs.length,
    data: similarJobs,
    message: similarJobs.length === 0 
      ? 'No similar jobs found for the given categories' 
      : undefined,
  })
})
