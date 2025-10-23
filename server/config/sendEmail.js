import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Send an email using Gmail via Nodemailer
 * @param {Object} params
 * @param {string} params.sendTo - Recipient email
 * @param {string} params.subject - Email subject
 * @param {string} params.html - HTML content of the email
 */
const sendEmail = async ({ sendTo, subject, html }) => {
  try {
    // Create SMTP transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // Email options
    const mailOptions = {
      from: `"pakiza" <${process.env.GMAIL_USER}>`,
      to: sendTo,
      subject: subject,
      html: html,
    };
    console.log('Sending email to:', mailOptions);
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
};

export default sendEmail;
