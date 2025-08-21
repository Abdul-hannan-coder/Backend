import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI).then(() => {
      console.log('MongoDB connected successfully')
      })  ;
  } catch (error) {
    process.exit(1);
  }
};

export default connectDB;