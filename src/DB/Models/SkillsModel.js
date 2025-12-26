import mongoose from "mongoose";
import { SKILL_LEVEL } from "../../Constants/constants";

const SkillSchema = new mongoose.Schema(
  {
    seekerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, //OR
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company"}, //OR
    name: { type: String, required: true, unique: true },
    level: {Type : String , enum: Object.values(SKILL_LEVEL), default: SKILL_LEVEL.BEGINNER },
  },
  { timestamps: true }
);

const SkillModel =
  mongoose.models.Skill || mongoose.model("Skill", SkillSchema);

export default SkillModel;
