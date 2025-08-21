import User from '../models/User.js';
import Profile from '../models/Profile.js';
import Project from '../models/Project.js';
import {
  ServerError,
  ClientError,
  ResourceNotFound,
  SuccessResponse,
  CreatedResponse
} from '../utils/helperFunctions.js';

// @desc    Get all users
// @route   GET /admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return SuccessResponse(res, 'Users retrieved successfully', { users, count: users.length });
  } catch (error) {
    return ServerError(res, 'Server error while fetching users');
  }
};




const getUser = async (req, res) => {
  try {
    const { userId } = req.params; // Use 'userId' to match the route parameter
    const user = await User.findById(userId).select('-password'); // Exclude the password field
    if (!user) {
      return ResourceNotFound(res, 'User'); // Return 404 if user not found
    }
    return SuccessResponse(res, 'User retrieved successfully', { user }); // Wrap user in an object
  } catch (error) {
    return ServerError(res, 'Server error while fetching user');
  }
};


// @desc    Block user
// @route   PUT /admin/block/:userId
// @access  Private/Admin
const blockUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return ResourceNotFound(res, 'User');
    }

    if (user.role === 'admin') {
      return ClientError(res, 'Cannot block admin users');
    }

    user.isBlocked = true;
    await user.save();

    const userData = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isBlocked: user.isBlocked
    };

    return SuccessResponse(res, 'User blocked successfully', { user: userData });
  } catch (error) {
    return ServerError(res, 'Server error while blocking user');
  }
};

// @desc    Unblock user
// @route   PUT /admin/unblock/:userId
// @access  Private/Admin

const unblockUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return ResourceNotFound(res, 'User');
    }

    user.isBlocked = false;
    await user.save();

    const userData = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isBlocked: user.isBlocked
    };

    return SuccessResponse(res, 'User unblocked successfully', { user: userData });
  } catch (error) {
    return ServerError(res, 'Server error while unblocking user');
  }
};

// @desc    Delete user (admin only)
// @route   DELETE /admin/delete-user/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return ResourceNotFound(res, 'User');
    }

    if (user.role === 'admin') {
      return ClientError(res, 'Cannot delete admin users');
    }

    await Profile.findOneAndDelete({ userId: id });
    await Project.deleteMany({ userId: id });
    await User.findByIdAndDelete(id);

    return SuccessResponse(res, 'User and all associated data deleted successfully');
  } catch (error) {
    return ServerError(res, 'Server error during user deletion');
  }
};

// @desc    Update any project (admin only)
// @route   PUT /admin/update-project/:id
// @access  Private/Admin
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, summary, skills, description, link } = req.body;

    const project = await Project.findById(id);
    if (!project) {
      return ResourceNotFound(res, 'Project');
    }

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      {
        title,
        summary,
        skills: skills ? skills.split(',').map(skill => skill.trim()) : project.skills,
        description,
        link,
        ...(req.files?.thumbnail?.[0]?.path && { thumbnail: req.files.thumbnail[0].path }),
        ...(req.files?.images && { images: req.files.images.map(file => file.path) })
      },
      { new: true, runValidators: true }
    );

    return SuccessResponse(res, 'Project updated successfully by admin', { project: updatedProject });
  } catch (error) {
    return ServerError(res, 'Server error during project update');
  }
};

// @desc    Delete any project (admin only)
// @route   DELETE /admin/delete-project/:id
// @access  Private/Admin
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) {
      return ResourceNotFound(res, 'Project');
    }

    await Project.findByIdAndDelete(id);

    return SuccessResponse(res, 'Project deleted successfully by admin');
  } catch (error) {
    return ServerError(res, 'Server error during project deletion');
  }
};

// @desc    Get admin dashboard stats
// @route   GET /admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalProfiles = await Profile.countDocuments();
    const totalProjects = await Project.countDocuments();
    const blockedUsers = await User.countDocuments({ isBlocked: true });
    const unverifiedUsers = await User.countDocuments({ isVerified: false });

    const stats = {
      totalUsers,
      totalProfiles,
      totalProjects,
      blockedUsers,
      unverifiedUsers
    };

    return SuccessResponse(res, 'Dashboard stats retrieved successfully', { stats });
  } catch (error) {
    return ServerError(res, 'Server error while fetching dashboard stats');
  }
};

export {

  getAllUsers,
  blockUser,
  unblockUser,
  deleteUser,
  updateProject,
  deleteProject,
  getDashboardStats,
  getUser
};