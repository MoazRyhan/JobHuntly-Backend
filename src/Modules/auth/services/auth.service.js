import UserModel from "../../../DB/Models/UserModel.js";  
import ApiError from "../../../Utils/ApiError.utils.js";
import { generateAccessToken  ,  generateRefreshToken,  verifyRefreshToken, } from "./../../../Utils/tokens.utils.js";
import { sendWelcomeEmail } from "./../../../Utils/email.utils.js"
import bcrypt from "bcrypt";

export const register= async (userData) => {
  let user;
  try {
    const {
      userName,
      companyName,
      email,
      password,
      confirmPassword,
      role,
    } = userData;

    if (!role) {
      throw new ApiError(400, "Role is required");
    }

    if (password !== confirmPassword) {
      throw new ApiError(400, "Passwords do not match");
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, "Email already exists");
    }

    const passwordHashed = bcrypt.hashSync(
      password,
      Number(process.env.PASSWORD_SALT)
    );

    const name =
      role === "user"
        ? userName
        : role === "company"
        ? companyName
        : null;

    if (!name) {
      throw new ApiError(400, "Name is required");
    }

    user = await UserModel.create({
      userName: name,
      email,
      password: passwordHashed,
      role,
    });

    // const accessToken = generateAccessToken(user._id, user.role);
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    return {
      user: {
        id: user._id,
        name: user.userName,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  } catch (error) {
    if (user?._id) {
      await UserModel.findByIdAndDelete(user._id);
    }
    throw error;
  }
};



export const login = async (email, password) => {
  const user = await UserModel.findOne({email}).select("+password +refreshToken");

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const passwordMatch = bcrypt.compareSync(password, user.password);
  if (!passwordMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  // const accessToken = generateAccessToken(user._id,user.role);
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  return {
    user: {
      id: user._id,
      name: user.userName,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
    accessToken,
    refreshToken,
  };
};



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
