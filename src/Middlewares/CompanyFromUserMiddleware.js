import CompanyModel from "../DB/Models/CompanyModel.js";
import ApiError from "../Utils/ApiError.utils.js";

export const CompanyFromUserMiddleware = () => {
    return async (req, res, next) => {
        try {
            // Find the company linked to the logged-in user
            const company = await CompanyModel.findOne({ userId: req.login_user._id });

            if (!company) {
                return next(new ApiError(403, "Company account not found"));
            }

            req.companyId = company._id;

            next();
        } catch (error) {
            next(error);
        }
    }
};