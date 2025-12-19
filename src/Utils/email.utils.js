import nodemailer from "nodemailer";
import { createTransporter } from "../Config/nodemailer.config.js";
import { welcomeEmailTemplate , passwordResetEmail } from "./emailTemplates.utils.js"

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: {
        name: "Hob Huntly",
        address: process.env.EMAIL,
      },
      to,
      subject,
      html,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log("email sent", info.messageId ?? "");
    return info;
  } catch (error) {
    console.error("error sending email", error);
    // keep original behavior (don't rethrow by default), but you may want to throw for upstream handling:
    // throw error;
    return null;
  }
};





export const sendWelcomeEmail = async (username, email) => {
  const subject = "welcome to Hob Huntly";
  const html = welcomeEmailTemplate(username);
  return sendEmail(email, subject, html);
};










export const sendResetEmail = async (email, username, resetToken) => {
  const subject = "Reset password";
  const html = passwordResetEmail(username, resetToken);
  return sendEmail(email, subject, html);
};
