// import { getMyJobApplicationsService } from '../services/jobApplication.service.js';

import JobSeekerModel from '../../../DB/Models/JobSeekerModel.js';
import { getMyJobApplicationsService } from '../services/applicant.service.js';

export const getMyJobApplications = async (req, res) => {
  try {
    // const seekerId = req.login_user._id || "665b2b2b2b2b2b2b2b2b2b01";
        // TEMP: hardcoded USER id (must exist in users collection)
    const seekerId = "665b2b2b2b2b2b2b2b2b2b01";

    //find job seeker by userId
    const seeker = await JobSeekerModel.findOne({ userId: seekerId });
    if (!seeker) {
  return res.status(404).json({
    message: "Job seeker not found for this user"
  });
}


    const applications = await getMyJobApplicationsService(seeker._id);

    res.status(200).json({
      data: applications
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to fetch job applications'
    });
  }
};

