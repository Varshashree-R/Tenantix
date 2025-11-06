import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

// ✅ Initialize SendGrid with API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Send email using SendGrid API
 */
export const sendEmail = async (to, subject, body) => {
  try {
    const msg = {
      to: to,  // ✅ use function argument
      from: process.env.SENDGRID_FROM,  // ✅ verified sender
      subject,
      html: body,
    };

    const response = await sgMail.send(msg);

    console.log("✅ Email sent successfully:", response[0].statusCode);
  } catch (error) {
    console.error("❌ Error sending email:", error.response?.body || error);
  }
};
