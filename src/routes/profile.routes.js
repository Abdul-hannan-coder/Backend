import express from 'express';
import {
  createProfile,
 
  updateProfile,
  getProfileByUser,
  getAllProfiles,
  deleteProfile,
  updateCertificates,
  updateProfileImage,
  getProfileCompleteness
} from '../controllers/profile.controller.js';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.js';
import { profileUploadWithErrorHandling, profileImageUpload, certificateUpload, profileUpload } from '../middlewares/upload.js'
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     UserProfile:
 *       type: object
 *       properties:
 *         profession:
 *           type: string
 *           enum:
 *             - Full Stack Developer
 *             - Frontend Developer
 *             - Backend Developer
 *             - Software Engineer
 *             - Mobile App Developer (iOS/Android)
 *             - DevOps Engineer
 *             - Cloud Engineer
 *             - Site Reliability Engineer (SRE)
 *             - Automation Engineer
 *             - UI/UX Designer
 *             - Product Designer
 *             - UX Researcher
 *             - WordPress Designer
 *             - WordPress Administrator
 *             - Digital Marketing Specialist
 *             - Content Strategist
 *             - SEO Specialist
 *             - SEM Specialist
 *             - Social Media Manager
 *             - Email Marketing Specialist
 *             - Marketing Analyst
 *             - Data Scientist
 *             - Data Analyst
 *             - Machine Learning Engineer
 *             - AI Engineer
 *             - Cybersecurity Analyst
 *             - Network Engineer
 *             - Database Administrator
 *             - QA Engineer
 *             - Manual Tester
 *             - Automation Tester
 *             - Technical Writer
 *             - IT Support Specialist
 *             - Business Analyst
 *             - Technical Project Manager
 *             - Scrum Master
 *             - Solutions Architect
 *             - Blockchain Developer
 *             - Game Developer
 *             - AR/VR Developer
 *             - Robotics Engineer
 *             - Systems Analyst
 *         skills:
 *           type: array
 *           items:
 *             type: string
 *         description:
 *           type: string
 *         yearsOfExperience:
 *           type: number
 *           minimum: 0
 *         linkedin:
 *           type: string
 *         github:
 *           type: string
 *         fiverr:
 *           type: string
 *         whatsapp:
 *           type: string
 *         profileImage:
 *           type: string
 *         certificates:
 *           type: array
 *           items:
 *             type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     
 *     UserProfileResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         user:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             fullName:
 *               type: string
 *             email:
 *               type: string
 *             isBlocked:
 *               type: boolean
 *             isProfileComplete:
 *               type: boolean
 *         profile:
 *           $ref: '#/components/schemas/UserProfile'
 */

/**
 * @swagger
 * /api/v1/profile/add/{userID}:
 *   post:
 *     summary: Create a new user profile
 *     description: Creates a new user profile with details such as profession, skills, description, and optional file uploads for profile image and certificates. Profile data is stored within the User model.
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userID
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to create profile for
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - profession
 *               - description
 *               - yearsOfExperience
 *             properties:
 *               profession:
 *                 type: string
 *                 enum:
 *                   - Full Stack Developer
 *                   - Frontend Developer
 *                   - Backend Developer
 *                   - Software Engineer
 *                   - Mobile App Developer (iOS/Android)
 *                   - DevOps Engineer
 *                   - Cloud Engineer
 *                   - Site Reliability Engineer (SRE)
 *                   - Automation Engineer
 *                   - UI/UX Designer
 *                   - Product Designer
 *                   - UX Researcher
 *                   - WordPress Designer
 *                   - WordPress Administrator
 *                   - Digital Marketing Specialist
 *                   - Content Strategist
 *                   - SEO Specialist
 *                   - SEM Specialist
 *                   - Social Media Manager
 *                   - Email Marketing Specialist
 *                   - Marketing Analyst
 *                   - Data Scientist
 *                   - Data Analyst
 *                   - Machine Learning Engineer
 *                   - AI Engineer
 *                   - Cybersecurity Analyst
 *                   - Network Engineer
 *                   - Database Administrator
 *                   - QA Engineer
 *                   - Manual Tester
 *                   - Automation Tester
 *                   - Technical Writer
 *                   - IT Support Specialist
 *                   - Business Analyst
 *                   - Technical Project Manager
 *                   - Scrum Master
 *                   - Solutions Architect
 *                   - Blockchain Developer
 *                   - Game Developer
 *                   - AR/VR Developer
 *                   - Robotics Engineer
 *                   - Systems Analyst
 *                 description: The user's profession
 *                 example: Software Engineer
 *               skills:
 *                 type: string
 *                 description: Comma-separated list of skills
 *                 example: "JavaScript,React,Node.js,MongoDB"
 *               description:
 *                 type: string
 *                 description: A brief description of the user's professional background
 *                 example: "Experienced software engineer with a focus on full-stack development."
 *               yearsOfExperience:
 *                 type: number
 *                 minimum: 0
 *                 description: Years of professional experience
 *                 example: 5
 *               linkedin:
 *                 type: string
 *                 description: URL to the user's LinkedIn profile (optional)
 *                 example: "https://linkedin.com/in/johndoe"
 *               github:
 *                 type: string
 *                 description: URL to the user's GitHub profile (optional)
 *                 example: "https://github.com/johndoe"
 *               fiverr:
 *                 type: string
 *                 description: URL to the user's Fiverr profile (optional)
 *                 example: "https://fiverr.com/johndoe"
 *               whatsapp:
 *                 type: string
 *                 description: WhatsApp contact number (optional)
 *                 example: "+1234567890"
 *               profileImage:
 *                 type: string
 *                 format: binary
 *                 description: Profile image file (uploaded to Cloudinary)
 *               certificates:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: List of certificate files (uploaded to Cloudinary)
 *     responses:
 *       201:
 *         description: Profile created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfileResponse'
 *             example:
 *               success: true
 *               message: "Profile created successfully"
 *               user:
 *                 _id: "507f1f77bcf86cd799439011"
 *                 fullName: "John Doe"
 *                 email: "john@example.com"
 *                 isBlocked: false
 *                 isProfileComplete: true
 *               profile:
 *                 profession: "Software Engineer"
 *                 skills: ["JavaScript", "React", "Node.js"]
 *                 description: "Experienced software engineer with a focus on full-stack development."
 *                 yearsOfExperience: 5
 *                 linkedin: "https://linkedin.com/in/johndoe"
 *                 github: "https://github.com/johndoe"
 *                 profileImage: "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/profile.jpg"
 *                 certificates: ["https://res.cloudinary.com/your-cloud/image/upload/v1234567890/cert1.jpg"]
 *                 createdAt: "2025-08-19T03:23:00.000Z"
 *                 updatedAt: "2025-08-19T03:23:00.000Z"
 *       400:
 *         description: Bad request (e.g., profile already exists, missing required fields)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               examples:
 *                 profileExists:
 *                   summary: Profile already exists
 *                   value:
 *                     message: "Profile already exists for this user"
 *                 missingField:
 *                   summary: Missing required field
 *                   value:
 *                     message: "Profession is required"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *       500:
 *         description: Server error
 */
router.post('/add/:userID', authMiddleware, profileUploadWithErrorHandling, createProfile);

/**
 * @swagger
 * /api/v1/profile/me/{userID}:
 *   get:
 *     summary: Get own profile
 *     description: Retrieves the profile data for the specified user from their User document
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userID
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to get profile for
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfileResponse'
 *       404:
 *         description: User or Profile not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               examples:
 *                 userNotFound:
 *                   summary: User not found
 *                   value:
 *                     message: "User not found"
 *                 profileNotFound:
 *                   summary: Profile not found
 *                   value:
 *                     message: "Profile not found"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/me/:userID', authMiddleware, getProfileByUser);

/**
 * @swagger
 * /api/v1/profile/update/{userID}:
 *   put:
 *     summary: Update user profile
 *     description: Update an existing user profile with new information and optional media uploads. Updates the profile object within the User document.
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userID
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to update profile for
 *         example: "68a1bf1a589c37d0d268ef00"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profession:
 *                 type: string
 *                 enum:
 *                   - Full Stack Developer
 *                   - Frontend Developer
 *                   - Backend Developer
 *                   - Software Engineer
 *                   - Mobile App Developer (iOS/Android)
 *                   - DevOps Engineer
 *                   - Cloud Engineer
 *                   - Site Reliability Engineer (SRE)
 *                   - Automation Engineer
 *                   - UI/UX Designer
 *                   - Product Designer
 *                   - UX Researcher
 *                   - WordPress Designer
 *                   - WordPress Administrator
 *                   - Digital Marketing Specialist
 *                   - Content Strategist
 *                   - SEO Specialist
 *                   - SEM Specialist
 *                   - Social Media Manager
 *                   - Email Marketing Specialist
 *                   - Marketing Analyst
 *                   - Data Scientist
 *                   - Data Analyst
 *                   - Machine Learning Engineer
 *                   - AI Engineer
 *                   - Cybersecurity Analyst
 *                   - Network Engineer
 *                   - Database Administrator
 *                   - QA Engineer
 *                   - Manual Tester
 *                   - Automation Tester
 *                   - Technical Writer
 *                   - IT Support Specialist
 *                   - Business Analyst
 *                   - Technical Project Manager
 *                   - Scrum Master
 *                   - Solutions Architect
 *                   - Blockchain Developer
 *                   - Game Developer
 *                   - AR/VR Developer
 *                   - Robotics Engineer
 *                   - Systems Analyst
 *                 description: User's profession (optional for updates)
 *                 example: "Full Stack Developer"
 *               skills:
 *                 type: string
 *                 description: Comma-separated skills (optional for updates)
 *                 example: "JavaScript, React, Node.js, MongoDB, TypeScript"
 *               description:
 *                 type: string
 *                 description: User's description/bio (optional for updates)
 *                 example: "Experienced developer with expertise in modern web technologies"
 *               yearsOfExperience:
 *                 type: number
 *                 minimum: 0
 *                 description: Years of work experience (optional for updates)
 *                 example: 5
 *               linkedin:
 *                 type: string
 *                 description: LinkedIn profile URL (optional for updates)
 *                 example: "https://linkedin.com/in/username"
 *               github:
 *                 type: string
 *                 description: GitHub profile URL (optional for updates)
 *                 example: "https://github.com/username"
 *               fiverr:
 *                 type: string
 *                 description: Fiverr profile URL (optional for updates)
 *                 example: "https://fiverr.com/username"
 *               whatsapp:
 *                 type: string
 *                 description: WhatsApp number (optional for updates)
 *                 example: "+1234567890"
 *               profileImage:
 *                 type: string
 *                 format: binary
 *                 description: New profile image file (optional, max 5MB, replaces existing)
 *               certificates:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: New certificate image files (optional, max 5 files, 5MB each, replaces existing)
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfileResponse'
 *       400:
 *         description: Bad request - Validation error or invalid data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User or Profile not found
 *       500:
 *         description: Internal server error
 */
router.put('/update/:userID', authMiddleware, profileUpload, updateProfile);

/**
 * @swagger
 * /api/v1/profile/update-image/{userID}:
 *   put:
 *     summary: Update only profile image
 *     description: Update just the profile image for an existing user profile
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userID
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to update profile image for
 *         example: "68a1bf1a589c37d0d268ef00"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - profileImage
 *             properties:
 *               profileImage:
 *                 type: string
 *                 format: binary
 *                 description: New profile image file (required, max 5MB, replaces existing)
 *     responses:
 *       200:
 *         description: Profile image updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Profile image updated successfully"
 *                 profileImage:
 *                   type: string
 *                   example: "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/profile.jpg"
 *                 profile:
 *                   $ref: '#/components/schemas/UserProfile'
 *       400:
 *         description: Bad request - No image file provided
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User or Profile not found
 *       500:
 *         description: Internal server error
 */
router.put('/update-image/:userID', authMiddleware, profileImageUpload, updateProfileImage);

/**
 * @swagger
 * /api/v1/profile/update-certificates/{userID}:
 *   put:
 *     summary: Update only profile certificates
 *     description: Update just the certificates for an existing user profile
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userID
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to update certificates for
 *         example: "68a1bf1a589c37d0d268ef00"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - certificates
 *             properties:
 *               certificates:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: New certificate image files (required, max 5 files, 5MB each, replaces existing)
 *     responses:
 *       200:
 *         description: Profile certificates updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Profile certificates updated successfully"
 *                 certificates:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["https://res.cloudinary.com/your-cloud/image/upload/v1234567890/cert1.jpg"]
 *                 profile:
 *                   $ref: '#/components/schemas/UserProfile'
 *       400:
 *         description: Bad request - No certificate files provided
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User or Profile not found
 *       500:
 *         description: Internal server error
 */
router.put('/update-certificates/:userID', authMiddleware, certificateUpload, updateCertificates);

/**
 * @swagger
 * /api/v1/profile:
 *   get:
 *     summary: Get all profiles
 *     description: Retrieves all user profiles from User documents that have profile data. Returns user info along with their profile data.
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All profiles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Profiles retrieved successfully"
 *                 profiles:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       user:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           fullName:
 *                             type: string
 *                           email:
 *                             type: string
 *                           isBlocked:
 *                             type: boolean
 *                           isProfileComplete:
 *                             type: boolean
 *                       profile:
 *                         $ref: '#/components/schemas/UserProfile'
 *                 count:
 *                   type: number
 *                   example: 25
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/',  getAllProfiles);

/**
 * @swagger
 * /api/v1/profile/{userID}:
 *   get:
 *     summary: Get profile by user ID
 *     description: Retrieves a user's profile by their user ID. This is a public endpoint.
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: userID
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to get profile for
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfileResponse'
 *       404:
 *         description: User or Profile not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               examples:
 *                 userNotFound:
 *                   summary: User not found
 *                   value:
 *                     message: "User not found"
 *                 profileNotFound:
 *                   summary: Profile not found
 *                   value:
 *                     message: "Profile not found"
 *       500:
 *         description: Server error
 */
router.get('/:userID', getProfileByUser);

/**
 * @swagger
 * /api/v1/profile/delete/{userID}:
 *   delete:
 *     summary: Delete a user profile (Admin only)
 *     description: Deletes a user's profile data from their User document and sets isProfileComplete to false. Requires admin privileges.
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userID
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to delete profile for
 *         example: "68a1bf1a589c37d0d268ef00"
 *     responses:
 *       200:
 *         description: Profile deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Profile deleted successfully"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: User or Profile not found
 *       500:
 *         description: Internal server error
 */
router.delete('/delete/:userID', authMiddleware, roleMiddleware(['admin']), deleteProfile);

/**
 * @swagger
 * /api/v1/profile/test-cloudinary:
 *   get:
 *     summary: Test Cloudinary connection
 *     description: Simple test endpoint to verify Cloudinary is working
 *     tags: [Profiles]
 *     responses:
 *       200:
 *         description: Cloudinary test successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Cloudinary connection successful
 *                 result:
 *                   type: object
 *       500:
 *         description: Cloudinary test failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cloudinary test failed
 */
router.get('/test-cloudinary', async (req, res) => {
  try {
    const result = await cloudinary.api.ping();
    res.json({
      success: true,
      message: 'Cloudinary connection successful',
      result: result
    });
  } catch (error) {
    console.error('Error in /test-cloudinary route:', error);
    res.status(500).json({
      success: false,
      message: 'Cloudinary test failed',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/v1/profile/test-upload:
 *   post:
 *     summary: Test file upload functionality
 *     description: Simple test endpoint to verify file uploads work
 *     tags: [Profiles]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               testFile:
 *                 type: string
 *                 format: binary
 *                 description: Test file to upload
 *     responses:
 *       200:
 *         description: Upload test successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Upload test successful
 *                 files:
 *                   type: array
 *                   items:
 *                     type: object
 *                 body:
 *                   type: object
 *       400:
 *         description: Upload error
 *       500:
 *         description: Server error
 */
router.post('/test-upload', profileUploadWithErrorHandling, (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Upload test successful',
      files: req.files,
      body: req.body
    });
  } catch (error) {
    console.error('Error in /test-upload route:', error);
    res.status(500).json({
      success: false,
      message: 'Upload test failed',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/v1/profile/check-completeness/{userID}:
 *   get:
 *     summary: Check profile completeness
 *     description: Checks if the user's profile is complete based on certain fields
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userID
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to check profile completeness for
 *         example: "68a1bf1a589c37d0d268ef00"
 *     responses:
 *       200:
 *         description: Profile completeness checked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 isComplete:
 *                   type: boolean
 *                   example: true
 *       404:
 *         description: User or Profile not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User or Profile not found"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/check-completeness/:userID', authMiddleware, getProfileCompleteness);

export default router;