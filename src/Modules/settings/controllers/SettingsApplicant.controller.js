import { asyncHandler } from "../../../Utils/asyncHandler.utils.js";
import * as SettingsApplicantService from "../services/SettingsApplicant.service.js";




export const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.login_user._id
  const data = req.body
  const result = await SettingsApplicantService.updateProfile(userId , data );
  res.status(201).json({ success: true, data: result });
});


export const getProfile = asyncHandler(async (req, res) => {
  const userId = req.login_user._id
  
  const result = await SettingsApplicantService.getProfile(userId);
  res.status(201).json({ success: true, data: result });
});


export const changeEmail = asyncHandler(async (req, res) => {
  const userId = req.login_user._id
  const result = await SettingsApplicantService.changeEmail(userId, req.body)

  res.status(200).json({
    success: true,
    message: "Email updated successfully",
    data: result,
  })
})


export const resetPassword = asyncHandler(async (req, res) => {
  const userId = req.login_user._id
  const result = await SettingsApplicantService.resetPassword(userId, req.body)

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
    data: result,
  })
})


export const deleteAccount = asyncHandler(async (req, res) => {
  const userId = req.login_user._id
  const role = req.login_user.role

  const result = await SettingsApplicantService.deleteAccount(userId, role, req.body.password)

  res.status(200).json({
    success: true,
    message: "Account deleted successfully",
    data: result,
  })
})




