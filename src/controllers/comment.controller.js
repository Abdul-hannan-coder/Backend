import CommentModel from '../models/Comments.js';
import Project from '../models/Project.js';
import User from '../models/User.js';
import {
  ServerError,
  ClientError,
  ResourceNotFound,
  SuccessResponse,
  CreatedResponse,
  AuthError
} from '../utils/helperFunctions.js';

// @desc    Create comment
// @route   POST /comment/add
// @access  Private
const createComment = async (req, res) => {
  try {
    const { projectId, content } = req.body;
      const user = await User.findById(req.user._id).select('isProfileComplete');
        if (!user || !user.isProfileComplete) {
          return ClientError(res, 'Please complete your profile before creating a project');
        }

    // Validate project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return ResourceNotFound(res, 'Project');
    }

    // Check if user is trying to comment on their own project
    if (project.userId.toString() === req.user._id.toString()) {
      return ClientError(res, 'You cannot comment on your own project');
    }

    // Create comment
    const comment = await CommentModel.create({
      userId: req.user._id,
      projectId,
      content
    });

    return CreatedResponse(res, 'Comment created successfully', comment);
  } catch (error) {
    return ServerError(res, 'Server error during comment creation');
  }
};

// @desc    Get comments by project ID
// @route   GET /comment/project/:projectId
// @access  Public
const getCommentsByProject = async (req, res) => {
  try {
    const { projectId , userId} = req.params;




    const isBlocked =await User.findById(userId).select('isBlocked');

    if (isBlocked) {
      return ClientError(res, 'Account is blocked. Contact admin.');
    }




    // Validate project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return ResourceNotFound(res, 'Project');
    }

    const comments = await CommentModel.find({ projectId })
      .populate('userId', 'fullName email')
      .sort({ createdAt: -1 });

    return SuccessResponse(res, 'Comments retrieved successfully', { comments, count: comments.length });
  } catch (error) {
    return ServerError(res, 'Server error while fetching comments');
  }
};

// @desc    Update comment
// @route   PUT /comment/update/:id
// @access  Private
const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    // Find comment
    const comment = await CommentModel.findById(id);
    if (!comment) {
      return ResourceNotFound(res, 'Comment');
    }

    // Check ownership or admin role
    if (comment.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return AuthError(res, 'Not authorized to update this comment');
    }

    // Update comment
    const updatedComment = await CommentModel.findByIdAndUpdate(
      id,
      { content },
      { new: true, runValidators: true }
    );

    return SuccessResponse(res, 'Comment updated successfully', { comment: updatedComment });
  } catch (error) {
    return ServerError(res, 'Server error during comment update');
  }
};

// @desc    Delete comment
// @route   DELETE /comment/delete/:id
// @access  Private
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    // Find comment
    const comment = await CommentModel.findById(id);
    if (!comment) {
      return ResourceNotFound(res, 'Comment');
    }

    // Check ownership or admin role
    if (comment.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return AuthError(res, 'Not authorized to delete this comment');
    }

    await CommentModel.findByIdAndDelete(id);

    return SuccessResponse(res, 'Comment deleted successfully');
  } catch (error) {
    return ServerError(res, 'Server error during comment deletion');
  }
};

// @desc    Get all comments (admin only)
// @route   GET /comment
// @access  Private/Admin
const getAllComments = async (req, res) => {
  try {
    const comments = await CommentModel.find()
      .populate('userId', 'fullName email isBlocked')
      .populate('projectId', 'title')
      .sort({ createdAt: -1 });

    return SuccessResponse(res, 'Comments retrieved successfully', { comments, count: comments.length });
  } catch (error) {
    return ServerError(res, 'Server error while fetching comments');
  }
};

export {
  createComment,
  getCommentsByProject,
  updateComment,
  deleteComment,
  getAllComments
};