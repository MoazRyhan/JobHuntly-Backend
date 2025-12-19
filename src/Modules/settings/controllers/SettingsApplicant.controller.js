import { asyncHandler } from "../../../Utils/asyncHandler.utils.js";
import * as authService from "../services/auth.service.js";




export const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json({ success: true, data: result });
});

