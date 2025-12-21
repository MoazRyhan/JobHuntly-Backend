import JobModel from '../../../DB/Models/JobModel.js'
import JobApplicationModel from '../../../DB/Models/JobApplicationModel.js'
import ApiError from '../../../Utils/ApiError.utils.js'

export const getAllJobsService = async () => {
  const jobs = await JobModel.find().populate('companyId')
  if (!jobs) {
    throw new ApiError(404, 'no jobs found')
  }
  return jobs
}

export const getJobService = async (id) => {
  const jobs = await JobModel.findById(id).populate('companyId')
  if (!jobs) {
    throw new ApiError(404, 'job notfound')
  }
  return jobs
}

export const createJobApplicationService = async ({
  jobId,
  user,
  resumeUrl,
  responses,
}) => {
  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    throw new Error('Invalid jobId or seekerId')
  }
  const seekerId = user._id

  // Prevent duplicate application
  const exists = await JobApplicationModel.findOne({ jobId, seekerId })
  if (exists) {
    throw new Error('You have already applied to this job')
  }

  const application = await JobApplicationModel.create({
    jobId,
    seekerId,

    //from authenticated user
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    currentJobTitle: user.currentJobTitle,
    linkedinUrl: user.linkedinUrl,
    portfolioUrl: user.portfolioUrl,

    // taken from the user
    resumeUrl,
    responses,
  })

  return application
}
