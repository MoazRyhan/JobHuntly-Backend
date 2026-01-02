import { asyncHandler } from "../../../Utils/asyncHandler.utils.js";
import UserModel from "../../../DB/Models/UserModel.js";
import CompanyModel from "../../../DB/Models/CompanyModel.js";
import JobModel from "../../../DB/Models/JobModel.js";
import JobApplicationModel from "../../../DB/Models/JobApplicationModel.js";
import ApiError from "../../../Utils/ApiError.utils.js";
import { SYSTEM_ROLE } from "../../../Constants/constants.js";

export const getUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [users, totalCount] = await Promise.all([
    UserModel.find({ role: SYSTEM_ROLE.JOB_SEEKER })
      .select("-password -refreshToken")
      .skip(skip)
      .limit(limit),
    UserModel.countDocuments({ role: SYSTEM_ROLE.JOB_SEEKER }),
  ]);

  res.status(200).json({
    success: true,
    data: users,
    pagination: {
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      limit,
    },
  });
});

export const getCompanies = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [companies, totalCount] = await Promise.all([
    CompanyModel.find()
      .populate({
        path: "userId",
        select: "email fullName phone avatarUrl isActive",
      })
      .skip(skip)
      .limit(limit),
    CompanyModel.countDocuments(),
  ]);

  res.status(200).json({
    success: true,
    data: companies,
    pagination: {
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      limit,
    },
  });
});

export const patchUserStatus = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { isActive } = req.body;

  // Safety check: Prevent blocking an admin
  const userToUpdate = await UserModel.findById(userId);
  if (!userToUpdate) {
    throw new ApiError(404, "User not found");
  }

  if (userToUpdate.role === SYSTEM_ROLE.ADMIN) {
    throw new ApiError(403, "Admins cannot be blocked");
  }

  const user = await UserModel.findByIdAndUpdate(
    userId,
    { isActive },
    { new: true }
  ).select("-password -refreshToken");

  res.status(200).json({
    success: true,
    data: user,
  });
});

export const patchJobStatus = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const { isLive } = req.body;

  const job = await JobModel.findByIdAndUpdate(
    jobId,
    { isLive },
    { new: true }
  );

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  res.status(200).json({
    success: true,
    data: job,
  });
});

export const getDashboardStats = asyncHandler(async (req, res) => {
  const [seekersCount, companiesCount, jobsCount, applicationsCount] =
    await Promise.all([
      UserModel.countDocuments({ role: SYSTEM_ROLE.JOB_SEEKER }),
      CompanyModel.countDocuments(),
      JobModel.countDocuments({ isLive: true }),
      JobApplicationModel.countDocuments(),
    ]);

  res.status(200).json({
    success: true,
    data: {
      totalUsers: seekersCount,
      totalCompanies: companiesCount,
      liveJobs: jobsCount,
      totalApplications: applicationsCount,
    },
  });
});
