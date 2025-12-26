import { asyncHandler } from "../../../Utils/asyncHandler.utils.js";
import * as authService from "../services/auth.service.js";

export const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json({ success: true, data: result });
});






export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  res.status(200).json({ success: true, data: result });
});







export const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  console.log(req.headers);
  
  const result = await authService.refreshAccessToken(refreshToken);
  res.status(200).json({ success: true, data: result });
});
