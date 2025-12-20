import mongoose from "mongoose";
import {
  COMPANY_LINK_TYPE,
  COMPANY_INDUSTRIES,
  TECH_STACK,
} from "../../Constants/constants.js";

const CompanySchema = new mongoose.Schema(
  {
    /* ================= BASIC INFO ================= */
    name: { type: String, required: true },

    industry:  {Type : String , enum: Object.values(COMPANY_INDUSTRIES)},

    website: String,
    foundedDate: Date,
    employeesRange: String,
    about: String,
    logoUrl: String,

//     countries: [{ code: String, name: String }],
    //links: [{ type: String, enum: Object.values(COMPANY_LINK_TYPE) }],
    
//     techStack: [
//       {
//         name: String,
//         logo: String, 
//       }
//     ],

    images: [
      {
        src: String,
      }

    hqCity: String,
    hqCountry: String,

    isVerified: {
      type: Boolean,
      default: false,
    },

    /* ================= OFFICE LOCATIONS ================= */
    officeLocations: [
      {
        country: String,
        isHeadQuarter: {
          type: Boolean,
          default: false,
        },
        isRemote: {
          type: Boolean,
          default: false,
        },
      },
    ],

    /* ================= CONTACT / SOCIAL LINKS ================= */
    links: [
      {
        type: {
          type: String,
          enum: Object.values(COMPANY_LINK_TYPE),
        },
        value: String,
      },
    ],

    /* ================= TECH STACK ================= */
    techStack: [
      {
        name: {
          type: String,
          enum: Object.values(TECH_STACK)
        },
      },
    ],
  },
  { timestamps: true }
);

const CompanyModel =
  mongoose.models.Company || mongoose.model("Company", CompanySchema);

export default CompanyModel;

