import { asyncHandler } from '../../../Utils/asyncHandler.utils.js'
import { response } from '../../../Utils/response.utils.js';
import jobService from '../services/job.service.js'

const createJob = asyncHandler(async (req, res) => {
    const newData = req.body

    // Check if the body is empty.
    if (Object.keys(newData).length === 0) {
        throw new ApiError(400, "Job data cannot be empty");
    }

    const jobCreated = await jobService.createJob(newData, req)
    return response(res, jobCreated)
})

const updateJob = asyncHandler(async (req, res) => {
    const updatedData = req.body
    const targetJob = req.targetJob

    // Check if the body is empty.
    if (Object.keys(updatedData).length === 0) {
        throw new ApiError(400, "Update data cannot be empty");
    }

    const updatedJob = await jobService.updateJob(targetJob, updatedData)
    return response(res, updatedJob)
})

const openCloseJob = asyncHandler(async (req, res) => {
    const targetJob = req.targetJob

    const message = await jobService.openCloseJob(targetJob)
    return response(res, message)
})

const deleteJob = asyncHandler(async (req, res) => {
    const targetJob = req.targetJob

    const message = await jobService.deleteJob(targetJob)
    return response(res, message)
})

export default {
    createJob,
    updateJob,
    deleteJob,
    openCloseJob
}