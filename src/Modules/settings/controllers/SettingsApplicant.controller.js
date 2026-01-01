import { asyncHandler } from "../../../Utils/asyncHandler.utils.js";
import * as SettingsApplicantService from "../services/SettingsApplicant.service.js";




export const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.login_user._id
  const data = req.body
    // ⬅️ الملف جاي من multer
  if (req.file) {
    data.resumeUrl = `/Assets/resumes/${req.file.filename}`;
  }

  const result = await SettingsApplicantService.updateProfile(userId , data );
  res.status(201).json({ success: true, data: result });
});


export const getProfile = asyncHandler(async (req, res) => {
  const result = await SettingsApplicantService.getProfile(req.body);
  res.status(201).json({ success: true, data: result });
});

