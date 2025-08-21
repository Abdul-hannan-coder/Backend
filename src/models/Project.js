
import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true
  },
  summary: {
    type: String,
    required: [true, 'Project summary is required'],
    trim: true,
    validate: {
      validator: function(v) {
        return v.split(' ').length <= 15;
      },
      message: 'Summary must be 15 words or less'
    }
  },
  skills: [{
    type: String,
    trim: true
  }],
  description: {
    type: String,
    required: [true, 'Project description is required'],
    trim: true
  },
  link: {
    type: String,
    trim: true
  },
  thumbnail: {
    type: String, // Cloudinary URL
    required: [true, 'Project thumbnail is required']
  },
  images: [{
    type: String // Cloudinary URLs (max 3)
  }]
}, {
  timestamps: true
});

// Validate max 3 images
projectSchema.pre('save', function(next) {
  if (this.images && this.images.length > 3) {
    return next(new Error('Maximum 3 images allowed per project'));
  }
  next();
});

export default mongoose.model('Project', projectSchema);
