// server/utils/emailSender.js
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

// Initialize Resend with your API key from environment variable
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send email using Resend API
 */
export const sendEmail = async (to, subject, body) => {
  try {
    const response = await resend.emails.send({
      from: "Tenantix Team <onboarding@resend.dev>",
      to: email,
      subject,
      html: body,
    });

    console.log("✅ Email sent:", response);
    return response;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
};
