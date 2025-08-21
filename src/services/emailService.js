import transporter from '../config/nodemailer.js';
import jwt from 'jsonwebtoken';

class EmailService {
  // Generate OTP code
  static generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Send OTP email
  static async sendOTP(email, fullName, otpCode) {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Email Verification - Community Learning Platform',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Hello ${fullName}!</h2>
          <p>Thank you for registering with our Community Learning Platform.</p>
          <p>Your verification code is:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #007bff; font-size: 32px; margin: 0; letter-spacing: 5px;">${otpCode}</h1>
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this verification, please ignore this email.</p>
          <br>
          <p>Best regards,<br>Community Learning Platform Team</p>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`OTP sent to ${email} and this is your OTP: ${otpCode}`);
      return true;
    } catch (error) {
      console.log(error)
      return false;
    }
  }

  // Send password reset email
  static async sendPasswordReset(email, fullName, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Password Reset Request - Community Learning Platform',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Hello ${fullName}!</h2>
          <p>You requested a password reset for your Community Learning Platform account.</p>
          <p>Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          </div>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #007bff;">${resetUrl}</p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this reset, please ignore this email.</p>
          <br>
          <p>Best regards,<br>Community Learning Platform Team</p>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
          console.log(`OTP sent to ${email}`);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Send welcome email after OTP verification
  static async sendWelcomeEmail(email, fullName) {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Welcome to Community Learning Platform!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome ${fullName}!</h2>
          <p>Your email has been successfully verified!</p>
          <p>You can now:</p>
          <ul>
            <li>Create your learning profile</li>
            <li>Share your learning projects</li>
            <li>Showcase your skills and knowledge</li>
            <li>Connect with other learners and mentors</li>
          </ul>
          <p>Get started by logging into your account!</p>
          <br>
          <p>Best regards,<br>Community Learning Platform Team</p>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default EmailService;