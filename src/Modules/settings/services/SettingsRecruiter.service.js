import UserModel from "../../../DB/Models/UserModel.js";  
import ApiError from "../../../Utils/ApiError.utils.js";
import CompanyModel from "../../../DB/Models/CompanyModel.js";
import bcrypt ,{ compareSync, hashSync } from "bcrypt";
import { SYSTEM_ROLE, TECH_STACK } from "../../../Constants/constants.js";





export const updateCompanyProfile = async (userId, data) => {
  const company = await CompanyModel.findOne({ userId });

  if (!company) {
    throw new ApiError(404, "Company profile not found");
  }

  /* ================= BASIC INFO ================= */
  const updatableFields = [
    "name",
    "industry",
    "website",
    "foundedDate",
    "employeesRange",
    "about",
    "hqCity",
    "hqCountry",
  ];

  updatableFields.forEach((field) => {
    if (data[field] !== undefined && data[field] !== company[field]) {
      company[field] = data[field];
    }
  });

  /* ================= IMAGES ================= */
  if (Array.isArray(data.images)) {
    company.images = data.images;
  }

  /* ================= COUNTRIES / LOCATIONS ================= */
  if (
    Array.isArray(data.countries) &&
    JSON.stringify(data.countries) !== JSON.stringify(company.countries)
  ) {
    company.countries = data.countries;
  }

  /* ================= socialLinks ================= */
    if (data.socialLinks) {
    company.socialLinks = {
      ...company.socialLinks,
      ...data.socialLinks,
    };
  }

 /* ================= TECH STACK ================= */
if (Array.isArray(data.techStack)) {
  const formattedTechStack = data.techStack.map((tech) => {
    const techKey = tech.name?.toUpperCase();

    if (!TECH_STACK[techKey]) {
      throw new ApiError(400, `Invalid tech stack: ${tech.name}`);
    }

    return {
      name: techKey,
      logo: TECH_STACK[techKey], //
    };
  });

  // prevent unnecessary update
  if (
    JSON.stringify(formattedTechStack) !==
    JSON.stringify(company.techStack)
  ) {
    company.techStack = formattedTechStack;
  }
}
  await company.save();

  return {
    message: "Company profile updated successfully",
    profile: company,
  };
};


export const getCompanyProfile = async (userId) => {
  /* ================= USER ================= */
  const user = await UserModel.findById(userId).select(
    "fullName email phone avatarUrl role lastLoginAt"
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  /* ================= COMPANY ================= */
  const company = await CompanyModel.findOne({ userId }).lean();

  if (!company) {
    throw new ApiError(404, "Company profile not found");
  }

  /* ================= MERGED RESPONSE ================= */
  return {
    user,
    profile: {
      name: company.name,
      industry: company.industry,
      website: company.website,
      foundedDate: company.foundedDate,
      employeesRange: company.employeesRange,
      about: company.about,

      hqCity: company.hqCity,
      hqCountry: company.hqCountry,

      images: company.images,
      countries: company.countries,
      socialLinks: company.socialLinks,
      techStack: company.techStack,

      logoUrl: company.logoUrl,
      backgroundUrl: company.backgroundUrl,

      isVerified: company.isVerified,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    },
  };
};


export const uploadCompanyImages = async ({
  files,
  req,
  role,
  userId,
}) => {
  if (!files || files.length === 0) {
    throw new ApiError(400, "No files uploaded")
  }

  if (role !== SYSTEM_ROLE.COMPANY) {
    throw new ApiError(403, "Only companies can upload company images")
  }

  const company = await CompanyModel.findOne({ userId })
  if (!company) {
    throw new ApiError(404, "Company profile not found")
  }

  const uploadedImages = []

  for (const file of files) {
    const fileUrl = `${req.protocol}://${req.get("host")}/assets/CompanyImages/${file.filename}`

    company.images.push({ src: fileUrl })
    uploadedImages.push({ src: fileUrl })
  }

  await company.save()

  return {
    message: "Company images uploaded successfully",
    images: uploadedImages,
  }
}



export const removeCompanyImage = async ({
  imageUrl,
  role,
  userId,
}) => {
  if (!imageUrl) {
    throw new ApiError(400, "Image URL is required")
  }

  /* ================= ROLE BASED DELETE ================= */

  if (role !== SYSTEM_ROLE.COMPANY) {
    throw new ApiError(403, "Only companies can remove company images")
  }

  const company = await CompanyModel.findOne({ userId })

  if (!company) {
    throw new ApiError(404, "Company profile not found")
  }

  // remove image by src
  company.images = company.images.filter(
    (img) => img.src !== imageUrl
  )

  await company.save()

  return {
    message: "Image removed successfully",
    images: company.images,
  }
}



/* 

==================================================== recruiter =============================


🏢 COMPANY (عام)
PUT    http://localhost:3000/companies/me
POST    http://localhost:3000/companies/me

🖼 Company Logo
PUT   http://localhost:3000/companies/me/logo


📍 Company Locations
DELETE http://localhost:3000/companies/me/locations/:id


🧑‍💼 Company Info (Employees / Industry / Founded)
DELETE    http://localhost:3000/companies/me/info


💻 Tech Stack
DELETE http://localhost:3000/companies/me/tech-stack/:id


DELETE http://localhost:3000/benefits/:id

=====================  ( till we decide to add it )  🎁 Benefits =====================


🖼 Working at Company (Gallery)
POST   http://localhost:3000/companies/me/gallery
DELETE http://localhost:3000/company-gallery/:id


💼 Jobs (Company Open Positions) ==========  every one will forget this =========
POST   http://localhost:3000/companies/me/jobs
PUT    http://localhost:3000/jobs/:id
DELETE http://localhost:3000/jobs/:id


*/