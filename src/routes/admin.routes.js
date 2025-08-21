import express from 'express';
import {
  getAllUsers,
  blockUser,
  unblockUser,
  deleteUser,
  getUser,
  getDashboardStats
} from '../controllers/admin.controller.js';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.js';


const router = express.Router();

//  Public routes  Routes
/**
 * @swagger
 * /api/v1/admin/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     description: Retrieve a list of all users. Only accessible by admin users.
 *     tags: [Admin, Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *             example:
 *               status: true
 *               message: "Users retrieved successfully"
 *               data: [
 *                 {
 *                   _id: "64c9e9f5d1f1a0b1d5c1f2a1",
 *                   fullName: "John Doe",
 *                   email: "johndoe@example.com",
 *                   role: "user",
 *                   isBlocked: false
 *                 }
 *               ]
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       403:
 *         description: Forbidden - Admin access required
 */

router.get('/users',authMiddleware, roleMiddleware(['admin']), getAllUsers);
/**
 * @swagger
 * /api/v1/admin/user/{userId}:
 *   get:
 *     summary: Get a user by ID
 *     description: Retrieve details of a specific user by their user ID.
 *     tags: [Admin, Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to retrieve
 *         example: "64c9e9f5d1f1a0b1d5c1f2a1"
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *             example:
 *               status: true
 *               message: "User retrieved successfully"
 *               data:
 *                 _id: "64c9e9f5d1f1a0b1d5c1f2a1"
 *                 fullName: "John Doe"
 *                 email: "johndoe@example.com"
 *                 role: "user"
 *                 isBlocked: false
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       404:
 *         description: User not found
 */

router.get('/user/:userId',  getUser);





// Admin only Routes


/**
 * @swagger
 * /api/v1/users/block/{userId}:
 *   put:
 *     summary: Block a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user to block
 *         schema:
 *           type: string
 *           example: "64c9e9f5d1f1a0b1d5c1f2a1"
 *     responses:
 *       200:
 *         description: User blocked successfully
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
 *                   example: User blocked successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "64c9e9f5d1f1a0b1d5c1f2a1"
 *                     fullName:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "johndoe@example.com"
 *                     role:
 *                       type: string
 *                       example: "user"
 *                     isBlocked:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Cannot block admin users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Cannot block admin users
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - only admins can perform this action
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.put('/block/:userId',authMiddleware, roleMiddleware(['admin']), blockUser);



/**
 * @swagger
 * /api/v1/users/unblock/{userId}:
 *   put:
 *     summary: Unblock a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user to unblock
 *         schema:
 *           type: string
 *           example: "64c9e9f5d1f1a0b1d5c1f2a1"
 *     responses:
 *       200:
 *         description: User unblocked successfully
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
 *                   example: User unblocked successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "64c9e9f5d1f1a0b1d5c1f2a1"
 *                     fullName:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "johndoe@example.com"
 *                     role:
 *                       type: string
 *                       example: "user"
 *                     isBlocked:
 *                       type: boolean
 *                       example: false
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */


router.put('/unblock/:userId',authMiddleware, roleMiddleware(['admin']), unblockUser);
/**
 * @swagger
 * /api/v1/users/delete-user/{id}:
 *   delete:
 *     summary: Delete a user and all associated data
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to delete
 *         schema:
 *           type: string
 *           example: "64c9e9f5d1f1a0b1d5c1f2a1"
 *     responses:
 *       200:
 *         description: User and related data deleted successfully
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
 *                   example: User and all associated data deleted successfully
 *       400:
 *         description: Cannot delete admin users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Cannot delete admin users
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */







router.delete('/admin/delete-user/:id',authMiddleware, roleMiddleware(['admin']), deleteUser);

router.get('/dashboard', authMiddleware , roleMiddleware(['admin']), getDashboardStats);




/**
 * @swagger
 * /api/v1/admin/dashboard:
 *   get:
 *     summary: Test admin access (Admin only)
 *     description: Simple test endpoint to verify admin authentication and authorization
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin access test successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 adminInfo:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                     role:
 *                       type: string
 *                     permissions:
 *                       type: array
 *                       items:
 *                         type: string
 *             example:
 *               status: true
 *               message: "Admin access verified successfully"
 *               adminInfo:
 *                 userId: "68a1bf1a589c37d0d268ef01"
 *                 role: "admin"
 *                 permissions: ["users", "projects", "dashboard"]
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/dashboard',authMiddleware, roleMiddleware(['admin']), (req, res) => {
  res.json({
    status: true,
    message: 'Admin access verified successfully',
    adminInfo: {
      userId: req.user._id,
      role: req.user.role,
      permissions: ['users', 'projects', 'dashboard']
    }
  });
});

export default router;



// router.put('/update-project/:id', projectUploadWithErrorHandling, updateProject);
// router.delete('/delete-project/:id', deleteProject);