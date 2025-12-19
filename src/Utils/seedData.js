import mongoose from "mongoose";
import dotenv from "dotenv";
import JobModel from "../DB/Models/JobModel.js";
import CompanyModel from "../DB/Models/CompanyModel.js";
import SkillsModel from "../DB/Models/SkillsModel.js";

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log("Connected to DB");
        const companies = await CompanyModel.insertMany([
            {
                name: "Google",
                website: "https://google.com",
                industry: "Technology",
                employeesRange: "10000+",
                about: "Leading technology company",
                logoUrl: "https://logo.clearbit.com/google.com",
                hqCity: "Mountain View",
                hqCountry: "USA",
                isVerified: true
            },
            {
                name: "Microsoft",
                website: "https://microsoft.com",
                industry: "Technology",
                employeesRange: "10000+",
                about: "Software and cloud computing company",
                logoUrl: "https://logo.clearbit.com/microsoft.com",
                hqCity: "Redmond",
                hqCountry: "USA",
                isVerified: true
            },
            {
                name: "Amazon",
                website: "https://amazon.com",
                industry: "E-commerce",
                employeesRange: "10000+",
                about: "E-commerce and cloud computing",
                logoUrl: "https://logo.clearbit.com/amazon.com",
                hqCity: "Seattle",
                hqCountry: "USA",
                isVerified: true
            }
        ]);
        console.log("Companies added");
        const skills = await SkillsModel.insertMany([
            { name: "JavaScript" },
            { name: "React" },
            { name: "Node.js" },
            { name: "Python" },
            { name: "MongoDB" }
        ]);
        console.log("Skills added");
        const jobs = await JobModel.insertMany([
            {
                companyId: companies[0]._id,
                title: "Frontend Developer",
                employmentTypes: ["Full-Time", "Remote"],
                salaryMin: 5000,
                salaryMax: 8000,
                salaryCurrency: "USD",
                description: "We are looking for a skilled Frontend Developer",
                responsibilities: ["Build UI components", "Write clean code", "Collaborate with team"],
                whoYouAre: ["3+ years experience", "React expert", "Team player"],
                niceToHaves: ["TypeScript", "Next.js experience"],
                categories: ["Technology", "Engineering"],
                skillsIds: [skills[0]._id, skills[1]._id],
                isLive: true
            },
            {
                companyId: companies[1]._id,
                title: "Backend Developer",
                employmentTypes: ["Full-Time"],
                salaryMin: 6000,
                salaryMax: 10000,
                salaryCurrency: "USD",
                description: "Join our backend team",
                responsibilities: ["Build APIs", "Database design", "System architecture"],
                whoYouAre: ["4+ years experience", "Node.js expert"],
                niceToHaves: ["AWS experience", "Microservices"],
                categories: ["Technology", "Engineering"],
                skillsIds: [skills[2]._id, skills[4]._id],
                isLive: true
            },
            {
                companyId: companies[2]._id,
                title: "Marketing Manager",
                employmentTypes: ["Full-Time"],
                salaryMin: 4000,
                salaryMax: 7000,
                salaryCurrency: "USD",
                description: "Lead our marketing efforts",
                responsibilities: ["Create campaigns", "Manage team", "Analyze metrics"],
                whoYouAre: ["5+ years in marketing", "Leadership skills"],
                niceToHaves: ["Digital marketing", "SEO knowledge"],
                categories: ["Marketing", "Business"],
                skillsIds: [],
                isLive: true
            }
        ]);
        console.log("Jobs added");

        console.log("Seed completed successfully!");
        process.exit(0);

    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    }
};

seedData();