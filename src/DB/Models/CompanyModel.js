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
    hqCity: String,
    hqCountry: String,
    isVerified: { type: Boolean, default: false },

    countries: [{ code: String, name: String }],
    links: [{ type: String,  enum: Object.values(COMPANY_LINK_TYPE ) }],
    techStack: [{ name: String }],
  },
  { timestamps: true }
);

const CompanyModel =
  mongoose.models.Company || mongoose.model("Company", CompanySchema);

export default CompanyModel;
