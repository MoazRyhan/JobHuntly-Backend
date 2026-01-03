import mongoose from "mongoose";
import { JOB_EMPLOYMENT_TYPES, LANGUAGE_LEVELS } from "../../Constants/constants.js";

const JobSeekerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    headline: String,
    currentJobTitle: String,

    locationCity: String,
    locationCountry: String,

    aboutMe: String,
    experienceYears: Number,
    highestQualification: String,
    logoUrl: String,
    backGroundUrl: String,

    openForOpportunities: {
      type: Boolean,
      default: false,
    },

    /* ================= SKILLS ================= */
    skills: [{ type: mongoose.Schema.Types.ObjectId, ref: "Skill" }] ,


    /* ================= LANGUAGES ================= */
    languages: [
      {
        name: { type: String, required: true },
        level: {type : String , enum: Object.values(LANGUAGE_LEVELS)  , default:LANGUAGE_LEVELS.BASIC }
      },
    ],

    /* ================= SOCIAL LINKS ================= */
    socialLinks: {
      linkedin: String,
      twitter: String,
      instagram: String,
      website: String,
      github: String,
    },

    /* ================= EXPERIENCES ================= */
    experiences: [
      {
        jobTitle: String,
        companyName: String,
        employmentType: {type : String , enum: Object.values(JOB_EMPLOYMENT_TYPES) },
        location: String,
        startDate: Date,
        endDate: Date,
        currentlyWorking: {
          type: Boolean,
          default: false,
        },
        description: String,
      },
    ],

    /* ================= EDUCATIONS ================= */
    educations: [
      {
        institution: String,
        degree: String,
        fieldOfStudy: String,
        startDate: Date,
        endDate: Date,
        description: String,
      },
    ],

    /* ================= FILES ================= */
    resumeUrl: String,
    portfolioUrl: String,
  },
  { timestamps: true }
);

const JobSeekerModel =
  mongoose.models.JobSeeker ||
  mongoose.model("JobSeeker", JobSeekerSchema);

export default JobSeekerModel;
