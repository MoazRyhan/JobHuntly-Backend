import JobModel from '../../../DB/Models/JobModel.js';
import JobApplicationModel from '../../../DB/Models/JobApplicationModel.js';
import ApiError from '../../../Utils/ApiError.utils.js';

const createJob = async (jobData) => {
    try {
        const job = await JobModel.create(jobData);

        return job;
    } catch (error) {
        // Handle MongoDB Duplicate Key Error (Title uniqueness)
        if (error.code === 11000) {
            throw new ApiError(400, 'Creation failed: Job Title already exists');
        }
        throw error;
    }
}

const updateJob = async (id, jobData) => {
    try {
        // { new: true } returns the document AFTER the update
        // { runValidators: true } ensures the Mongoose schema enums/requirements are checked

        // Authorization: Validate Company: Is this your job?

        const job = await JobModel.findByIdAndUpdate(
            id,
            jobData, // $set is implicit here in Mongoose
            {
                new: true,
                runValidators: true,
            }
        );

        if (!job) {
            throw new ApiError(404, 'Job not found');
        }

        return job;
    } catch (error) {
        // Handle MongoDB Duplicate Key Error (Title uniqueness)
        if (error.code === 11000) {
            throw new ApiError(400, 'Update failed: Job Title is already taken');
        }
        throw error;
    }
}

const deleteJob = async (id) => {
    // Authorization: Validate Company: Is this your job?

    // 1. Try to delete the job first
    const jobDeleted = await JobModel.findByIdAndDelete(id);

    // 2. If no job was found, stop immediately
    if (!jobDeleted) {
        throw new ApiError(404, 'Job not found');
    }

    // 3. Cascade delete applications
    // This works perfectly whether there are 0 or 100 applications.
    await JobApplicationModel.deleteMany({ jobId: id });

    return jobDeleted;
};

/* Deleting both Job & its Applications in a transaction session
Can't be done on Local Mongo Db, must be on Atlas.
So, This will be used when the backend project uses MongoDb Atlas
const deleteJob = async (id) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const jobDeleted = await JobModel.findByIdAndDelete(id).session(session);

        if (!jobDeleted) {
            throw new ApiError(404, 'Job not found');
        }

        // Delete all related applications
        await JobApplicationModel.deleteMany({ jobId: id }).session(session);

        // Commit the changes to the database
        await session.commitTransaction();
        return jobDeleted;

    } catch (error) {
        // If anything goes wrong, undo the Job deletion
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
}*/


export default {
    createJob,
    updateJob,
    deleteJob
};