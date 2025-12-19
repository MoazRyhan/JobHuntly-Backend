// src/shared/utils/jwtTokens.js
import jwt from "jsonwebtoken";

export const generateAccessToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
    { expiresIn: process.env.EXPIRATION_DATA_ACCESS_TOKEN }
  );
};

export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
    { expiresIn: process.env.EXPIRATION_DATA_REFRESH_TOKEN }
  );
};

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET_KEY);
  } catch (error) {
    // keep same behavior as original (throw generic Error)
    throw new Error("Invalid access token");
  }
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET_KEY);
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
};
