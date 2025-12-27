import mongoose from "mongoose";
import {
  jobEmploymentTypeValues,
  jobCategoryValues,
} from "../../Constants/constants.js";
// import { string } from "joi";


const JobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true, // role col
      trim: true,
    },

    // jobType: {
    //   type: String,
    //   enum: jobEmploymentTypeValues,
    //   required: true,
    // },
    jobType: String,

    category: {
      type: String,
      enum: jobCategoryValues,
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
