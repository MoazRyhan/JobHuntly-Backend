import { forgotPasswordService,resetPasswordService } from "../services/forgotPassword.service.js";

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await forgotPasswordService(email);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const result = await resetPasswordService(token, newPassword);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
