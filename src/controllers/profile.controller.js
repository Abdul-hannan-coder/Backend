


import User from '../models/User.js';
import {
  ServerError,
  ValidationErrorResponse,
  ClientError,
  ResourceNotFound,
  SuccessResponse,
  CreatedResponse
} from '../utils/helperFunctions.js';

// @desc    Create/Update user profile
// @route   POST /profile/add/:userID
// @access  Private
const createProfile = async (req, res) => {
  const userID = req.params.userID;
  console.log('Received req.body:', req.body);
  console.log('Received req.files:', req.files);
  try {
    const {
      profession,
      skills,
      description,
      yearsOfExperience,
      linkedin,
      github,
      fiverr,
      whatsapp
    } = req.body;

    // Find the user
    const user = await User.findById(userID);
    if (!user) {
      return ResourceNotFound(res, 'User');
    }

    console.log('User before update isProfileComplete:', user.isProfileComplete);
    console.log('User before update Profile:', user.Profile);

    // Check if profile already exists
    if (user.Profile && Object.keys(user.Profile).length > 0) {
      return ClientError(res, 'Profile already exists for this user. Use the update endpoint.');
    }

    // Validate and process skills
    const processedSkills = skills ? skills.split(',').map(skill => skill.trim()) : [];

    // Process file uploads
    const certificates = req.files?.certificates?.map(file => file.path) || [];
    const profileImage = req.files?.profileImage?.[0]?.path || null;

    // Create profile object
    const profileData = {
      profession,
      skills: processedSkills,
      description,
      yearsOfExperience,
      linkedin,
      github,
      fiverr,
      whatsapp,
      certificates,
      profileImage,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Update user with profile data
    console.log('About to update user with isProfileComplete: true');
    
    // Try using save() method instead of findByIdAndUpdate
    user.Profile = profileData;
    user.isProfileComplete = true;
    user.markModified('Profile'); // Explicitly mark Profile as modified
    user.markModified('isProfileComplete'); // Explicitly mark isProfileComplete as modified
    
    const updatedUser = await user.save();
    
    // Remove password from response
    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    console.log('Updated user isProfileComplete:', userResponse.isProfileComplete);
    console.log('Full updated user:', JSON.stringify(userResponse, null, 2));

    console.log('Profile created for user:', userResponse.fullName);
    return CreatedResponse(res, 'Profile created successfully', {
      user: userResponse,
      profile: userResponse.Profile
    });

  } catch (error) {
    console.error('Error during profile creation:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return ValidationErrorResponse(res, validationErrors);
    }

    return ServerError(res, 'Server error during profile creation');
  }
};

// @desc    Get a user's profile
// @route   GET /profile/:userID
// @access  Public
const getProfileByUser = async (req, res) => {
  try {
    const { userID } = req.params;

    const user = await User.findById(userID).select('-password').lean();

    if (!user) {
      return ResourceNotFound(res, 'User');
    }

    if (!user.Profile || Object.keys(user.Profile).length === 0) {
      return ResourceNotFound(res, 'Profile');
    }

    return SuccessResponse(res, 'Profile retrieved successfully', {
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        isBlocked: user.isBlocked,
        isProfileComplete: user.isProfileComplete
      },
      profile: user.Profile
    });

  } catch (error) {
    console.error('Error fetching profile:', error);
    return ServerError(res, 'Server error while fetching profile');
  }
};

// @desc    Update a user's profile
// @route   PUT /profile/update/:userID
// @access  Private
// const updateProfile = async (req, res) => {
//   try {
//     const { userID } = req.params;
//     const {
//       profession,
//       skills,
//       description,
//       yearsOfExperience,
//       linkedin,
//       github,
//       fiverr,
//       whatsapp
//     } = req.body;

//     // Find the user
//     const user = await User.findById(userID);
//     if (!user) {
//       return ResourceNotFound(res, 'User');
//     }

//     // Ensure the user has an existing profile to update
//     if (!user.Profile) {
//       return ResourceNotFound(res, 'Profile not found. Please create one first.');
//     }

//     // Prepare the update object
//     const updateFields = {
//       ...(profession && { 'Profile.profession': profession }),
//       ...(skills && { 'Profile.skills': skills.split(',').map(skill => skill.trim()) }),
//       ...(description && { 'Profile.description': description }),
//       ...(yearsOfExperience && { 'Profile.yearsOfExperience': yearsOfExperience }),
//       ...(linkedin && { 'Profile.linkedin': linkedin }),
//       ...(github && { 'Profile.github': github }),
//       ...(fiverr && { 'Profile.fiverr': fiverr }),
//       ...(whatsapp && { 'Profile.whatsapp': whatsapp }),
//       'Profile.updatedAt': new Date()
//     };
    
//     // Update user profile
//     const updatedUser = await User.findByIdAndUpdate(
//       userID,
//       { $set: updateFields },
//       { new: true, runValidators: true }
//     ).select('-password');

//     return SuccessResponse(res, 'Profile updated successfully', {
//       user: updatedUser,
//       profile: updatedUser.Profile
//     });

//   } catch (error) {
//     console.error('Error updating profile:', error);
//     if (error.name === 'ValidationError') {
//       const validationErrors = Object.values(error.errors).map(err => err.message);
//       return ValidationErrorResponse(res, validationErrors);
//     }
//     return ServerError(res, 'Server error during profile update');
//   }
// };
const updateProfile = async (req, res) => {
  try {
    const { userID } = req.params;
    console.log('Update - Received req.body:', req.body);
    console.log('Update - Received req.files:', req.files);
    
    const {
      profession,
      skills,
      description,
      yearsOfExperience,
      linkedin,
      github,
      fiverr,
      whatsapp
    } = req.body;

    // Find the user
    const user = await User.findById(userID);
    if (!user) {
      return ResourceNotFound(res, 'User');
    }

    // Ensure the user has an existing profile to update
    if (!user.Profile) {
      return ResourceNotFound(res, 'Profile not found. Please create one first.');
    }

    // Process file uploads
    const newCertificates = req.files?.certificates?.map(file => file.path) || [];
    const newProfileImage = req.files?.profileImage?.[0]?.path || null;
    
    console.log('🖼️ New profile image:', newProfileImage);
    console.log('📜 New certificates:', newCertificates);

    // Prepare the update object
    const updateFields = {
      ...(profession && { 'Profile.profession': profession }),
      ...(skills && { 'Profile.skills': skills.split(',').map(skill => skill.trim()) }),
      ...(description && { 'Profile.description': description }),
      ...(yearsOfExperience && { 'Profile.yearsOfExperience': yearsOfExperience }),
      ...(linkedin && { 'Profile.linkedin': linkedin }),
      ...(github && { 'Profile.github': github }),
      ...(fiverr && { 'Profile.fiverr': fiverr }),
      ...(whatsapp && { 'Profile.whatsapp': whatsapp }),
      'Profile.updatedAt': new Date()
    };

    // Handle file updates
    if (newProfileImage) {
      updateFields['Profile.profileImage'] = newProfileImage;
      console.log('✅ Setting new profile image:', newProfileImage);
    }

    if (newCertificates.length > 0) {
      updateFields['Profile.certificates'] = newCertificates;
      console.log('✅ Setting new certificates:', newCertificates);
    }

    // ✅ ADD THIS: Check if profile is now complete after updates
    const currentProfile = user.Profile;
    const updatedProfile = {
      profession: profession || currentProfile.profession,
      skills: skills ? skills.split(',').map(skill => skill.trim()) : currentProfile.skills,
      description: description || currentProfile.description,
      yearsOfExperience: yearsOfExperience || currentProfile.yearsOfExperience,
      linkedin: linkedin || currentProfile.linkedin,
      github: github || currentProfile.github,
      fiverr: fiverr || currentProfile.fiverr,
      whatsapp: whatsapp || currentProfile.whatsapp,
      profileImage: newProfileImage || currentProfile.profileImage,
      certificates: newCertificates.length > 0 ? newCertificates : currentProfile.certificates
    };

    // ✅ Profile completion logic (same as frontend)
    const isProfileComplete = !!(
      updatedProfile.profession && updatedProfile.profession.trim() !== '' &&
      updatedProfile.skills && (
        (Array.isArray(updatedProfile.skills) && updatedProfile.skills.length > 0) ||
        (typeof updatedProfile.skills === 'string' && updatedProfile.skills.trim() !== '')
      ) &&
      updatedProfile.description && updatedProfile.description.trim() !== ''
    );

    console.log('🔍 Profile completion check:');
    console.log('- Profession:', updatedProfile.profession);
    console.log('- Skills:', updatedProfile.skills);
    console.log('- Description:', updatedProfile.description);
    console.log('- Is Complete:', isProfileComplete);

    // ✅ Update isProfileComplete if it changed
    if (user.isProfileComplete !== isProfileComplete) {
      updateFields['isProfileComplete'] = isProfileComplete;
      console.log(`📝 Updating isProfileComplete: ${user.isProfileComplete} → ${isProfileComplete}`);
    }
    
    console.log('📝 Update fields being applied:', updateFields);
    
    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      userID,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-password');

    console.log('✅ Updated user profile image:', updatedUser.Profile.profileImage);
    console.log('✅ Updated user certificates:', updatedUser.Profile.certificates);
    console.log('✅ Updated user isProfileComplete:', updatedUser.isProfileComplete);

    return SuccessResponse(res, 'Profile updated successfully', {
      user: updatedUser,
      profile: updatedUser.Profile
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return ValidationErrorResponse(res, validationErrors);
    }
    return ServerError(res, 'Server error during profile update');
  }
};

// @desc    Get all profiles (admin only)
// @route   GET /profiles
// @access  Private/Admin
const getAllProfiles = async (req, res) => {
  try {
    const profiles = await User.find({ 'Profile.profession': { $exists: true } })
      .select('fullName email isBlocked isProfileComplete Profile')
      .sort({ createdAt: -1 })
      .lean();

    return SuccessResponse(res, 'Profiles retrieved successfully', {
      profiles,
      count: profiles.length
    });
  } catch (error) {
    console.error('Error fetching all profiles:', error);
    return ServerError(res, 'Server error while fetching profiles');
  }
};

// @desc    Delete profile (admin only)
// @route   DELETE /profile/delete/:userID
// @access  Private/Admin
const deleteProfile = async (req, res) => {
  try {
    const { userID } = req.params;

    const user = await User.findById(userID);
    if (!user) {
      return ResourceNotFound(res, 'User');
    }

    // Use $unset to remove the entire Profile subdocument
    await User.findByIdAndUpdate(
      userID,
      {
        $unset: { Profile: 1 },
        isProfileComplete: false
      },
      { new: true }
    );

    return SuccessResponse(res, 'Profile deleted successfully');
  } catch (error) {
    console.error('Error deleting profile:', error);
    return ServerError(res, 'Server error during profile deletion');
  }
};

// @desc    Update certificates only
// @route   PUT /profile/update-certificates/:userID
// @access  Private
const updateCertificates = async (req, res) => {
  try {
    const { userID } = req.params;

    if (!req.files || req.files.length === 0) {
      return ClientError(res, 'At least one certificate file is required');
    }

    const user = await User.findById(userID);
    if (!user) {
      return ResourceNotFound(res, 'User');
    }

    if (!user.Profile) {
      return ResourceNotFound(res, 'Profile');
    }

    const certificatePaths = req.files.map(file => file.path);
    const updatedUser = await User.findByIdAndUpdate(
      userID,
      {
        $set: {
          'Profile.certificates': certificatePaths,
          'Profile.updatedAt': new Date()
        }
      },
      { new: true, runValidators: true }
    ).select('-password');

    return SuccessResponse(res, 'Profile certificates updated successfully', {
      certificates: certificatePaths,
      profile: updatedUser.Profile
    });

  } catch (error) {
    console.error('Error updating certificates:', error);
    return ServerError(res, 'Server error during profile certificates update');
  }
};

// @desc    Update profile image only
// @route   PUT /profile/update-image/:userID
// @access  Private
const updateProfileImage = async (req, res) => {
  try {
    const { userID } = req.params;
    
    if (!req.file) {
      return ClientError(res, 'Profile image is required');
    }

    const user = await User.findById(userID);
    if (!user) {
      return ResourceNotFound(res, 'User');
    }

    if (!user.Profile) {
      return ResourceNotFound(res, 'Profile');
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      userID,
      {
        $set: {
          'Profile.profileImage': req.file.path,
          'Profile.updatedAt': new Date()
        }
      },
      { new: true, runValidators: true }
    ).select('-password');

    return SuccessResponse(res, 'Profile image updated successfully', {
      profileImage: req.file.path,
      profile: updatedUser.Profile
    });

  } catch (error) {
    console.error('Error updating profile image:', error);
    return ServerError(res, 'Server error during profile image update');
  }
};

export {
  createProfile,
  getProfileByUser, // This single endpoint replaces getMyProfile and getProfileByUser.
  updateProfile,
  getAllProfiles,
  deleteProfile,
  updateCertificates,
  updateProfileImage
};