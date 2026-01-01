import JobModel from '../../../DB/Models/JobModel.js';
import CompanyModel from '../../../DB/Models/CompanyModel.js'
import JobApplicationModel from '../../../DB/Models/JobApplicationModel.js';
import ApiError from '../../../Utils/ApiError.utils.js';

const createJob = async (jobData, req) => {
    try {
        // To be Commented until Auth middlewares are functional
        // Get CompanyId from access token
        const loggedInUser = req.login_user;

        const company = await CompanyModel.findOne({ userId: loggedInUser._id });

        jobData.companyId = company._id

        const job = await JobModel.create(jobData);

        return job;
    } catch (error) {
        if (error.statusCode) {
            throw error;
        }

        // Catch Mongoose validation errors (e.g., missing required fields)
        if (error.name === 'ValidationError') throw new ApiError(400, error.message);

        console.error("Job Creation Internal System Error:", error);
        throw new ApiError(500, 'Job Creation Internal Server Error');
    }
}

const updateJob = async (job, updatedJob) => {
    try {
        Object.assign(job, updatedJob);
        await job.save();

        return job;
    } catch (error) {
        if (error.statusCode) {
            throw error;
        }

        // Catch Mongoose validation errors (e.g., missing required fields)
        if (error.name === 'ValidationError') throw new ApiError(400, error.message);

        console.error("Job Updating Internal System Error:", error);
        throw new ApiError(500, 'Job Updating Internal Server Error');
    }
}

const openCloseJob = async (job) => {
    try {
        if (!job.isLive) {
            if (job.dueDate && job.dueDate < new Date()) {
                throw new ApiError(400, "Job can't be set to Live. It has reached its Due Date.");
            }
        }

        job.isLive = !job.isLive;

        await job.save();

        return {
            message: `Job is now ${job.isLive ? 'Live' : 'Closed'}`,
        };

    } catch (error) {
        if (error.statusCode) {
            throw error;
        }

        console.error("Changing Job Liveness Internal System Error:", error);
        throw new ApiError(500, 'Changing Job Liveness Internal Server Error');
    }
}

const deleteJob = async (job) => {
    try {
        await job.deleteOne();

        await JobApplicationModel.deleteMany({ jobId: job._id });

        return { message: "Job deleted successfully" };

    } catch (error) {
        if (error.statusCode) {
            throw error;
        }

        console.error("Job Deletion Internal System Error:", error);
        throw new ApiError(500, 'Job Deletion Internal Server Error');
    }
}




export default {
    createJob,
    updateJob,
    openCloseJob,
    deleteJob,
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