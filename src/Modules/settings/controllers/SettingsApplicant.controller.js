import { asyncHandler } from "../../../Utils/asyncHandler.utils.js";
import * as SettingsApplicantService from "../services/SettingsApplicant.service.js";




export const updataProfile = asyncHandler(async (req, res) => {
  const result = await SettingsApplicantService.updataProfile(req.body);
  res.status(201).json({ success: true, data: result });
});

