import CompanyModel from "../../../DB/Models/CompanyModel.js"
import JobApplicationModel from "../../../DB/Models/JobApplicationModel.js";
import jobListModel from "../../../DB/Models/JobListModel.js";
import JobListModel from "../../../DB/Models/JobListModel.js";

export const getCompanyByIdService=async(companyId)=>{
    const company=await CompanyModel.findById(companyId);
    return company;
}

export const createCompanyService= async(companyData)=>{
    const company= await CompanyModel.create(companyData);
    return company;
}


export const getJobsByCompanyIdService = async (companyId) => {
  const jobs = await jobListModel.find({ companyId }).sort({ createdAt: -1 });
  const jobsWithApplicantsCount = await Promise.all(
    jobs.map(async (job) => {
      const applicantsCount = await JobApplicationModel.countDocuments({
        jobId: job._id,
      });
  


      return {
        _id: job._id,
        title: job.title,
        status: job.status,
        jobType: job.jobType,
        dueDate: job.dueDate,
        createdAt: job.createdAt,
        applicantsCount,
      };
    })
  );

  return jobsWithApplicantsCount;
};