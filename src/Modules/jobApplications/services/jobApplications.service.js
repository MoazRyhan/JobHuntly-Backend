import JobApplicationModel from '../../../DB/Models/JobApplicationModel.js'
import ApiError from '../../../Utils/ApiError.utils.js'

export const getAllJobApplicationsService = async (filter = {}) => {
  const jobApplications = await JobApplicationModel.find(filter)
  if (!jobApplications.length) {
    throw new ApiError(404, 'no jobApplication is found')
  }
  return jobApplications
}

export const getJobApplicationService = async (jobId, applicationId) => {
  const jobApplication = await JobApplicationModel.findOne({
    _id: applicationId,
    jobId,
  })
  if (!jobApplication) {
    throw new ApiError(404, 'jobapplication notfound')
  }

  return jobApplication
}
