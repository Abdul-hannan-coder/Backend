import express from 'express';
import {
  createProject,
  getMyProjects,
  updateProject,
  deleteProject,
  getProjectsByUser,
  getAllProjects
} from '../controllers/project.controller.js';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.js';
import { projectUploadWithErrorHandling } from '../middlewares/upload.js';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();


/**
 * @swagger
 * /api/v1/project/add/{userID}:
 *   post:
 *     summary: Create a new project
 *     description: Create a new project with title, summary, description, skills, and optional media uploads
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userID
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - summary
 *               - description
 *               - thumbnail
 *             properties:
 *               title:
 *                 type: string
 *                 description: Project title (required)
 *                 example: "E-Commerce Platform"
 *               summary:
 *                 type: string
 *                 description: Project summary, max 15 words (required)
 *                 example: "A modern e-commerce platform built with React and Node.js"
 *               description:
 *                 type: string
 *                 description: Detailed project description (required)
 *                 example: "Full-stack e-commerce application with user authentication, product management, and payment integration"
 *               skills:
 *                 type: string
 *                 description: Comma-separated skills and technologies (optional)
 *                 example: "React, Node.js, MongoDB, Express"
 *               link:
 *                 type: string
 *                 description: Live project URL or GitHub repository (optional)
 *                 example: "https://github.com/username/project"
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *                 description: Project thumbnail image file (required, max 5MB)
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Additional project image files (optional, max 3 files, 5MB each)
 *     responses:
 *       201:
 *         description: Project created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectResponse'
 *             example:
 *               success: true
 *               message: "Project created successfully"
 *               project:
 *                 _id: "68a1bf1a589c37d0d268ef00"
 *                 userId: "68a1bf1a589c37d0d268ef01"
 *                 title: "E-Commerce Platform"
 *                 summary: "A modern e-commerce platform built with React and Node.js"
 *                 description: "Full-stack e-commerce application with user authentication, product management, and payment integration"
 *                 skills: ["React", "Node.js", "MongoDB", "Express"]
 *                 link: "https://github.com/username/project"
 *                 thumbnail: "https://res.cloudinary.com/dhvk1yovx/image/upload/v1755430683/Community Learning Platform API/projects/thumbnails/project-thumb.png"
*                 images: ["https://res.cloudinary.com/dhvk1yovx/image/upload/v1755430683/Community Learning Platform API/projects/images/project-img1.png"]
 *                 createdAt: "2024-01-15T10:30:00.000Z"
 *                 updatedAt: "2024-01-15T10:30:00.000Z"
 *       400:
 *         description: Bad request - Validation error or missing required fields
 *         content:
 *           application/json:
 *             example:
 *               message: "Project title is required"
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       500:
 *         description: Internal server error
 */
router.post('/add/:userID', authMiddleware, roleMiddleware(['user']), projectUploadWithErrorHandling, createProject);

/**
 * @swagger
 * /api/v1/project/me:
 *   get:
 *     summary: Get current user's projects
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Projects retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               title: ProjectResponse
 *               description: Projects
 *               properties:
 *                 success:
 *                   type: boolean
 *                 projects:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Project'
 *       401:
 *         description: Unauthorized
 */
router.get('/me', authMiddleware, getMyProjects);

/**
 * @swagger
 * /api/v1/project/{userId}:
 *   get:
 *     summary: Get projects by user ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Projects retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 projects:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Project'
 *       404:
 *         description: User not found
 */
router.get('/:userId', getProjectsByUser);

/**
 * @swagger
 * /api/v1/project:
 *   get:
 *     summary: Get all projects (Admin only)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All projects retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 projects:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Project'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/', authMiddleware, roleMiddleware(['admin']), getAllProjects);



/**
 *  @swagger
 *  /api/v1/project/{projectId}:
 *    get:
 *      summary: Get a single project by ID
 *      tags: [Projects]
 *      parameters:
 *        - in: path
 *          name: projectId
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: Project retrieved successfully
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                  project:
 *                    $ref: '#/components/schemas/Project'
 *        404:
 *          description: Project not found
 */
route.get('/project/:projectId', getSingleProject);

/**
 * @swagger
 * /api/v1/project/update/{id}:
 *   put:
 *     summary: Update a user's project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: Proejct ID
 *         required: true
 *         description: ID of the  project which is being updated
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "AI Chatbot Updated"
 *               summary:
 *                 type: string
 *                 example: "Improved chatbot with better NLP"
 *               skills:
 *                 type: string
 *                 description: Comma-separated list of skills
 *                 example: "Node.js,Express,NLP,Socket.io"
 *               description:
 *                 type: string
 *                 example: "This is the updated description of the chatbot project."
 *               link:
 *                 type: string
 *                 example: "https://github.com/username/chatbot-v2"
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Project updated successfully
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
 *                   example: Project updated successfully
 *                 project:
 *                   $ref: '#/components/schemas/Project'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */
router.put('/update/:id', authMiddleware, projectUploadWithErrorHandling, updateProject);

/**
 * @swagger
 * /api/v1/project/delete/{id}:
 *   delete:
 *     summary: Delete a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Project not found
 */
router.delete('/delete/:id', authMiddleware, deleteProject);



/**
 * @swagger
 * /api/v1/project/test-upload:
 *   post:
 *     summary: Test project file upload functionality
 *     description: Simple test endpoint to verify project file uploads work
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *                 description: Test thumbnail file
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Test project image files
 *     responses:
 *       200:
 *         description: Upload test successful
 *       400:
 *         description: Upload error
 */
router.post('/test-upload', projectUploadWithErrorHandling, (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Project upload test successful',
      thumbnail: req.files?.thumbnail?.[0],
      images: req.files?.images || [],
      body: req.body
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Project upload test failed',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/v1/project/test-cloudinary:
 *   get:
 *     summary: Test Cloudinary connection for projects
 *     description: Simple test endpoint to verify Cloudinary is working for project uploads
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: Cloudinary test successful
 *       500:
 *         description: Cloudinary test failed
 */
router.get('/test-cloudinary', async (req, res) => {
  try {
    const result = await cloudinary.api.ping();
    
    res.json({
      success: true,
      message: 'Cloudinary connection successful for projects',
      result: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Project Cloudinary test failed',
      error: error.message
    });
  }
});

export default router;