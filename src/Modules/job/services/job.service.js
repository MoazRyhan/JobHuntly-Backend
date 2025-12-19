import JobModel from '../../../DB/Models/JobModel.js'
import ApiError from '../../../Utils/ApiError.utils.js'

export const getAllJobsService = async () => {
  const jobs = await JobModel.find()
  if (!jobs) {
    throw new ApiError(404, 'no jobs found')
  }
  return jobs
}

export const getJobService = async (id) => {
  const jobs = await JobModel.findById(id)
  if (!jobs) {
    throw new ApiError(404, 'job notfound')
  }
  return jobs
}
