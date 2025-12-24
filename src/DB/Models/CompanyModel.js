import mongoose from "mongoose";
import { COMPANY_LINK_TYPE } from "../../Constants/constants.js";

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
    links: [
    {
      type: {
        type: String,
        enum: Object.values(COMPANY_LINK_TYPE),
      },
      value: String,
    },https://github.com/MoazRyhan/JobHuntly-Backend/pull/10/conflict?name=src%252FDB%252FModels%252FCompanyModel.js&ancestor_oid=1e57546b844405cc3da3d734c3c956bc42ad494d&base_oid=c065412dd5ae66d321fcce150931aa12870c5b61&head_oid=841593ac69a968371d327b2f8dba6bd5e426d26a
    ],

    /* ================= TECH STACK ================= */
    techStack: [
      {
        name: { type: String, required: true },
        logo:  { type: String , enum: Object.values(TECH_STACK),},
    }
    ],

  },
  { timestamps: true }
)

const CompanyModel =
  mongoose.models.Company || mongoose.model('Company', CompanySchema)

export default CompanyModel
