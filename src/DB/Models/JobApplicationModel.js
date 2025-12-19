// models/JobApplication.js
import mongoose from "mongoose";
import { APPLICATION_STATUS, ANSWER_TYPE } from "../../Constants/constants.js";

const JobApplicationSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    seekerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    appliedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: Object.values(APPLICATION_STATUS),
      default: APPLICATION_STATUS.IN_REVIEW,
    },
    score: Number,

    // snapshot fields
    fullName: String,
    email: String,
    phone: String,
    currentJobTitle: String,
    linkedinUrl: String,
    portfolioUrl: String,
    additionalInfo: String,
    resumeUrl: String,

    // Saving Questions the seeker answered + The applications' answers

    responses: [
      {
        questionId: { type: mongoose.Schema.Types.ObjectId }, // Link to original question
        questionText: { type: String, required: true }, // SNAPSHOT: Stores the question at moment of applying
        type: { type: String, required: true }, // SNAPSHOT: Stores the type (YES/NO, TEXT)
        answerValue: { type: mongoose.Schema.Types.Mixed, required: true } // The actual answer
      }
    ],
  },
  { timestamps: true }
);

// The seeker should be able to apply to the job 'Only Once'
// Composite Primary Key
JobApplicationSchema.index({
  jobId: 1,
  seekerId: 1
}, { unique: true })

const JobApplicationModel =
  mongoose.models.JobApplication || mongoose.model("JobApplication", JobApplicationSchema);
export default JobApplicationModel;
