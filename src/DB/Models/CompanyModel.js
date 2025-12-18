import mongoose from "mongoose";
import { COMPANY_LINK_TYPE } from "../../Constants/constants.js";

const CompanySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    website: String,
    industry: String,
    foundedDate: Date,
    employeesRange: String,
    about: String,
    logoUrl: String,

    countries: [{ code: String, name: String }],
    links: [{ type: String, enum: Object.values(COMPANY_LINK_TYPE) }],
    
    // techStack now includes optional logo for frontend
    techStack: [
      {
        name: String,
        logo: String, // optional
      }
    ],

    images: [
      {
        src: String,
      }
    ],
  },
  { timestamps: true }
);

const CompanyModel =
  mongoose.models.Company || mongoose.model("Company", CompanySchema);

export default CompanyModel;

