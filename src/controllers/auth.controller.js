import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Otp from '../models/Otp.js';
import EmailService from '../services/emailService.js';
import {
  ServerError,
  ValidationErrorResponse,
  ClientError,
  AuthError,
  ResourceNotFound,
  SuccessResponse,
  CreatedResponse
} from '../utils/helperFunctions.js';

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// @desc    Register user
// @route   POST /auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    console.log("REQ.BODY:", req.body);

    // Validate required fields
    if (!fullName || !fullName.trim()) {
      return ClientError(res, 'Full name is required');
    }

    if (!email || !email.trim()) {
      return ClientError(res, 'Email is required');
    }

    if (!password || password.length < 6) {
      return ClientError(res, 'Password must be at least 6 characters long');
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return ClientError(res, 'User already exists with this email');
    }

    // Create user (unverified)
    const user = await User.create({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      password
    });

    // Generate OTP
    const otpCode = EmailService.generateOTP();

    // Create OTP record
    const otpRecord = await Otp.create({
      userId: user._id,
      code: otpCode
    });

    // Send OTP email
    await EmailService.sendOTP(email, fullName, otpCode);

    return CreatedResponse(res, 'Registration successful. Please check your email for verification code.', { userId: user._id });
  } catch (error) {
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = {};
      Object.keys(error.errors).forEach(key => {
        validationErrors[key] = error.errors[key].message;
      });
      return ValidationErrorResponse(res, validationErrors);
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return ClientError(res, 'User already exists with this email');
    }

    return ServerError(res, 'Server error during registration');
  }
};

// @desc    Verify OTP
// @route   POST /auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validate required fields
    if (!email || !otp) {
      return ClientError(res, 'Email and OTP are required');
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return ResourceNotFound(res, 'User');
    }

    // Clean up expired OTPs
    await Otp.cleanupExpired();

    // Find OTP
    const otpRecord = await Otp.findOne({
      userId: user._id,
      code: otp
    });

    if (!otpRecord) {
      return ClientError(res, 'Invalid or expired OTP code');
    }

    // Mark user as verified
    await User.findByIdAndUpdate(user._id, { isVerified: true });

    // Delete OTP
    await Otp.findByIdAndDelete(otpRecord._id);

    // Send welcome email
    await EmailService.sendWelcomeEmail(user.email, user.fullName);

    return SuccessResponse(res, 'Email verified successfully! You can now login.');
  } catch (error) {
    return ServerError(res, 'Server error during OTP verification');
  }
};

// @desc    Resend OTP
// @route   POST /auth/resend-otp
// @access  Public
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate required fields
    if (!email) {
      return ClientError(res, 'Email is required');
    }

    const user = await User.findOne({ email });
    if (!user) {
      return ResourceNotFound(res, 'User');
    }

    if (user.isVerified) {
      return ClientError(res, 'User is already verified');
    }

    // Delete existing OTP
    await Otp.deleteMany({ userId: user._id });

    // Generate new OTP
    const otpCode = EmailService.generateOTP();

    // Create new OTP record
    await Otp.create({
      userId: user._id,
      code: otpCode
    });

    // Send new OTP email
    await EmailService.sendOTP(user.email, user.fullName, otpCode);

    return SuccessResponse(res, 'New OTP sent to your email');
  } catch (error) {
    return ServerError(res, 'Server error while resending OTP');
  }
};

// @desc    Login user
// @route   POST /auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return AuthError(res, 'Invalid credentials');
    }

    // Check if user is blocked
    if (user.isBlocked) {
      return ClientError(res, 'Account is blocked. Contact admin.');
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(401).json({ message: 'Email not verified. Please verify your email before logging in.' , isVerified: user.isVerified });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return AuthError(res, 'Invalid credentials');
    }

    // Generate token
    const token = generateToken(user._id);

    const userData = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      isProfileCompleted: user.isProfileCompleted
    };

    return SuccessResponse(res, 'Login successful', { token, user: userData });
  } catch (error) {
    return ServerError(res, 'Server error during login');
  }
};

// @desc    Admin login
// @route   POST /auth/admin-login
// @access  Public
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return AuthError(res, 'Invalid credentials');
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      return ClientError(res, 'Access denied. Admin only.');
    }

    // Check if user is blocked
    if (user.isBlocked) {
      return ClientError(res, 'Account is blocked.');
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return AuthError(res, 'Invalid credentials');
    }

    // Generate token
    const token = generateToken(user._id);

    const userData = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role
    };

    return SuccessResponse(res, 'Admin login successful', { token, user: userData });
  } catch (error) {
    return ServerError(res, 'Server error during admin login');
  }
};

// @desc    Forgot password
// @route   POST /auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return ResourceNotFound(res, 'User');
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send reset email
    await EmailService.sendPasswordReset(email, user.fullName, resetToken);

    return SuccessResponse(res, 'Password reset email sent');
  } catch (error) {
    return ServerError(res, 'Server error during password reset request');
  }
};

// @desc    Reset password
// @route   POST /auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Update password
    const user = await User.findById(decoded.userId);
    if (!user) {
      return ResourceNotFound(res, 'User');
    }

    user.password = password;
    await user.save();

    return SuccessResponse(res, 'Password reset successful');
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return ClientError(res, 'Invalid reset token');
    }
    if (error.name === 'TokenExpiredError') {
      return ClientError(res, 'Reset token expired');
    }
    return ServerError(res, 'Server error during password reset');
  }
};

// @desc    Verify user token
// @route   GET /auth/verify-user
// @access  Private
const verifyUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    return SuccessResponse(res, 'User verified successfully', { user });
  } catch (error) {
    return ServerError(res, 'Server error during user verification');
  }
};

export const deleteMyAccount = async (req, res) => {
  try {
    // The `req.user._id` is provided by the authentication middleware (e.g., `protect`).
    // It identifies the currently logged-in user.
    // The findByIdAndDelete() method is a Mongoose query that triggers the
    // `pre('deleteOne')` hook you have set up in the User model.
    const user = await User.findByIdAndDelete(req.user._id);

    // If for some reason the user document is not found (e.g., already deleted),
    // return a specific response.
    if (!user) {
      return NotFoundResponse(res, 'User not found');
    }

    // Since the `pre` hook successfully handled the deletion of associated data,
    // we can return a success message.
    return SuccessResponse(res, 'User and all associated data deleted successfully');
  } catch (error) {
    // Log the full error to the console for debugging
    console.error('Error deleting user account:', error);
    return ServerError(res, 'Server error during account deletion');
  }
};
export {
  register,
  verifyOTP,
  resendOTP,
  login,
  adminLogin,
  forgotPassword,
  resetPassword,
  verifyUser
};