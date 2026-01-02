import JobModel from '../../../DB/Models/JobModel.js'
import JobApplicationModel from '../../../DB/Models/JobApplicationModel.js'
import mongoose from 'mongoose'
import ApiError from '../../../Utils/ApiError.utils.js'
import JobAnalyticsModel from '../../../DB/Models/JobAnalyticsModel.js'

export const getAllJobsService = async () => {
  const jobs = await JobModel.find().populate('companyId')
  if (!jobs) {
    throw new ApiError(404, 'no jobs found')
  }
  return jobs
}

export const getJobService = async (jobId, seekerId = null) => {
  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    throw new ApiError(400, 'Invalid Job ID format')
  }
  const job = await JobModel.findById(jobId).populate('companyId')

  if (!job) {
    throw new ApiError(404, 'job notfound')
  }

  // Incrementing the Job's Views in its Job Analytical document
  const today = new Date()
  today.setHours(2, 0, 0, 0); // Normalize to midnight

  await JobAnalyticsModel.findOneAndUpdate(
    { jobId, date: today },
    {
      $inc: { views: 1 }, // Increment view count
      $setOnInsert: { companyId: job.companyId } // Set companyId only on creation
    },
    // If not found, a Job Analytical document will be created
    { upsert: true, new: true } 
  );

  let hasApplied = false

  if (seekerId) {
    hasApplied = await JobApplicationModel.exists({
      jobId: new mongoose.Types.ObjectId(jobId),
      seekerId: new mongoose.Types.ObjectId(seekerId),
    })
  }

  return {
    ...job.toObject(),
    hasApplied: Boolean(hasApplied),
  }
}

export const createJobApplicationService = async ({
  jobId,
  user,
  resumeUrl,
  responses,
}) => {
  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    throw new ApiError(404, 'Invalid jobId or seekerId')
  }
  const seekerId = user._id

  // 1. Check if Job exists and fetch questions
  const job = await JobModel.findById(jobId)
  if (!job) {
    throw new ApiError(404, 'Job not found')
  }

  // 2. Prevent duplicate application
  const exists = await JobApplicationModel.findOne({ jobId, seekerId })
  if (exists) {
    throw new ApiError(409, 'You have already applied to this job')
  }

  // 3. Process and Validate Questions
  const applicationResponses = []

  if (job.questions && job.questions.length > 0) {
    // using the id
    // for (const question of job.questions) {
    //   // Find the user's answer for this specific question
    //   const userAnswer = responses.find(
    //     (r) => r.questionId === question._id.toString()
    //   )
    for (let i = 0; i < job.questions.length; i++) {
      const question = job.questions[i]

      //  Match by array position since IDs keep regenerating
      const userAnswer = responses[i]

      if (!userAnswer || !userAnswer.answerValue) {
        throw new ApiError(
          400,
          `Missing answer for question: "${question.questionText}"`
        )
      }

      applicationResponses.push({
        questionId: question._id,
        questionText: question.questionText, // Snapshot from DB
        type: question.type, // Snapshot from DB
        answerValue: userAnswer.answerValue,
      })
    }
  }

  const application = await JobApplicationModel.create({
    jobId,
    seekerId,

    // from authenticated user
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    currentJobTitle: user.currentJobTitle,
    linkedinUrl: user.linkedinUrl,
    portfolioUrl: user.portfolioUrl,

    // taken from the user request
    resumeUrl,
    responses: applicationResponses, // Use the processed secure responses
  })

  return application
}

export const getSimilarJobsByCategoryService = async (
  categories,
  excludeJobId = null,
  limit = 6
) => {
  // Normalize input: convert single string to array
  const categoryArray = Array.isArray(categories) ? categories : [categories]

  // Validate that categories array is not empty
  if (!categoryArray.length || categoryArray.some((cat) => !cat)) {
    throw new ApiError(400, 'At least one valid category is required')
  }

  // Build query: find jobs where categories array contains any of the provided categories
  const query = {
    categories: { $in: categoryArray }, // $in finds documents where categories array contains any of the values
    isLive: true, // Only get live jobs
  }

  // Exclude the current job if provided
  if (excludeJobId && mongoose.Types.ObjectId.isValid(excludeJobId)) {
    query._id = { $ne: new mongoose.Types.ObjectId(excludeJobId) }
  }

  const similarJobs = await JobModel.find(query)
    .populate('companyId')
    .limit(limit)
    .sort({ postDate: -1 }) // Sort by newest first

  return similarJobs
}
