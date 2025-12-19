import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    canManageCompanies: { type: Boolean, default: true },
    canManageJobSeekers: { type: Boolean, default: true },
    canManageJobs: { type: Boolean, default: true },
    canViewAnalytics: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const AdminModel =
  mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

export default AdminModel;
