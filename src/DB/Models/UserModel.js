import mongoose from "mongoose";
import { SYSTEM_ROLE } from "../../Constants/constants.js";

const UserSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ["user", "company"], required: true },
  refreshToken: { type: String, select: false },
  avatar: String,
});


const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);
export default UserModel;
