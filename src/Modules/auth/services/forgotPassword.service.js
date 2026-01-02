import crypto from 'crypto';
import UserModel from "../../../DB/Models/UserModel.js";  
import { sendResetEmail } from "../../../Utils/email.utils.js";
import bcrypt from "bcrypt";

export const forgotPasswordService = async (email) => {
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

const resetToken = crypto.randomBytes(32).toString("hex");

user.resetToken = resetToken;
user.resetTokenExpiry = Date.now() + 1000 * 60 * 60;

  await user.save();

  await sendResetEmail(user.email, user.fullName, resetToken);
  return { message: "Reset password email sent" };

}

export const resetPasswordService = async (resetToken, newPassword) => {
  const user = await UserModel.findOne({
    resetToken,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error("Invalid or expired reset token");
  }

  const hashedPassword = bcrypt.hashSync(newPassword, 10);

  user.password = hashedPassword;
  user.resetToken = null;
  user.resetTokenExpiry = null;

  await user.save();

  return { message: "Password reset successfully" };
};