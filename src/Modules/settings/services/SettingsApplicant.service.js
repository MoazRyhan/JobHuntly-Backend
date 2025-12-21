import UserModel from "../../../DB/Models/UserModel.js";  
import ApiError from "../../../Utils/ApiError.utils.js";
import { sendWelcomeEmail } from "./../../../Utils/email.utils.js"
import bcrypt ,{ compareSync, hashSync } from "bcrypt";
import JobSeekerModel from "../../../DB/Models/JobSeekerModel.js";

// /**
//  * Update Job Seeker Profile
//  * @param {String} userId
//  * @param {Object} data
//  */



export const updateProfile = async () => {
  const jobSeeker = await JobSeekerModel.findOne({ userId });

  if (!jobSeeker) {
    throw new ApiError(404, "Job seeker profile not found");
  }

    /* ================= BASIC INFO ================= */
    jobSeeker.headline = data.headline;

    jobSeeker.currentJobTitle = data.currentJobTitle;


    jobSeeker.locationCity = data.locationCity;

    jobSeeker.locationCountry = data.locationCountry;

    jobSeeker.aboutMe = data.aboutMe;

    jobSeeker.experienceYears = data.experienceYears;


    jobSeeker.highestQualification = data.highestQualification;


    jobSeeker.openForOpportunities = data.openForOpportunities;


  /* ================= SKILLS ================= */
  if (Array.isArray(data.skills)) {
    jobSeeker.skills = data.skills;
  }

  /* ================= LANGUAGES ================= */
  if (Array.isArray(data.languages)) {
    jobSeeker.languages = data.languages;
  }

  /* ================= SOCIAL LINKS ================= */
  if (data.socialLinks) {
    jobSeeker.socialLinks = {
      ...jobSeeker.socialLinks,
      ...data.socialLinks,
    };
  }

  /* ================= EXPERIENCES ================= */
  if (Array.isArray(data.experiences)) {
    jobSeeker.experiences = data.experiences;
  }

  /* ================= EDUCATIONS ================= */
  if (Array.isArray(data.educations)) {
    jobSeeker.educations = data.educations;
  }

  /* ================= FILES ================= */
    jobSeeker.resumeUrl = data.resumeUrl;

    jobSeeker.portfolioUrl = data.portfolioUrl;

  await jobSeeker.save();

  return {
    message: "Profile updated successfully",
    profile: jobSeeker,
  };
};





export const getProfile = async (userId) => {
  /* ================= USER ================= */
  const user = await UserModel.findById(userId).select(
    "fullName email phone avatarUrl role lastLoginAt"
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  /* ================= JOB SEEKER ================= */
  const jobSeeker = await JobSeekerModel.findOne({ userId })
    .populate("skills", "name")
    .lean();

  if (!jobSeeker) {
    throw new ApiError(404, "Job seeker profile not found");
  }

  /* ================= MERGED RESPONSE ================= */
  return {
    user,
    profile: {
      headline: jobSeeker.headline,
      currentJobTitle: jobSeeker.currentJobTitle,

      locationCity: jobSeeker.locationCity,
      locationCountry: jobSeeker.locationCountry,

      aboutMe: jobSeeker.aboutMe,
      experienceYears: jobSeeker.experienceYears,
      highestQualification: jobSeeker.highestQualification,

      openForOpportunities: jobSeeker.openForOpportunities,

      skills: jobSeeker.skills,
      languages: jobSeeker.languages,

      socialLinks: jobSeeker.socialLinks,
      experiences: jobSeeker.experiences,
      educations: jobSeeker.educations,

      resumeUrl: jobSeeker.resumeUrl,
      portfolioUrl: jobSeeker.portfolioUrl,

      createdAt: jobSeeker.createdAt,
      updatedAt: jobSeeker.updatedAt,
    },
  };
};


