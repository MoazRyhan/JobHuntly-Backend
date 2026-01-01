import mongoose from "mongoose";
import { QUESTION_TYPE, jobCategoryValues, jobEmploymentTypeValues, JOB_BENEFITS, jobWorkplaceModelValues } from "../../Constants/constants.js";

const JobSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    title: { type: String, required: true },

    employmentType: {
      type: String,
      required: true,
      enum: jobEmploymentTypeValues,
    },

    workplaceModel: {
      type: String,
      required: true,
      enum: jobWorkplaceModelValues
    },

    salaryMin: {
      type: Number,
      required: true,
    },
    salaryMax: {
      type: Number,
      required: true,
    },
    salaryCurrency: {
      type: String,
      required: true,
    },

    postDate: { type: Date, default: Date.now },
    dueDate: {
      type: Date,
      validate: {
        validator: function (value) {
          if (!value) return true;

          // Ensure dueDate is after postDate
          return (value > this.postDate);
        },
        message: 'Due date must be after the post date'
      }
    },
    isLive: {
      type: Boolean,
      default: true,
    },

    description: {
      type: String,
      required: true,
    },
    responsibilities: {
      type: [String],
      required: true,
    },
    whoYouAre: {
      type: [String],
      required: true,
    },
    niceToHaves: {
      type: [String],
      required: true,
    },

    categories: {
      type: [String],
      required: true,
      enum: jobCategoryValues,
    },

    skillsIds: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Skill',
        },
      ],
      required: true,
    },


    benefits: {
      type: [
        {
          id: Number,
          icon: String,
          title: String,
          description: String
        }
      ],
      default: []
    },

    // questions embedded 
    // Mongoose adds an _id to these objects automatically. 
    // We will use that _id to map answers to questions safely in 'Job Application Schema'.
    questions:
    {
      type: [
        {
          questionText: { type: String, required: true },
          type: {
            type: String,
            enum: Object.values(QUESTION_TYPE),
            default: QUESTION_TYPE.TEXT,
          },
        }
      ],
      default: []
    },



  },
  { timestamps: true }
)

const JobModel = mongoose.models.Job || mongoose.model('Job', JobSchema)
export default JobModel
