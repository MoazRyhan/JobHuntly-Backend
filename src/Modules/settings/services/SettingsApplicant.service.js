import UserModel from "../../../DB/Models/UserModel.js";  
import ApiError from "../../../Utils/ApiError.utils.js";
import { sendWelcomeEmail } from "./../../../Utils/email.utils.js"
import bcrypt ,{ compareSync, hashSync } from "bcrypt";
import JobSeekerModel from "../../../DB/Models/JobSeekerModel.js";
import SkillModel from "../../../DB/Models/SkillsModel.js";




export const updateProfile = async ( userId,data) => {

  // console.log( userId , "hereuserid" );
  // console.log( data , "heredata" );
  
  const jobSeeker = await JobSeekerModel.findOne({ userId });

  if (!jobSeeker) {
    throw new ApiError(404, "Job seeker profile not found");
  }

  /* ================= BASIC INFO ================= */
  const updatableFields = [
    "headline",
    "currentJobTitle",
    "locationCity",
    "locationCountry",
    "aboutMe",
    "experienceYears",
    "openForOpportunities",
    "highestQualification",
  ];

  updatableFields.forEach((field) => {
    if (
      data[field] !== undefined &&
      data[field] !== jobSeeker[field]
    ) {
      jobSeeker[field] = data[field];
    }
  });


  /* ================= SKILLS ================= */
  if (Array.isArray(data.skills)) {
    const skillIds = [];

    for (const skill of data.skills) {
      const skillName = skill.name.trim().toLowerCase();

      //  check if skill already exists
      let existingSkill = await SkillModel.findOne({ name: skillName });

      if (!existingSkill) {
        //  create new skill
        existingSkill = await SkillModel.create({
          name: skillName,
          level: skill.level,
          seekerId: userId,
        });
      }

      skillIds.push(existingSkill._id);
    }

    //  prevent unnecessary update
    if (
      JSON.stringify(skillIds.map(String)) !==
      JSON.stringify(jobSeeker.skills.map(String))
    ) {
      jobSeeker.skills = skillIds;
    }
  }
  /* ================= LANGUAGES ================= */
  if (
    Array.isArray(data.languages) &&
    JSON.stringify(data.languages) !== JSON.stringify(jobSeeker.languages)
  ) {
    jobSeeker.languages = data.languages;
  }

  /* ================= SOCIAL LINKS ================= */
  if (data.socialLinks) {
    jobSeeker.socialLinks = {
      ...jobSeeker.socialLinks,
      ...data.socialLinks,
    };
  }

  /* ================= EXPERIENCES (always update) ================= */
  if (Array.isArray(data.experiences)) {
    jobSeeker.experiences = data.experiences;
  }

  /* ================= EDUCATIONS (always update) ================= */
  if (Array.isArray(data.educations)) {
    jobSeeker.educations = data.educations;
  }

  /* ================= FILES (always update) ================= */
  if (data.resumeUrl !== undefined) {
    jobSeeker.resumeUrl = data.resumeUrl;
  }

  if (data.portfolioUrl !== undefined) {
    jobSeeker.portfolioUrl = data.portfolioUrl;
  }

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


