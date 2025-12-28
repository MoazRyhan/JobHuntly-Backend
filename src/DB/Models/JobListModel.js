import mongoose from "mongoose";
import {
  jobEmploymentTypeValues,
  jobCategoryValues,
} from "../../Constants/constants.js";


const JobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true, // role col
      trim: true,
    },

    jobType: {
      type: String,
      enum: jobEmploymentTypeValues,
      required: true,
    },

    category: {
      type: String,
      enum: jobCategoryValues,
    },

    status: {
      type: String,
      enum: ["live", "closed"],
      default: "live",
    },

    dueDate: {
      type: Date,
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
  },
  { timestamps: true } //createdAt = Date Posted
);

const jobListModel=
  mongoose.models.Job || mongoose.model("Job", JobSchema);

export default jobListModel;
