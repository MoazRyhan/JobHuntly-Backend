import { asyncHandler } from "../../../Utils/asyncHandler.utils.js";
import * as SettingsApplicantService from "../services/SettingsApplicant.service.js";
import * as SettingsRecruiterService from "../services/SettingsRecruiter.service.js";



// ==============================      applicant
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

export const getSkills = asyncHandler(async (req, res) => {
  const userId = req.login_user._id

  const result = await SettingsApplicantService.getSkills(userId)
  res.status(200).json({
    success: true,
    data: result,
  })
})



// ==============================      Recruiter 


export const updateCompanyProfile = asyncHandler(async (req, res) => {
  const userId = req.login_user._id;
  const data = req.body;

  const result = await SettingsRecruiterService.updateCompanyProfile(
    userId,
    data
  );

  res.status(200).json({
    success: true,
    data: result,
  });
});


export const getCompanyProfile = asyncHandler(async (req, res) => {
  const userId = req.login_user._id;

  const result = await SettingsRecruiterService.getCompanyProfile(userId);

  res.status(200).json({
    success: true,
    data: result,
  });
});



/* ================= Company images ================= */
export const uploadCompanyImages = asyncHandler(async (req, res) => {
  // console.log( req );
  
  const result = await SettingsRecruiterService.uploadCompanyImages({
    files: req.files,
    req,
    role :req.login_user.role,
    userId : req.login_user._id
  })

  res.status(200).json({
    success: true,
    ...result,
  })
})

export const deleteCompanyImage = async (req, res, next) => {

    const { imageUrl } = req.body
    const { _id: userId, role } = req.login_user

    const result = await SettingsRecruiterService.removeCompanyImage({
      imageUrl,
      role,
      userId,
    })

    res.status(200).json({
      success: true,
      ...result,
    })
}



//   ========================= for all


/* ================= LOGO ================= */
export const uploadLogo = asyncHandler(async (req, res) => {
  const result = await SettingsApplicantService.uploadImage({
    file: req.file,
    req ,
    role :req.login_user.role,
    folder: "logo",
    userId : req.login_user._id
  })

  

  res.status(200).json({
    success: true,
    ...result,
  })
})



/* ================= BACKGROUND ================= */
export const uploadBackground = asyncHandler(async (req, res) => {
  // console.log( req );
  
  const result = await SettingsApplicantService.uploadImage({
    file: req.file,
    req,
    role :req.login_user.role,
    folder: "background",
    userId : req.login_user._id
  })

  res.status(200).json({
    success: true,
    ...result,
  })
})




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






