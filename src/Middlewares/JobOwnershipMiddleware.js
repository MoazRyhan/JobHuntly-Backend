import JobModel from '../DB/Models/JobModel.js';
import CompanyModel from '../DB/Models/CompanyModel.js';
import ApiError from '../Utils/ApiError.utils.js';

export const JobOwnershipMiddleware = async (req, res, next) => {
    try {
        const { id } = req.params;

        // If no ID is passed, this middleware shouldn't run (or just skip)
        if (!id) return next();

        const job = await JobModel.findById(id);
        if (!job) {
            return next(new ApiError(404, 'Job not found'));
        }

        // Fetch the Company of the Logged-in User from AuthenticationMiddleware
        const company = await CompanyModel.findOne({ userId: req.login_user._id });

        if (!company) {
            return next(new ApiError(403, "Company account not found"));
        }

        // Does the Company own this Job?
        if (!company._id.equals(job.companyId)) {
            return next(new ApiError(403, "You do not own this job"));
        }

        // Pass the job to the controller so we don't fetch it again!
        req.targetJob = job;

        next();
    } catch (error) {
        next(new ApiError(500, 'Ownership Check Failed'));
    }
};