import mongoose from "mongoose";

const JobSeekerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    headline: String,
    locationCity: String,
    locationCountry: String,
    aboutMe: String,
    currentJobTitle: String,
    experienceYears: Number,
    highestQualification: String,
    openForOpportunities: { type: Boolean, default: false },
    linkedinUrl: String,
    portfolioUrl: String,
    resumeUrl: String,
  },
  { timestamps: true }
);

const JobSeekerModel =
  mongoose.models.JobSeeker ||
  mongoose.model("JobSeeker", JobSeekerSchema);

export default JobSeekerModel;
