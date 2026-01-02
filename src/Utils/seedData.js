import mongoose from "mongoose";
import dotenv from "dotenv";
import JobModel from "../DB/Models/JobModel.js";
import CompanyModel from "../DB/Models/CompanyModel.js";
import SkillModel from "../DB/Models/SkillsModel.js";

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log("Connected to DB");
        await JobModel.deleteMany({});
        await CompanyModel.deleteMany({});
        await SkillModel.deleteMany({});
        console.log("🗑️ Old data deleted");
        const companies = await CompanyModel.insertMany([
            {
                name: "Google",
                website: "https://google.com",
                industry: "Technology",
                employeesRange: "10000+",
                about: "Leading technology company specializing in Internet-related services",
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
                about: "E-commerce and cloud computing giant",
                logoUrl: "https://logo.clearbit.com/amazon.com",
                hqCity: "Seattle",
                hqCountry: "USA",
                isVerified: true
            },
            {
                name: "Meta",
                website: "https://meta.com",
                industry: "Technology",
                employeesRange: "10000+",
                about: "Social media and virtual reality company",
                logoUrl: "https://logo.clearbit.com/meta.com",
                hqCity: "Menlo Park",
                hqCountry: "USA",
                isVerified: true
            },
            {
                name: "Netflix",
                website: "https://netflix.com",
                industry: "Entertainment",
                employeesRange: "5000-10000",
                about: "Streaming entertainment service",
                logoUrl: "https://logo.clearbit.com/netflix.com",
                hqCity: "Los Gatos",
                hqCountry: "USA",
                isVerified: true
            },
            {
                name: "Spotify",
                website: "https://spotify.com",
                industry: "Entertainment",
                employeesRange: "5000-10000",
                about: "Digital music streaming service",
                logoUrl: "https://logo.clearbit.com/spotify.com",
                hqCity: "Stockholm",
                hqCountry: "Sweden",
                isVerified: true
            },
            {
                name: "Airbnb",
                website: "https://airbnb.com",
                industry: "Travel",
                employeesRange: "5000-10000",
                about: "Online marketplace for lodging and tourism",
                logoUrl: "https://logo.clearbit.com/airbnb.com",
                hqCity: "San Francisco",
                hqCountry: "USA",
                isVerified: true
            },
            {
                name: "Uber",
                website: "https://uber.com",
                industry: "Transportation",
                employeesRange: "10000+",
                about: "Ride-hailing and delivery service",
                logoUrl: "https://logo.clearbit.com/uber.com",
                hqCity: "San Francisco",
                hqCountry: "USA",
                isVerified: true
            }
        ]);
        console.log("8 Companies added");
        const companies = await CompanyModel.insertMany([
            {
                name: "Google",
                website: "https://google.com",
                industry: "Technology",
                employeesRange: "10000+",
                foundedDate: new Date("1998-09-04"),
                about: "Leading technology company",
                logoUrl: "https://logo.clearbit.com/google.com",
                hqCity: "Mountain View",
                hqCountry: "USA",
                isVerified: true,
                links: [
                    { type: "LINKEDIN", value: "https://linkedin.com/company/google" },
                    { type: "TWITTER", value: "https://twitter.com/google" },
                    { type: "FACEBOOK", value: "https://facebook.com/google" }
                ],
                techStack: [
                    { name: "Python" },
                    { name: "Go" },
                    { name: "JavaScript" }
                ]
            },
            {
                name: "Microsoft",
                website: "https://microsoft.com",
                industry: "Technology",
                employeesRange: "10000+",
                foundedDate: new Date("1975-04-04"),
                about: "Software and cloud computing company",
                logoUrl: "https://logo.clearbit.com/microsoft.com",
                hqCity: "Redmond",
                hqCountry: "USA",
                isVerified: true,
                links: [
                    { type: "LINKEDIN", value: "https://linkedin.com/company/microsoft" },
                    { type: "TWITTER", value: "https://twitter.com/microsoft" }
                ],
                techStack: [
                    { name: "C#" },
                    { name: "TypeScript" },
                    { name: "Azure" }
                ]
            },
            {
                name: "Amazon",
                website: "https://amazon.com",
                industry: "E-commerce",
                employeesRange: "10000+",
                foundedDate: new Date("1994-07-05"),
                about: "E-commerce and cloud computing giant",
                logoUrl: "https://logo.clearbit.com/amazon.com",
                hqCity: "Seattle",
                hqCountry: "USA",
                isVerified: true,
                links: [
                    { type: "LINKEDIN", value: "https://linkedin.com/company/amazon" },
                    { type: "TWITTER", value: "https://twitter.com/amazon" }
                ],
                techStack: [
                    { name: "Java" },
                    { name: "AWS" },
                    { name: "Python" }
                ]
            }
        ]);
        const skills = await SkillModel.insertMany([
            { name: "JavaScript" },
            { name: "React" },
            { name: "Node.js" },
            { name: "Python" },
            { name: "MongoDB" },
            { name: "TypeScript" },
            { name: "AWS" },
            { name: "Docker" },
            { name: "Figma" },
            { name: "SQL" }
        ]);
        console.log("10 Skills added");
        const jobs = await JobModel.insertMany([
            {
                companyId: companies[0]._id,
                title: "Senior Frontend Developer",
                employmentTypes: ["Full-Time"],
                salaryMin: 8000,
                salaryMax: 12000,
                salaryCurrency: "USD",
                description: "Join Google's frontend team to build amazing user experiences",
                responsibilities: ["Build UI components", "Write clean code", "Code reviews"],
                whoYouAre: ["5+ years experience", "React expert", "Team player"],
                niceToHaves: ["TypeScript", "Next.js experience"],
                categories: ["Technology", "Engineering"],
                skillsIds: [skills[0]._id, skills[1]._id, skills[5]._id],
                isLive: true
            },
            {
                companyId: companies[0]._id,
                title: "UI/UX Designer",
                employmentTypes: ["Full-Time", "Remote"],
                salaryMin: 6000,
                salaryMax: 9000,
                salaryCurrency: "USD",
                description: "Design beautiful and intuitive user interfaces",
                responsibilities: ["Create wireframes", "Design UI", "User research"],
                whoYouAre: ["3+ years experience", "Figma expert"],
                niceToHaves: ["Animation skills", "Prototyping"],
                categories: ["Design"],
                skillsIds: [skills[8]._id],
                isLive: true
            },
            {
                companyId: companies[1]._id,
                title: "Backend Developer",
                employmentTypes: ["Full-Time"],
                salaryMin: 7000,
                salaryMax: 11000,
                salaryCurrency: "USD",
                description: "Build scalable backend systems at Microsoft",
                responsibilities: ["Build APIs", "Database design", "System architecture"],
                whoYouAre: ["4+ years experience", "Node.js expert"],
                niceToHaves: ["AWS experience", "Microservices"],
                categories: ["Technology", "Engineering"],
                skillsIds: [skills[2]._id, skills[4]._id],
                isLive: true
            },
            {
                companyId: companies[1]._id,
                title: "DevOps Engineer",
                employmentTypes: ["Full-Time"],
                salaryMin: 8000,
                salaryMax: 13000,
                salaryCurrency: "USD",
                description: "Manage and optimize cloud infrastructure",
                responsibilities: ["CI/CD pipelines", "Cloud management", "Monitoring"],
                whoYouAre: ["5+ years experience", "AWS/Azure expert"],
                niceToHaves: ["Kubernetes", "Terraform"],
                categories: ["Technology", "Engineering"],
                skillsIds: [skills[6]._id, skills[7]._id],
                isLive: true
            },
            {
                companyId: companies[2]._id,
                title: "Marketing Manager",
                employmentTypes: ["Full-Time"],
                salaryMin: 5000,
                salaryMax: 8000,
                salaryCurrency: "USD",
                description: "Lead marketing campaigns at Amazon",
                responsibilities: ["Create campaigns", "Manage team", "Analyze metrics"],
                whoYouAre: ["5+ years in marketing", "Leadership skills"],
                niceToHaves: ["Digital marketing", "SEO knowledge"],
                categories: ["Marketing", "Business"],
                skillsIds: [],
                isLive: true
            },
            {
                companyId: companies[2]._id,
                title: "Data Analyst",
                employmentTypes: ["Full-Time", "Remote"],
                salaryMin: 5500,
                salaryMax: 8500,
                salaryCurrency: "USD",
                description: "Analyze data to drive business decisions",
                responsibilities: ["Data analysis", "Create reports", "SQL queries"],
                whoYouAre: ["2+ years experience", "SQL expert"],
                niceToHaves: ["Python", "Tableau"],
                categories: ["Technology", "Business"],
                skillsIds: [skills[3]._id, skills[9]._id],
                isLive: true
            },
            {
                companyId: companies[3]._id,
                title: "Full Stack Developer",
                employmentTypes: ["Full-Time"],
                salaryMin: 9000,
                salaryMax: 14000,
                salaryCurrency: "USD",
                description: "Build full stack applications at Meta",
                responsibilities: ["Frontend & Backend", "API design", "Database management"],
                whoYouAre: ["5+ years experience", "React & Node.js"],
                niceToHaves: ["GraphQL", "React Native"],
                categories: ["Technology", "Engineering"],
                skillsIds: [skills[0]._id, skills[1]._id, skills[2]._id],
                isLive: true
            },
            {
                companyId: companies[3]._id,
                title: "Product Manager",
                employmentTypes: ["Full-Time"],
                salaryMin: 8000,
                salaryMax: 12000,
                salaryCurrency: "USD",
                description: "Lead product development at Meta",
                responsibilities: ["Product strategy", "Roadmap planning", "Stakeholder management"],
                whoYouAre: ["5+ years PM experience", "Technical background"],
                niceToHaves: ["MBA", "Agile certification"],
                categories: ["Business"],
                skillsIds: [],
                isLive: true
            },
            {
                companyId: companies[4]._id,
                title: "Senior Software Engineer",
                employmentTypes: ["Full-Time", "Remote"],
                salaryMin: 10000,
                salaryMax: 15000,
                salaryCurrency: "USD",
                description: "Build streaming platform features",
                responsibilities: ["System design", "Performance optimization", "Team mentoring"],
                whoYouAre: ["7+ years experience", "Distributed systems"],
                niceToHaves: ["Video streaming", "CDN experience"],
                categories: ["Technology", "Engineering"],
                skillsIds: [skills[0]._id, skills[2]._id, skills[6]._id],
                isLive: true
            },
            {
                companyId: companies[5]._id,
                title: "Mobile Developer",
                employmentTypes: ["Full-Time"],
                salaryMin: 7000,
                salaryMax: 10000,
                salaryCurrency: "USD",
                description: "Build Spotify mobile apps",
                responsibilities: ["iOS/Android development", "API integration", "Testing"],
                whoYouAre: ["3+ years mobile experience", "React Native or Flutter"],
                niceToHaves: ["Published apps", "Audio experience"],
                categories: ["Technology", "Engineering"],
                skillsIds: [skills[0]._id, skills[1]._id],
                isLive: true
            },
            {
                companyId: companies[6]._id,
                title: "HR Manager",
                employmentTypes: ["Full-Time"],
                salaryMin: 5000,
                salaryMax: 7500,
                salaryCurrency: "USD",
                description: "Lead HR operations at Airbnb",
                responsibilities: ["Recruitment", "Employee relations", "HR policies"],
                whoYouAre: ["4+ years HR experience", "Leadership skills"],
                niceToHaves: ["HR certification", "Tech industry"],
                categories: ["Human Resource"],
                skillsIds: [],
                isLive: true
            },
            {
                companyId: companies[7]._id,
                title: "Sales Representative",
                employmentTypes: ["Full-Time"],
                salaryMin: 4000,
                salaryMax: 6500,
                salaryCurrency: "USD",
                description: "Drive sales growth at Uber",
                responsibilities: ["Client acquisition", "Sales targets", "Relationship building"],
                whoYouAre: ["2+ years sales experience", "Communication skills"],
                niceToHaves: ["B2B sales", "CRM experience"],
                categories: ["Sales", "Business"],
                skillsIds: [],
                isLive: true
            },
            {
                companyId: companies[7]._id,
                title: "Junior Frontend Developer",
                employmentTypes: ["Full-Time", "Internship"],
                salaryMin: 3000,
                salaryMax: 5000,
                salaryCurrency: "USD",
                description: "Start your career at Uber",
                responsibilities: ["Build UI components", "Bug fixes", "Learn from seniors"],
                whoYouAre: ["0-2 years experience", "React basics"],
                niceToHaves: ["Personal projects", "CS degree"],
                categories: ["Technology", "Engineering"],
                skillsIds: [skills[0]._id, skills[1]._id],
                isLive: true
            }
        ]);
        console.log("13 Jobs added");

        console.log("Seed completed successfully!");
        process.exit(0);

    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    }
};

seedData();