import { getMyJobApplicationsService } from '../services/applicant.service.js';

export const getMyJobApplications = async (req, res) => {
  try {
    const userId = req.login_user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User not logged in" });
    }

    const applications = await getMyJobApplicationsService(userId);

    res.status(200).json({
      data: applications
    });

  } catch (error) {
    console.error(error);

    res.status(error.statusCode || 500).json({
      message: error.message || 'Failed to fetch job applications'
    });
  }
};



