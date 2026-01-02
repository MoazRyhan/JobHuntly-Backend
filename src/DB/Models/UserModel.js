import mongoose from "mongoose";
import { SYSTEM_ROLE } from "../../Constants/constants.js";

const UserSchema = new mongoose.Schema(
  {
    fullName: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(SYSTEM_ROLE) , required: true  },
    phone: String,
    avatarUrl: String,
    isActive: { type: Boolean, default: true },
    lastLoginAt: Date,
    refreshToken: { type: String, select: false},
    BackGroundUrl: String,
    // used for forgot-password flow
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },

  },
  { timestamps: true }
);

const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);
export default UserModel;
