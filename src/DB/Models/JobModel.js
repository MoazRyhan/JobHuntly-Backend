// models/Job.js
import mongoose from 'mongoose'
import CompanyModel from './CompanyModel.js'
import {
  QUESTION_TYPE,
  jobCategoryValues,
  jobEmploymentTypeValues,
  JOB_BENEFITS,
} from '../../Constants/constants.js'

const JobSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    title: { type: String, required: true },

    employmentTypes: {
      type: [String],
      required: true,
      enum: jobEmploymentTypeValues,
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
    dueDate: { type: Date },
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

    // questions embedded
    // Mongoose adds an _id to these objects automatically.
    // We will use that _id to map answers to questions safely in 'Job Application Schema'.
    questions: [
      {
        questionText: { type: String, required: true },
        type: {
          type: String,
          enum: Object.values(QUESTION_TYPE),
          default: QUESTION_TYPE.TEXT,
        },
      },
    ],

    // benefits: {
    //   type: JOB_BENEFITS,
    //   default: [],
    // },
  },
  { timestamps: true }
)

const JobModel = mongoose.models.Job || mongoose.model('Job', JobSchema)
export default JobModel
