import UserModel from "../../../DB/Models/UserModel.js";  
import ApiError from "../../../Utils/ApiError.utils.js";
import { sendWelcomeEmail } from "./../../../Utils/email.utils.js"
import bcrypt ,{ compareSync, hashSync } from "bcrypt";


export const updataProfile = async (userData) => {
  const { fullName, email, password , rePassword } = userData;

  return {
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      avatar: user.avatarUrl,
    },
    accessToken,
    refreshToken,
  };
};





