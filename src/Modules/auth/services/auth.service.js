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


// export const register = async (userData) => {
//   let user;

//   try {
//     const { fullName, email, password, rePassword } = userData;

//     if (password !== rePassword)
//       throw new ApiError(401, "Passwords do not match");

//     const existingUser = await UserModel.findOne({ email });
//     if (existingUser)
//       throw new ApiError(400, "Email already exists");

//     const password_hashed = hashSync(password, +process.env.PASSWORD_SALT);

//     user = await UserModel.create({
//       fullName,
//       email,
//       password: password_hashed,
//     });

//     const accessToken = generateAccessToken(user._id);
//     const refreshToken = generateRefreshToken(user._id);

//     user.refreshToken = refreshToken;
//     await user.save();

//     return {
//       user: {
//         id: user._id,
//         fullName: user.fullName,
//         email: user.email,
//       },
//       accessToken,
//       refreshToken,
//     };
//   } catch (error) {
//     if (user?._id) {
//       await UserModel.findByIdAndDelete(user._id);
//     }
//     throw error;
//   }
// };






export const login =  async (email, password) => {
  const user = await UserModel.findOne({ email }).select("+password +refreshToken");

  if (!user) throw new ApiError(401, "Invalid email or password");

  //check the password
  const if_pass_right = bcrypt.compareSync( password , user.password )    
  if ( !if_pass_right )  throw new ApiError(401, "email or password is wrong");

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  return {
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      avatar: user.avatar,
    },
    accessToken,
    refreshToken,
  };
}







export const refreshAccessToken =  async (refreshToken) => {
  if (!refreshToken) throw new ApiError(401, "Refresh token is required");

  try {
    const decoded = verifyRefreshToken(refreshToken);

    const user = await UserModel.findById(decoded.userId).select("+refreshToken");

    if (!user || user.refreshToken !== refreshToken) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const newAccessToken = generateAccessToken(user._id);

    return { accessToken: newAccessToken };
  } catch (error) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }
}
