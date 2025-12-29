
import JobApplicationModel from "../../../DB/Models/JobApplicationModel.js";

export const getMyJobApplicationsService = async (seekerId) => {
  const applications = await JobApplicationModel
    .find({ seekerId })
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
