import { asyncHandler } from "../../../Utils/asyncHandler.utils.js";
import * as SettingsApplicantService from "../services/SettingsApplicant.service.js";




export const updateProfile = asyncHandler(async (req, res) => {
  const result = await SettingsApplicantService.updateProfile(req.body);
  res.status(201).json({ success: true, data: result });
});


export const getProfile = asyncHandler(async (req, res) => {
  const result = await SettingsApplicantService.getProfile(req.body);
  res.status(201).json({ success: true, data: result });
});

