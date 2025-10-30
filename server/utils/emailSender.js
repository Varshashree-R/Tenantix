// server/utils/emailSender.js
import dotenv from "dotenv";
dotenv.config(); // make sure env variables are loaded

import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // Gmail SMTP
      port: 587,              // STARTTLS
      secure: false,          // false for STARTTLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log("Using SMTP host:", transporter.options.host);

    await transporter.sendMail({
      from: `"Tenantix" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("Email sent successfully to", to);
  } catch (err) {
    console.error("Error sending email:", err);
    throw err; // rethrow so calling code knows it failed
  }
};
