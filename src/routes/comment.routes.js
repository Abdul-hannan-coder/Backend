import express from 'express';
import {
  createComment,
  getCommentsByProject,
  updateComment,
  deleteComment,
  getAllComments
} from '../controllers/comment.controller.js';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - userId
 *         - projectId
 *         - content
 *       properties:
 *         userId:
 *           type: string
 *           description: ID of the user who created the comment
 *           example: "68a1bf1a589c37d0d268ef01"
 *         projectId:
 *           type: string
 *           description: ID of the project being commented on
 *           example: "68a1bf1a589c37d0d268ef00"
 *         content:
 *           type: string
 *           description: Comment content
 *           example: "Great project! Really impressive implementation."
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Comment creation timestamp
 *           example: "2024-01-15T10:30:00.000Z"
 *     CommentResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Comment created successfully"
 *         data:
 *           $ref: '#/components/schemas/Comment'
 */





/**
 * @swagger
 * /api/v1/comment:
 *   get:
 *     summary: Get all comments
 *     description: Retrieve all comments (Admin only)
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All comments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     comments:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Comment'
 *                     count:
 *                       type: integer
 *                       example: 10
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/', authMiddleware, roleMiddleware(['admin']), getAllComments);

//Comments routes 



/**
 * @swagger
 * /api/v1/comment/add:
 *   post:
 *     summary: Create a new comment
 *     description: Create a new comment on a project (User only)
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - projectId
 *               - content
 *             properties:
 *               projectId:
 *                 type: string
 *                 description: ID of the project to comment on
 *                 example: "68a1bf1a589c37d0d268ef00"
 *               content:
 *                 type: string
 *                 description: Comment content
 *                 example: "Great project! Really impressive implementation."
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommentResponse'
 *       400:
 *         description: Bad request - Validation error or missing required fields
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       403:
 *         description: Forbidden - User access required
 *       404:
 *         description: Project not found
 */

// only user can create comment
router.post('/add', authMiddleware, roleMiddleware(['user']), createComment);

/**
 * @swagger
 * /api/v1/comment/project/{projectId}:
 *   get:
 *     summary: Get comments for a specific project
 *     description: Retrieve comments for a specific project (User only)
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *       - in: path
 *         name: userId
 *         
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     comments:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Comment'
 *                     count:
 *                       type: integer
 *                       example: 2
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       403:
 *         description: Forbidden - User access required
 *       404:
 *         description: Project not found
 */


router.get('/project/:userId/:projectId', authMiddleware, roleMiddleware(['user']), getCommentsByProject);

/**
 * @swagger
 * /api/v1/comment/update/{id}:
 *   put:
 *     summary: Update a comment
 *     description: Update a comment (User only)
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: Updated comment content
 *                 example: "Updated: Really impressive implementation!"
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommentResponse'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       403:
 *         description: Forbidden - User access required or not authorized to update this comment
 *       404:
 *         description: Comment not found
 */
router.put('/update/:id', authMiddleware, roleMiddleware(['user']), updateComment);

/**
 * @swagger
 * /api/v1/comment/delete/{id}:
 *   delete:
 *     summary: Delete a comment
 *     description: Delete a comment (Admin and User access)
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: "Comment deleted successfully"
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       403:
 *         description: Forbidden - Not authorized to delete this comment
 *       404:
 *         description: Comment not found
 */
router.delete('/delete/:id', authMiddleware, roleMiddleware(['admin', 'user']), deleteComment);



export default router;