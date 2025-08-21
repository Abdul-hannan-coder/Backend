import mongoose from 'mongoose';
const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  profession: {
    type: String,
    enum: [
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'Software Engineer',
  'Mobile App Developer (iOS/Android)',
  'DevOps Engineer',
  'Cloud Engineer',
  'Site Reliability Engineer (SRE)',
  'Automation Engineer',
  'UI/UX Designer',
  'Product Designer',
  'UX Researcher',
  

  
  'WordPress Designer',
  'WordPress Administrator',
  'Digital Marketing Specialist',
  'Content Strategist',
  'SEO Specialist',
  'SEM Specialist',
  'Social Media Manager',
  'Email Marketing Specialist',
  'Marketing Analyst',
  'Data Scientist',
  'Data Analyst',
  'Machine Learning Engineer',
  'AI Engineer',
  'Cybersecurity Analyst',
  'Network Engineer',
  'Database Administrator',
  'QA Engineer',
  'Manual Tester',
  'Automation Tester',
  'Technical Writer',
  'IT Support Specialist',
  'Business Analyst',
  'Technical Project Manager',
  'Scrum Master',
  'Solutions Architect',
  'AI Engineer',
  'Blockchain Developer',
  'Game Developer',
  'AR/VR Developer',
  'Robotics Engineer',
  'Systems Analyst',
],
    required: [true, 'Profession is required']
  },
  skills: [{
    type: String,
    trim: true
  }],
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  yearsOfExperience: {
    type: Number,
    required: [true, 'Years of experience is required'],
    min: [0, 'Experience cannot be negative']
  },
  linkedin: {
    type: String,
    required: [true, 'LinkedIn profile is required'],
    trim: true
  },
  github: {
    type: String,
    trim: true
  },
  fiverr: {
    type: String,
    trim: true
  },
  whatsapp: {
    type: String,
    trim: true
  },
  certificates: [{
    type: String // Cloudinary URLs
  }],
  profileImage: {
    type: String // Cloudinary URL
  }
}, {
  timestamps: true
});

export default mongoose.model('Profile', profileSchema);
