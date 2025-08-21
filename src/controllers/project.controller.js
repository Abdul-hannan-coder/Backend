import Project from '../models/Project.js';
import User from '../models/User.js';
import {
  ServerError,
  ClientError,
  AuthError,
  ResourceNotFound,
  SuccessResponse,
  CreatedResponse
} from '../utils/helperFunctions.js';

// @desc    Create project
// @route   POST /project/add
// @access  Private
const createProject = async (req, res) => {
  try {
    const { title, summary, skills, description, link } = req.body;
    const userId = req.params.userID; // Extract userId from request parameters

  

    // Process uploaded files
    const thumbnailPath = req.files?.thumbnail?.[0]?.path || null;
    const imagePaths = req.files?.images?.map(file => file.path) || [];

    // Create the project
    const project = await Project.create({
      userId,
      title,
      summary,
      skills: skills ? skills.split(',').map(skill => skill.trim()) : [],
      description,
      link,
      thumbnail: thumbnailPath,
      images: imagePaths
    });

    return CreatedResponse(res, 'Project created successfully', project);
  } catch (error) {
    console.error('Error during project creation:', error);
    return ServerError(res, 'Server error during project creation');
  }
};

// @desc    Get own projects
// @route   GET /project/me
// @access  Private
const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    return SuccessResponse(res, 'Projects retrieved successfully', { projects, count: projects.length });
  } catch (error) {
    return ServerError(res, 'Server error while fetching projects');
  }
};

// @desc    Update project
// @route   PUT /project/update/:id
// @access  Private
const updateProject = async (req, res) => {
  try {
    const { id} = req.params;
    const {
      title,
      summary,
      skills,
      description,
      link
    } = req.body;

    // Find project
    const project = await Project.findById(id);
    if (!project) {
      return ResourceNotFound(res, 'Project');
    }

    // Check ownership
    if (project.userId.toString() !== req.user._id.toString()) {
      return AuthError(res, 'Not authorized to update this project');
    }

    // Update project
    
    const updatedProject = await Project.findByIdAndUpdate(
      project._id,
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

    return SuccessResponse(res, 'Project updated successfully', { project: updatedProject });
  } catch (error) {
    return ServerError(res, 'Server error during project update');
  }
};

// @desc    Delete project
// @route   DELETE /project/delete/:id
// @access  Private
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) {
      return ResourceNotFound(res, 'Project');
    }

    // Check ownership
    if (project.userId.toString() !== req.user._id.toString()) {
      return AuthError(res, 'Not authorized to delete this project');
    }

    await Project.findByIdAndDelete(id);

    return SuccessResponse(res, 'Project deleted successfully');
  } catch (error) {
    return ServerError(res, 'Server error during project deletion');
  }
};

// @desc    Get projects by user ID
// @route   GET /project/:userId
// @access  Public
const getProjectsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const projects = await Project.find({ userId })
      .sort({ createdAt: -1 });

    return SuccessResponse(res, 'Projects retrieved successfully', { projects, count: projects.length });
  } catch (error) {
    return ServerError(res, 'Server error while fetching projects');
  }
};

// @desc    Get all projects (admin only)
// @route   GET /projects
// @access  Private/Admin
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('userId', 'fullName email isBlocked')
      .sort({ createdAt: -1 });

    return SuccessResponse(res, 'Projects retrieved successfully', { projects, count: projects.length });
  } catch (error) {
    return ServerError(res, 'Server error while fetching projects');
  }
};

export {
  createProject,
  getMyProjects,
  updateProject,
  deleteProject,
  getProjectsByUser,
  getAllProjects
};