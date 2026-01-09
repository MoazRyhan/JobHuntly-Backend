import mongoose from "mongoose";
import { COMPANY_INDUSTRIES, COMPANY_LINK_TYPE, TECH_STACK } from "../../Constants/constants.js";

const CompanySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    /* ================= BASIC INFO ================= */
    name: { type: String, required: true },

    industry: { type: String, enum: Object.values(COMPANY_INDUSTRIES) },

    website: String,
    foundedDate: Date,
    employeesRange: String,
    about: String,
    logoUrl: String,
    backGroundUrl: String,
        
    hqCity: String,
    hqCountry: String,
    
    isVerified: {
      type: Boolean,
      default: false,
    },

    /* ================= IMAGES GALLERY ================= */
    images: [
        {
            src: String,
          },
        ],
        
    /* ================= OFFICE LOCATIONS ================= */

    countries: [{ code: String, name: String }],
        
    /* ================= CONTACT / SOCIAL LINKS ================= */
    socialLinks: {
      linkedin: String,
      twitter: String,
      instagram: String,
      website: String,
      github: String,
    },


    /* ================= TECH STACK ================= */
    techStack: [
      {
        name: { type: String, required: true },
        logo:  { type: String , enum: Object.values(TECH_STACK)},
    }
    ],

  },
  { timestamps: true }
)

const CompanyModel =
  mongoose.models.Company || mongoose.model('Company', CompanySchema)

export default CompanyModel
