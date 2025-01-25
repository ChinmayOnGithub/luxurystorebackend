// Import nodemailer
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Create a transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // Replace with your email provider's SMTP server
  port: 465, // Use 465 for secure connections
  secure: true, // Use TLS
  auth: {
    user: `${process.env.SENDER_MAIN_SMTP}`, // Replace with your email
    pass: `${process.env.APP_PASSWORD_MAIL}` // Replace with your email password or app password
  }
});

// Function to send email using nodemailer
export const sendEmail = async (recipientEmail, otp) => {
  try {
    const mailOptions = {
      from: 'avatarpatil009@gmail.com', // Replace with your email
      to: recipientEmail,
      subject: 'Your OTP Verification Code',
      text: `Your OTP is: ${otp}`,
      html: `<p>Your OTP is: <b>${otp}</b></p>`
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, message: 'OTP sent successfully', info: info.response };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: error.message };
  }
};


