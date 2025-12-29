// utils/sendEmail.js
import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // e.g., smtp.gmail.com
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER, // your email
        pass: process.env.SMTP_PASS, // your email password or app password
      },
    });

    const info = await transporter.sendMail({
      from: `"Company XYZ" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log('Email sent: ', info.messageId);
  } catch (error) {
    console.error('Error sending email: ', error);
  }
};
