import JobSeekerModel from "../../../DB/Models/JobSeekerModel.js";
import JobApplicationModel from "../../../DB/Models/JobApplicationModel.js";

export const getMyJobApplicationsService = async (userId) => {

  const seeker = await JobSeekerModel.findOne({ userId });


  if (!seeker) {
    const error = new Error("Job seeker not found for this user");
    error.statusCode = 404;
    throw error;
  }

  const applications = await JobApplicationModel
  .find({ seekerId: userId })
  .populate({
    path: 'jobId',
    select: 'title companyId',
    populate: {
      path: 'companyId',
      select: 'name'
    }
  })
  .sort({ appliedAt: -1 });


  return applications.map(app => ({
    id: app._id,
    role: app.jobId?.title,
    company: app.jobId?.companyId?.name ?? '—',
    dateApplied: app.appliedAt
  }));
};

