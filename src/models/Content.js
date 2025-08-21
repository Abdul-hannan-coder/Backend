import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  coursolimages: {
    type: [String], // Array of image links
    validate: {
      validator: function (arr) {
        return arr.length === 3; // must have exactly 3 links
      },
      message: 'Exactly 3 images are required for the carousel.'
    },
    required: true
  },
  categories: [
    {
      title: {
        type: String,
        required: [true, 'Category title is required'],
        trim: true
      },
      liveLink: {
        type: String,
        required: [true, 'Live link is required'],
        trim: true
      }, 
      image: {
        type: String, // Cloudinary URL
        required: [true, 'Category image is required']
      }
    }
  ]
});

const ContentModel = mongoose.model('Content', contentSchema);
export default ContentModel;
