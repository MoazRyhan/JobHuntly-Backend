import UserModel from "../../../DB/Models/UserModel.js";  
import ApiError from "../../../Utils/ApiError.utils.js";
import { generateAccessToken  ,  generateRefreshToken,  verifyRefreshToken, } from "./../../../Utils/tokens.utils.js";
import { sendWelcomeEmail } from "./../../../Utils/email.utils.js"
import bcrypt ,{ compareSync, hashSync } from "bcrypt";


export const register = async (userData) => {
  const { fullName, email, password , rePassword } = userData;

  if (password !== rePassword ) throw new ApiError(401, "the password and ans the rePassword must be identical") 


  const existingUser = await UserModel.findOne({ $or: [{ email }, { fullName }] });

  if (existingUser) {
    if (existingUser.email === email) {
      throw new ApiError(400, "Email already exists");
    }
    if (existingUser.fullName === fullName) {
      throw new ApiError(400, "fullName already exists");
    }
  }

    // hash the password
    const password_hashed =  hashSync(password , +process.env.PASSWORD_SALT )


  const user = await UserModel.create({ fullName, email, password :password_hashed  });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  await sendWelcomeEmail(user.fullName, user.email);

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





