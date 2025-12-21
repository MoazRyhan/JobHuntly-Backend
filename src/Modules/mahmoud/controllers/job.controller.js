import JobModel from "../../../DB/Models/JobModel.js";
import CompanyModel from "../../../DB/Models/CompanyModel.js";
import { jobCategoryValues } from "../../../Constants/constants.js";
import SkillModel from "../../../DB/Models/SkillsModel.js";


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



// ============ GET JOB BY ID ============
export const getJobById = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const job = await JobModel.findById(id)
            .populate("companyId", "name logoUrl hqCountry hqCity website")
            .populate("skillsIds", "name");

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }
        const formattedJob = {
            _id: job._id,
            title: job.title,
            image: job.companyId?.logoUrl,
            company: job.companyId?.name,
            location: job.companyId?.hqCountry,
            employment_type: job.employmentTypes?.join(", "),
            description: job.description,
            job_needs: [
                { responsibilities: job.responsibilities },
                { "Who You Are": job.whoYouAre },
                { "Nice To Haves": job.niceToHaves }
            ],
            about_this_role: {
                apply_before: job.dueDate ? new Date(job.dueDate).toLocaleDateString() : "N/A",
                job_posted_on: new Date(job.postDate).toLocaleDateString(),
                job_type: job.employmentTypes?.join(", "),
                salary: `${job.salaryMin} - ${job.salaryMax} ${job.salaryCurrency}`
            },
            categories: job.categories,
            required_skills: job.skillsIds?.map(skill => skill.name) || []
        };

        res.status(200).json({
            success: true,
            data: formattedJob
        });
    } catch (error) {
        next(error);
    }
};


// ============ SEARCH JOBS ============
export const searchJobs = async (req, res, next) => {
    try {
        const { title, location } = req.query;
        let query = { isLive: true };
        if (title) {
            query.title = { $regex: title, $options: 'i' }; 
        }
        const jobs = await JobModel.find(query)
            .sort({ postDate: -1 })
            .populate("companyId", "name logoUrl hqCountry hqCity")
            .populate("skillsIds", "name");
        let filteredJobs = jobs;
        if (location) {
            filteredJobs = jobs.filter(job => 
                job.companyId?.hqCountry?.toLowerCase().includes(location.toLowerCase()) ||
                job.companyId?.hqCity?.toLowerCase().includes(location.toLowerCase())
            );
        }
        res.status(200).json({
            success: true,
            message: "Search results",
            count: filteredJobs.length,
            data: filteredJobs
        });
    } catch (error) {
        next(error);
    }
};



// ============ FILTER JOBS ============
export const filterJobs = async (req, res, next) => {
    try {
        const { 
            title,            
            location,         
            employmentType,   
            category,         
            salaryMin,       
            salaryMax,        
        } = req.query;
        let query = { isLive: true };
        if (title) {
            query.title = { $regex: title, $options: 'i' };
        }
        if (employmentType) {
            query.employmentTypes = { $in: [employmentType] };
        }
        if (category) {
            query.categories = { $in: [category] };
        }
        if (salaryMin) {
            query.salaryMin = { $gte: Number(salaryMin) };
        }
        if (salaryMax) {
            query.salaryMax = { $lte: Number(salaryMax) };
        }
        let jobs = await JobModel.find(query)
            .sort({ postDate: -1 })
            .populate("companyId", "name logoUrl hqCountry hqCity")
            .populate("skillsIds", "name");
        if (location) {
            jobs = jobs.filter(job => 
                job.companyId?.hqCountry?.toLowerCase().includes(location.toLowerCase()) ||
                job.companyId?.hqCity?.toLowerCase().includes(location.toLowerCase())
            );
        }
        res.status(200).json({
            success: true,
            message: "Filtered jobs",
            count: jobs.length,
            data: jobs
        });
    } catch (error) {
        next(error);
    }
};