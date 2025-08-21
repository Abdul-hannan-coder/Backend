import express from 'express';
import {
  register,
  verifyOTP,
  resendOTP,
  login,
  adminLogin,
  forgotPassword,
  resetPassword,
  verifyUser,
  deleteMyAccount
} from '../controllers/auth.controller.js';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.js';
import validateRegister from "../middlewares/validations.js"
import mongoose from 'mongoose';
import Otp from '../models/Otp.js';
import User from '../models/User.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - fullName
 *         - email
 *         - password
 *       properties:
 *         fullName:
 *           type: string
 *           description: User's full name
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         password:
 *           type: string
 *           minLength: 6
 *           description: User's password (min 6 characters)
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           default: user
 *           description: User's role in the system
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         token:
 *           type: string
 *         user:
 *           $ref: '#/components/schemas/User'
 *     OTPRequest:
 *       type: object
 *       required:
 *         - email
 *         - otp
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         otp:
 *           type: string
 *           length: 6
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request - validation error
 *       409:
 *         description: User already exists
 */
router.post('/register', validateRegister, register);

/**
 * @swagger
 * /api/v1/auth/verify-otp:
 *   post:
 *     summary: Verify OTP for user registration
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OTPRequest'
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid OTP
 *       404:
 *         description: User not found
 */
router.post('/verify-otp', verifyOTP);

/**
 * @swagger
 * /api/v1/auth/resend-otp:
 *   post:
 *     summary: Resend OTP to user's email
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: OTP resent successfully
 *       404:
 *         description: User not found
 */
router.post('/resend-otp', resendOTP);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 */
router.post('/login', login);

/**
 * @swagger
 * /api/v1/auth/admin-login:
 *   post:
 *     summary: Admin login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Admin login successful
 *       401:
 *         description: Invalid credentials or not admin
 */
router.post('/admin-login', adminLogin);

/**
 * @swagger
 * /api/v1/auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Password reset email sent
 *       404:
 *         description: User not found
 */
router.post('/forgot-password', forgotPassword);

/**
 * @swagger
 * /api/v1/auth/reset-password/{token}:
 *   post:
 *     summary: Reset password using token
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Password reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired token
 */
router.post('/reset-password/:token', resetPassword);

/**
 * @swagger
 * /api/v1/auth/verify-user:
 *   get:
 *     summary: Verify user authentication
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - invalid token
 */
router.get('/verify-user', authMiddleware, verifyUser);

/**
 * @swagger
 * /api/v1/auth/test-otps:
 *   get:
 *     summary: Test endpoint to check OTPs in database (Debug only)
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: OTPs retrieved successfully
 *       500:
 *         description: Server error
 */
router.get('/test-otps', async (req, res) => {
  try {
    const otps = await Otp.find().populate('userId', 'fullName email');
    const users = await User.find().select('fullName email isVerified');
    
    res.json({
      success: true,
      message: 'OTP test endpoint',
      data: {
        otps: otps.map(otp => ({
          _id: otp._id,
          code: otp.code,
          expiresAt: otp.expiresAt,
          createdAt: otp.createdAt,
          user: otp.userId ? {
            _id: otp.userId._id,
            fullName: otp.userId.fullName,
            email: otp.userId.email
          } : 'User not found'
        })),
        users,
        otpCount: otps.length,
        userCount: users.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error testing OTPs',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/v1/auth/test-otp-creation:
 *   post:
 *     summary: Test OTP creation directly (Debug only)
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - code
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User ID to create OTP for
 *               code:
 *                 type: string
 *                 description: OTP code to save
 *     responses:
 *       200:
 *         description: OTP creation test successful
 *       500:
 *         description: OTP creation test failed
 */
router.post('/test-otp-creation', async (req, res) => {
  try {
    const { userId, code } = req.body;
    const testOtp = await Otp.create({
      userId,
      code
    });
    const savedOtp = await Otp.findById(testOtp._id);
    await Otp.findByIdAndDelete(testOtp._id);
    
    res.json({
      success: true,
      message: 'OTP creation test successful',
      data: {
        createdOtp: testOtp,
        verification: savedOtp ? 'PASSED' : 'FAILED'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'OTP creation test failed',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/v1/auth/debug-database:
 *   get:
 *     summary: Debug database connection and OTP model (Debug only)
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Database debug information
 *       500:
 *         description: Database debug failed
 */
router.get('/debug-database', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const dbStates = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    let otpCount, userCount;
    try {
      otpCount = await Otp.countDocuments();
    } catch {
      otpCount = 'ERROR';
    }
    
    try {
      userCount = await User.countDocuments();
    } catch {
      userCount = 'ERROR';
    }
    
    let testOtpResult = 'NOT_ATTEMPTED';
    try {
      const testUser = await User.findOne().select('_id');
      if (testUser) {
        const testOtp = await Otp.create({
          userId: testUser._id,
          code: '123456'
        });
        const savedOtp = await Otp.findById(testOtp._id);
        await Otp.findByIdAndDelete(testOtp._id);
        testOtpResult = 'SUCCESS';
      } else {
        testOtpResult = 'NO_USERS';
      }
    } catch (error) {
      testOtpResult = `ERROR: ${error.message}`;
    }
    
    res.json({
      success: true,
      message: 'Database debug completed',
      data: {
        database: {
          state: dbState,
          status: dbStates[dbState],
          host: mongoose.connection.host,
          name: mongoose.connection.name
        },
        models: {
          otp: {
            type: typeof Otp,
            hasSchema: !!Otp.schema,
            modelName: Otp.modelName,
            collectionName: Otp.collection.name
          },
          user: {
            type: typeof User,
            hasSchema: !!User.schema,
            modelName: User.modelName,
            collectionName: User.collection.name
          }
        },
        counts: {
          otps: otpCount,
          users: userCount
        },
        testOtp: testOtpResult
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database debug failed',
      error: error.message
    });
  }
});










/**
 * @swagger
 * /api/v1/auth/delete-account/{userId}:
 *   delete:
 *     summary: Delete user account
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *       400:
 *         description: Bad request - invalid user ID
 */
router.delete('/delete-accout/:userId',authMiddleware, roleMiddleware(['user']),deleteMyAccount);


export default router;