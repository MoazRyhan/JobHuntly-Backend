import { asyncHandler } from '../../../Utils/asyncHandler.utils.js'
import { response } from '../../../Utils/response.utils.js';
import jobService from '../services/job.service.js'

const createJob = asyncHandler(async (req, res) => {
    const jobCreated = await jobService.createJob(req.body)
    return response(res, jobCreated)
})

const updateJob = asyncHandler(async (req, res) => {
    const id = req.params.id
    const updateData = req.body

    // Check if the body is empty. If so, not waste a Db call
    if (Object.keys(updateData).length === 0) {
        console.log('No edits on the job')
        return response(res)
    }

    const jobUpdated = await jobService.updateJob(id, updateData)
    return response(res, jobUpdated)
})

const deleteJob = asyncHandler(async (req, res) => {
    const id = req.params.id

    const jobDeleted = await jobService.deleteJob(id)
    return response(res, jobDeleted)
})

export default {
    createJob,
    updateJob,
    deleteJob
}