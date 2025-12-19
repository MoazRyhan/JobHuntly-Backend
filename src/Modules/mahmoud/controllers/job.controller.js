import JobModel from "../../../DB/Models/JobModel.js";
import CompanyModel from "../../../DB/Models/CompanyModel.js";
import { jobCategoryValues } from "../../../Constants/constants.js";
import SkillModel from "../../../DB/Models/SkillsModel.js";  // 👈 أضف ده


// ============ GET LATEST JOBS ============
export const getLatestJobs = async (req, res, next) => {
    try {
        const latestJobs = await JobModel.find({ isLive: true })
            .sort({ postDate: -1 })  
            .limit(8)                 
            .populate("companyId", "name logoUrl hqCountry")
            .populate("skillsIds", "name");

        res.status(200).json({
            success: true,
            message: "Latest jobs fetched successfully",
            data: latestJobs
        });
    } catch (error) {
        next(error);
    }
};

// ============ GET ALL JOBS ============
export const getAllJobs = async (req, res, next) => {
    try {
        const jobs = await JobModel.find({ isLive: true })
            .sort({ postDate: -1 })
            .populate("companyId", "name logoUrl hqCountry")
            .populate("skillsIds", "name");

        res.status(200).json({
            success: true,
            message: "All jobs fetched successfully",
            count: jobs.length,
            data: jobs
        });
    } catch (error) {
        next(error);
    }
};

// ============ GET CATEGORIES ============
export const getCategories = async (req, res, next) => {
    try {
        
        const categoriesWithCount = await Promise.all(
            jobCategoryValues.map(async (category) => {
                const count = await JobModel.countDocuments({ 
                    categories: category,
                    isLive: true 
                });
                return {
                    name: category,
                    jobCount: count
                };
            })
        );

        res.status(200).json({
            success: true,
            message: "Categories fetched successfully",
            data: categoriesWithCount
        });
    } catch (error) {
        next(error);
    }
};

// ============ GET COMPANIES WE HELPED ============
export const getCompaniesWeHelped = async (req, res, next) => {
    try {
        const companies = await CompanyModel.find({ isVerified: true })
            .select("name logoUrl industry hqCountry")
            .limit(20);

        res.status(200).json({
            success: true,
            message: "Companies fetched successfully",
            count: companies.length,
            data: companies
        });
    } catch (error) {
        next(error);
    }
};