import UserModel from "../../../DB/Models/UserModel.js";  
import ApiError from "../../../Utils/ApiError.utils.js";
import CompanyModel from "../../../DB/Models/CompanyModel.js";
import bcrypt ,{ compareSync, hashSync } from "bcrypt";
import { TECH_STACK } from "../../../Constants/constants.js";





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

  /* ================= LINKS ================= */
  if (
    Array.isArray(data.links) &&
    JSON.stringify(data.links) !== JSON.stringify(company.links)
  ) {
    company.links = data.links;
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
      links: company.links,
      techStack: company.techStack,

      isVerified: company.isVerified,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    },
  };
};





/* 

==================================================== recruiter =============================

    // Fetch skills
    useEffect(() => {
        const fetchSkills = async () => {
            const skillsResponse = await getSkills();

            const skillsArray = skillsResponse.data.data || skillsResponse.data;

            const formattedSkills = skillsArray.map((skill: { _id: string; name: string }) => ({
                value: skill._id,  // MongoDB ID
                label: skill.name  // Skill Name
            }));

            setSkillsOptions(formattedSkills);

        };
        toast.promise(fetchSkills(), {
            error: (err) => {
                const errorMessage = err.response?.data?.error || "Failed to fetch skills";
                return `${errorMessage}`;
            }
        }
        );
    }, []);



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