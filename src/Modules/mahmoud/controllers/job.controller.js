import JobModel from "../../../DB/Models/JobModel.js";
import CompanyModel from "../../../DB/Models/CompanyModel.js";
import { jobCategoryValues } from "../../../Constants/constants.js";
import SkillModel from "../../../DB/Models/SkillsModel.js";


// ============ GET LATEST JOBS ============
export const getLatestJobs = async (req, res, next) => {
    try {
        const now = new Date()
        const latestJobs = await JobModel.find({ isLive: true, dueDate: { $gt: now } })
            .sort({ createdAt: -1 })
            .limit(8)
            .populate("companyId", "name logoUrl hqCountry hqCity")
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
        const user = req.login_user || null;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const now = new Date();
        const query = {
            isLive: true,
            dueDate: { $gt: now }
        };

        // 1. Fetch ALL live jobs
        let jobs = await JobModel.find(query)
            .sort({ createdAt: -1 })
            .populate("companyId", "name logoUrl hqCountry hqCity")
            .populate("skillsIds", "name");

        // 2. Filter in memory for guests (delay new jobs)
        if (!user || !user.isPremium) {
            const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

            jobs = jobs.filter(job => {
                const jobDate = new Date(job.createdAt);
                return jobDate <= oneHourAgo;
            });
        }

        const totalCount = jobs.length;
        const paginatedJobs = jobs.slice(skip, skip + limit);

        res.status(200).json({
            success: true,
            message: "All jobs fetched successfully",
            data: paginatedJobs,
            pagination: {
                totalCount,
                totalPages: Math.ceil(totalCount / limit),
                currentPage: page,
                limit
            }
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
            employment_type: job.employmentType,
            workplaceModel: job.workplaceModel,
            description: job.description,
            job_needs: [
                { responsibilities: job.responsibilities },
                { "Who You Are": job.whoYouAre },
                { "Nice To Haves": job.niceToHaves }
            ],
            about_this_role: {
                apply_before: job.dueDate ? new Date(job.dueDate).toLocaleDateString() : "N/A",
                job_posted_on: new Date(job.createdAt).toLocaleDateString(),
                job_type: job.employmentType,
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
        const user = req.login_user || null;
        const { title, location } = req.query;
        const now = new Date();

        let query = { isLive: true };
        if (title) {
            query.title = { $regex: title, $options: 'i' };
        }

        // 1. Fetch ALL matching jobs
        let jobs = await JobModel.find(query)
            .sort({ createdAt: -1 })
            .populate("companyId", "name logoUrl hqCountry hqCity")
            .populate("skillsIds", "name");

        // 2. Filter in memory for guests (delay new jobs)
        if (!user || !user.isPremium) {
            const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

            jobs = jobs.filter(job => {
                const jobDate = new Date(job.createdAt);
                return jobDate <= oneHourAgo;
            });
        }

        // 3. Location filter
        if (location) {
            jobs = jobs.filter(job =>
                job.companyId?.hqCountry?.toLowerCase().includes(location.toLowerCase()) ||
                job.companyId?.hqCity?.toLowerCase().includes(location.toLowerCase())
            );
        }

        res.status(200).json({
            success: true,
            message: "Search results",
            count: jobs.length,
            data: jobs
        });
    } catch (error) {
        next(error);
    }
};



// ============ FILTER JOBS ============
export const filterJobs = async (req, res, next) => {
    try {
        const user = req.login_user || null;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const now = new Date();

        const {
            title,
            location,
            employmentType,
            workplaceModel,
            category,
            salaryMin,
            salaryMax,
        } = req.query;

        let query = {
            isLive: true,
            dueDate: { $gt: now }
        };

        if (title) {
            query.title = { $regex: title, $options: 'i' };
        }
        if (employmentType) {
            const employmentTypeArray = employmentType.split(',');

            query.employmentType = { $in: employmentTypeArray };
        }
        if (workplaceModel) {
            const workplaceModelArray = workplaceModel.split(',');

            query.workplaceModel = { $in: workplaceModelArray };
        }
        if (category) {
            const categoryArray = category.split(',');

            query.categories = { $in: categoryArray };
        }
        if (salaryMin) {
            query.salaryMin = { $gte: Number(salaryMin) };
        }
        if (salaryMax) {
            query.salaryMax = { $lte: Number(salaryMax) };
        }

        // 1. Fetch ALL matching jobs
        let jobs = await JobModel.find(query)
            .sort({ createdAt: -1 })
            .populate("companyId", "name logoUrl hqCountry hqCity")
            .populate("skillsIds", "name");

        // 2. Filter in memory for guests (delay new jobs)
        if (!user || !user.isPremium) {
            const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

            jobs = jobs.filter(job => {
                const jobDate = new Date(job.createdAt);
                return jobDate <= oneHourAgo;
            });
        }

        // 3. Location filter
        if (location) {
            jobs = jobs.filter(job =>
                job.companyId?.hqCountry?.toLowerCase().includes(location.toLowerCase()) ||
                job.companyId?.hqCity?.toLowerCase().includes(location.toLowerCase())
            );
        }

        const totalCount = jobs.length;
        const paginatedJobs = jobs.slice(skip, skip + limit);

        res.status(200).json({
            success: true,
            message: "Filtered jobs",
            data: paginatedJobs,
            pagination: {
                totalCount,
                totalPages: Math.ceil(totalCount / limit),
                currentPage: page,
                limit
            }
        });
    } catch (error) {
        next(error);
    }
};




// ============ GET ALL COMPANIES ============
export const getAllCompanies = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [companies, totalCount] = await Promise.all([
            CompanyModel.find().skip(skip).limit(limit),
            CompanyModel.countDocuments()
        ]);

        const companiesWithJobCount = await Promise.all(
            companies.map(async (company) => {
                const jobCount = await JobModel.countDocuments({
                    companyId: company._id,
                    isLive: true
                });
                return {
                    ...company.toObject(),
                    jobCount: jobCount
                };
            })
        );

        res.status(200).json({
            success: true,
            message: "Companies fetched successfully",
            data: companiesWithJobCount,
            pagination: {
                totalCount,
                totalPages: Math.ceil(totalCount / limit),
                currentPage: page,
                limit
            }
        });
    } catch (error) {
        next(error);
    }
};

// ============ FILTER COMPANIES ============
export const filterCompanies = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const { industry, companySize, name, location } = req.query;

        let query = {};
        if (name) {
            query.name = { $regex: name, $options: 'i' };
        }
        if (industry) {
            query.industry = { $regex: industry, $options: 'i' };
        }
        // Add location filter
        if (location) {
            query.$or = [
                { hqCountry: { $regex: location, $options: 'i' } },
                { hqCity: { $regex: location, $options: 'i' } }
            ];
        }

        const companies = await CompanyModel.find(query);
        let companiesWithJobCount = await Promise.all(
            companies.map(async (company) => {
                const jobCount = await JobModel.countDocuments({
                    companyId: company._id,
                    isLive: true
                });
                return {
                    ...company.toObject(),
                    jobCount: jobCount
                };
            })
        );

        // Filter by company size in memory (since it needs string matching)
        if (companySize) {
            companiesWithJobCount = companiesWithJobCount.filter(company => {
                const range = company.employeesRange;
                if (!range) return false;

                switch (companySize) {
                    case '1-50':
                        return range === '1-50' || range.includes('1-50');
                    case '51-150':
                        return range === '51-150' || range.includes('51-150');
                    case '151-250':
                        return range === '151-250' || range.includes('151-250');
                    case '251-500':
                        return range === '251-500' || range.includes('251-500');
                    case '501-1000':
                        return range === '501-1000' || range.includes('501-1000');
                    case '1000+':
                        return range === '10000+' || range === '5000-10000' || range.includes('1000');
                    default:
                        return true;
                }
            });
        }

        // Apply pagination after all filtering
        const totalCount = companiesWithJobCount.length;
        const paginatedCompanies = companiesWithJobCount.slice(skip, skip + limit);

        res.status(200).json({
            success: true,
            message: "Filtered companies",
            data: paginatedCompanies,
            pagination: {
                totalCount,
                totalPages: Math.ceil(totalCount / limit),
                currentPage: page,
                limit
            }
        });
    } catch (error) {
        next(error);
    }
};



// ============ GET COMPANY BY ID ============
export const getCompanyById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const company = await CompanyModel.findById(id);

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }

        const jobs = await JobModel.find({ companyId: id, isLive: true })
            .populate("skillsIds", "name");

        let linkedin = '';
        let facebook = '';
        let twitter = '';

        if (company.links && company.links.length > 0) {
            company.links.forEach(link => {
                if (link.type === 'LINKEDIN') linkedin = link.value;
                if (link.type === 'FACEBOOK') facebook = link.value;
                if (link.type === 'TWITTER') twitter = link.value;
            });
        }

        const formattedCompany = {
            id: company._id,
            name: company.name,
            logo: company.logoUrl,
            website: company.website || '',
            industry: company.industry || '',
            about: company.about || '',
            founded: company.foundedDate ? new Date(company.foundedDate).getFullYear().toString() : 'N/A',
            employees: company.employeesRange || 'N/A',
            linkedin: linkedin,
            facebook: facebook,
            twitter: twitter,
            techStack: company.techStack || [],
            images: company.images || [],
            locations: company.countries || [],
            hqCity: company.hqCity,
            hqCountry: company.hqCountry,
            jobs: jobs,
            jobCount: jobs.length
        };

        res.status(200).json({
            success: true,
            data: formattedCompany
        });
    } catch (error) {
        next(error);
    }
};