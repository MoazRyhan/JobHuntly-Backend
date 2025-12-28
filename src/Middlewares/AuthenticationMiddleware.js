import UserModel from "../../../DB/Models/UserModel.js";  
import ApiError from "../../../Utils/ApiError.utils.js";
import { generateAccessToken  ,  generateRefreshToken,  verifyRefreshToken, } from "./../../../Utils/tokens.utils.js";
import { sendWelcomeEmail } from "./../../../Utils/email.utils.js"
import bcrypt ,{ compareSync, hashSync } from "bcrypt";
import { SYSTEM_ROLE } from "../../../Constants/constants.js";
import JobSeekerModel from "../../../DB/Models/JobSeekerModel.js";
import CompanyModel from "../../../DB/Models/CompanyModel.js";
import AdminModel from './../../../DB/Models/AdminModel.js';


export const register = async (userData) => {
  const {
    fullName, // optional (for company) this is acn be the company name or the jobSeeker name 
    email,
    password,
    rePassword,
    role, 
  } = userData;

  /* ================= VALIDATION ================= */
  if (password !== rePassword) {
    throw new ApiError(400, "Password and rePassword must match");
  }

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "Email already exists");
  }

    /* ================= CREATE USER ================= */
    const hashedPassword = hashSync(
      password,
      Number(process.env.PASSWORD_SALT)
    );

    const user = await UserModel.create(
        {
          fullName,
          email,
          password: hashedPassword,
          role,
        }
    );

    if (!user) {
    throw new ApiError(400, "failed to create a user");
  }

    /* ================= CREATE ROLE-BASED PROFILE ================= */

  if (role === SYSTEM_ROLE.JOB_SEEKER) {
    await JobSeekerModel.create({
      userId: user._id,
    });
  }

  if (role === SYSTEM_ROLE.COMPANY) {
    await CompanyModel.create({
      userId: user._id,
      name: fullName,
    });
  }

  if (role === SYSTEM_ROLE.ADMIN) {
    throw new ApiError(400, "access deny for creating admin");
  }

    /* ================= TOKENS ================= */
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();



    /* ================= EMAIL ================= */
     await sendWelcomeEmail(user.fullName, user.email);

  return {
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};






export const login = async (email, password) => {
  /* ================= FIND USER ================= */
  const user = await UserModel.findOne({ email }).select(
    "+password +refreshToken"
  );

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  /* ================= CHECK PASSWORD ================= */
  const isPasswordCorrect = bcrypt.compareSync(password, user.password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid email or password");
  }

  /* ================= GENERATE TOKENS ================= */
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  user.lastLoginAt = new Date();
  await user.save();

  /* ================= ROLE-BASED PROFILE ================= */
  let profile = null;

  if (user.role === SYSTEM_ROLE.JOB_SEEKER) {
    profile = await JobSeekerModel.findOne({ userId: user._id });
    if (!profile) {
      throw new ApiError(404, "Job seeker profile not found");
    }
  }

  if (user.role === SYSTEM_ROLE.COMPANY) {
    profile = await CompanyModel.findOne({ userId: user._id });
    if (!profile) {
      throw new ApiError(404, "Company profile not found");
    }
  }

  if (user.role === SYSTEM_ROLE.ADMIN) {
    profile = await AdminModel.findOne({ userId: user._id });
    if (!profile) {
      throw new ApiError(404, "Admin profile not found");
    }
  }

  /* ================= RESPONSE ================= */
  return {
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
    },
    profile, // JobSeeker | Company | (Admin)
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






























//==================================================== 


export const registerAdmin = async (userData) => {
  const { fullName, email, password, rePassword } = userData;

  /* ================= VALIDATION ================= */
  if (password !== rePassword) {
    throw new ApiError(400, "Password and rePassword must match");
  }

  /* ================= CHECK IF ADMIN EXISTS ================= */
  const adminExists = await UserModel.findOne({
    role: SYSTEM_ROLE.ADMIN,
  });

  if (adminExists) {
    throw new ApiError(403, "Admin already exists");
  }

  /* ================= CHECK EMAIL ================= */
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "Email already exists");
  }

  /* ================= CREATE ADMIN ================= */
  const hashedPassword = bcrypt.hashSync(
    password,
    Number(process.env.PASSWORD_SALT)
  );

  const admin = await UserModel.create({
    fullName,
    email,
    password: hashedPassword,
    role: SYSTEM_ROLE.ADMIN,
  });

  if (!admin) {
    throw new ApiError(400, "Failed to create admin");
  }

  if (admin.role === SYSTEM_ROLE.ADMIN) {
    await AdminModel.create({
      userId: admin._id,
    });
  }


  /* ================= TOKENS ================= */
  const accessToken = generateAccessToken(admin._id);
  const refreshToken = generateRefreshToken(admin._id);

  admin.refreshToken = refreshToken;
  await admin.save();

  return {
    message: "Admin created successfully",
    admin: {
      id: admin._id,
      fullName: admin.fullName,
      email: admin.email,
      role: admin.role,
    },
    accessToken,
    refreshToken,
  };
};