import nodemailer from "nodemailer";

export const createTransporter = () => {
  console.log("creating transporter");

  return nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
};
