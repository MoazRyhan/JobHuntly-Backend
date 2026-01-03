import UserModel from "../../../DB/Models/UserModel.js";  
import ApiError from "../../../Utils/ApiError.utils.js";
import { sendWelcomeEmail } from "./../../../Utils/email.utils.js"
import bcrypt ,{ compareSync, hashSync } from "bcrypt";
import JobSeekerModel from "../../../DB/Models/JobSeekerModel.js";
import CompanyModel from "../../../DB/Models/CompanyModel.js";
import { SYSTEM_ROLE } from "../../../Constants/constants.js";


export const updateProfile = async ( userId,data) => {

  
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

    // for (const skill of data.skills) {
    //   const skillName = skill.name.trim().toLowerCase();

    //   //  check if skill already exists
    //   let existingSkill = await SkillModel.findOne({ name: skillName });

    //   if (!existingSkill) {
    //     //  create new skill
    //     existingSkill = await SkillModel.create({
    //       name: skillName,
    //       level: skill.level,
    //       seekerId: userId,
    //     });
    //   }

    //   skillIds.push(existingSkill._id);
    // }

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
  console.log( userId );
  
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






// ===================================== for all 


export const uploadImage = async ({
  file,
  req,
  role,
  folder,
  userId,
}) => {
  if (!file) {
    throw new ApiError(400, "No file uploaded")
  }

  const fileUrl = `${req.protocol}://${req.get("host")}/assets/${folder}/${file.filename}`

  /* ================= ROLE BASED SAVE ================= */

  if (role === SYSTEM_ROLE.JOB_SEEKER) {
    const jobSeeker = await JobSeekerModel.findOne({ userId })
    if (!jobSeeker) {
      throw new ApiError(404, "Job seeker profile not found")
    }

    if (folder === "logo") jobSeeker.logoUrl = fileUrl
    if (folder === "background") jobSeeker.backGroundUrl = fileUrl

    await jobSeeker.save()
  }

  if (role === SYSTEM_ROLE.COMPANY) {
    const company = await CompanyModel.findOne({ userId })
    if (!company) {
      throw new ApiError(404, "Company profile not found")
    }

    if (folder === "logo") company.logoUrl = fileUrl
    if (folder === "background") company.backGroundUrl = fileUrl

    await company.save()
  }

  return {
    message: "File uploaded successfully",
    url: fileUrl,
  }
}


export const changeEmail = async (userId, { newEmail }) => {
  const user = await UserModel.findById(userId).select("+password")

  if (!user) throw new ApiError(404, "User not found")

  const emailExists = await UserModel.findOne({ email: newEmail })
  if (emailExists) throw new ApiError(400, "Email already in use")

  user.email = newEmail
  await user.save()

  /* ================= EMAIL ================= */
   await sendWelcomeEmail(user.fullName, user.email);
  

  return {
    email: user.email,
  }
}


export const resetPassword = async (userId, { oldPassword, newPassword }) => {
  const user = await UserModel.findById(userId).select("+password")

  if (!user) throw new ApiError(404, "User not found")

  const isMatch = bcrypt.compareSync(oldPassword, user.password)
  if (!isMatch) throw new ApiError(401, "Old password is incorrect")

  user.password = hashSync(newPassword, +process.env.PASSWORD_SALT)
  await user.save()
}


export const deleteAccount = async (userId, role, password) => {
  const user = await UserModel.findById(userId).select("+password")
  if (!user) throw new ApiError(404, "User not found")

  const isMatch = bcrypt.compareSync(password, user.password)
  if (!isMatch) throw new ApiError(401, "Invalid password")

  // 🧠 delete role-based profile
  if (role === SYSTEM_ROLE.JOB_SEEKER) {
    await JobSeekerModel.findOneAndDelete({ userId })
  }

  if (role === SYSTEM_ROLE.COMPANY) {
    await CompanyModel.findOneAndDelete({ userId })
  }

  // ❌ delete user
  await UserModel.findByIdAndDelete(userId)
}



/*
========================================== Applicant =============================


💼 Experiences
POST   http://localhost:3000/users/me/experiences
DELETE http://localhost:3000/experiences/:id

🎓 Educations
POST   http://localhost:3000/users/me/educations
DELETE http://localhost:3000/educations/:id

🧠 Skills
DELETE http://localhost:3000/users/me/skills/:id


====================================================

POST   http://localhost:3000/users/me/avatar

📝 background image
PUT    http://localhost:3000/users/me/BG-image




👤 My Profile (الصفحة العامة)
PUT    http://localhost:3000/users/me/profile 🫸
GET    http://localhost:3000/users/me/profile 🫸


⚙️ Settings → Login Details
تغيير الإيميل
PUT    http://localhost:3000/settings/change-email 🫸

تغيير الباسورد
PUT    http://localhost:3000/settings/reset-password 🫸

❌ Delete account
DELETE http://localhost:3000/settings/delete-account 🫸


*/