// src/controllers/otp.controller.js

import { OTP } from '../models/otp.model.js';
import { Admin } from '../models/admin.model.js';
import otpGenerator from 'otp-generator';
import { sendEmail } from '../utils/email.util.js'; // Import the email utility function

// Generate OTP and send Email
export const generateOTP = async (req, res) => {
  const { email } = req.body;

  try {
    // Validate email input
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // Trim the email
    const trimmedEmail = email.trim();

    // Check if the email is registered
    const admin = await Admin.findOne({ email: trimmedEmail }).exec();
    if (!admin) {
      return res.status(403).json({ success: false, message: 'Email not registered as admin' });
    }

    // Generate a 6-digit OTP
    const otp = otpGenerator.generate(4, { digits: true, alphabets: false, upperCase: false, specialChars: false });

    // Save OTP in the database
    const otpRecord = new OTP({ email: trimmedEmail, otp });
    await otpRecord.save();

    // Send OTP via Email
    const emailResponse = await sendEmail(trimmedEmail, otp);
    if (emailResponse.success) {
      return res.status(200).json({ success: true, message: 'OTP sent successfully', emailResponse });
    } else {
      return res.status(500).json({ success: false, message: `Failed to send OTP: ${emailResponse.message}` });
    }
  } catch (error) {
    console.error('Error in generateOTP:', error.message);
    return res.status(500).json({ success: false, message: 'An error occurred while generating OTP', error: error.message });
  }
};

// Verify OTP
import jwt from 'jsonwebtoken';
const ACCESS_TOKEN_SECRET = 'your-access-token-secret'; // Secret for signing tokens

// Function to generate access token
const generateAccessToken = (user) => {
  const payload = {
    email: user.email, // or other identifying details
    role: 'user', // Assign role or permissions, adjust as needed
  };

  // Generate the token, expires in 1 hour
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
};

// OTP Verification and Token Generation
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Check if OTP is valid
    const otpRecord = await OTP.findOne({ email, otp }).exec();

    if (otpRecord) {
      // OTP verified successfully, delete the OTP record
      await OTP.deleteOne({ email, otp }).exec();

      // Generate Access Token
      const accessToken = generateAccessToken({ email });

      // Store Access Token in cookies
      res.cookie('accessToken', accessToken, {
        httpOnly: true,     // Secure cookie, can't be accessed via JavaScript
        secure: true,       // Ensure the cookie is sent over HTTPS
        maxAge: 3600000,    // Token expiration time (1 hour)
        sameSite: 'strict', // Cookie security
      });

      // Respond with success message and token in cookies
      res.status(200).json({
        success: true,
        message: 'OTP verified successfully, access token set in cookies',
        accessToken
      });
    } else {
      // Invalid OTP
      res.status(400).json({
        success: false,
        message: 'Invalid OTP',
      });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error verifying OTP',
      error: error.message,
    });
  }
};
