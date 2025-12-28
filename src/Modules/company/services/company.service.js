import CompanyModel from "../../../DB/Models/CompanyModel.js"
import JobApplicationModel from "../../../DB/Models/JobApplicationModel.js";
import JobModel from "../../../DB/Models/JobModel.js";


export const getCompanyByIdService=async(companyId)=>{
    const company=await CompanyModel.findById(companyId);
    return company;
}

export const createCompanyService= async(companyData)=>{
    const company= await CompanyModel.create(companyData);
    return company;
}


export const getJobsByCompanyIdService = async (
  companyId,
  page,
  limit,
  filters = {}
) => {
  page = Number(page);
  limit = Number(limit);
  const skip = (page - 1) * limit;

  const now = new Date();
  const query = { companyId };

  if (filters.search) {
    query.title = { $regex: filters.search, $options: "i" };
  }

  if (filters.jobType) {
    query.employmentType = filters.jobType;
  }

  if (filters.status === "live") {
    query.$or = [
      { dueDate: { $gte: now } },
      { dueDate: { $exists: false } },
    ];
  }

  if (filters.status === "closed") {
    query.$or = [
      { isLive: false },
      { dueDate: { $lt: now } },
    ];
  }

  const totalJobs = await JobModel.countDocuments(query);

  const jobs = await JobModel.find(query)
    .select("title employmentType dueDate isLive createdAt") 
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const jobsWithApplicantsCount = await Promise.all(
    jobs.map(async (job) => {
      const applicantsCount = await JobApplicationModel.countDocuments({
        jobId: job._id,
      });

      const status =
        job.isLive === false || (job.dueDate && job.dueDate < now)
          ? "closed"
          : "live";

      return {
        _id: job._id,
        title: job.title,
        jobType: job.employmentType, 
        status,
        dueDate: job.dueDate,
        createdAt: job.createdAt,
        applicantsCount,
      };
    })
  );

  return {
    data: jobsWithApplicantsCount,
    total: totalJobs,
    page,
    limit,
    totalPages: Math.ceil(totalJobs / limit),
  };
};


