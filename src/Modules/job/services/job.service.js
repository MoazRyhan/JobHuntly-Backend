import JobModel from '../../../DB/Models/JobModel.js'
import JobApplicationModel from '../../../DB/Models/JobApplicationModel.js'
import mongoose from 'mongoose'
import ApiError from '../../../Utils/ApiError.utils.js'

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
