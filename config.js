import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

export const config = {
  // Server Configuration
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // MongoDB Configuration
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://fahaddb:o7ffIwy1czoYwliW@cluster0.fvflzhn.mongodb.net/discord_learning_community',
  
  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  
  // Cloudinary Configuration
  CLOUDINARY_URL: process.env.CLOUDINARY_URL || 'cloudinary://494861241695638:4PXIVQ5y4rvrx2caFGRX_ydtkIS8@dhvk1yovx',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || 'dhvk1yovx',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '494861241695638',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '4PXIVQ5y4rvrx2caFGRX_ydtkIS8',
  
  // Email Configuration (Gmail)
  EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
  EMAIL_PORT: process.env.EMAIL_PORT || 587,
  EMAIL_USER: process.env.EMAIL_USER || 'pythonfor18@gmail.com',
  EMAIL_PASS: process.env.EMAIL_PASS || 'nhzmmwanlvzyhngr',
  EMAIL_FROM: process.env.EMAIL_FROM || 'pythonfor18@gmail.com',
  
  // Frontend URL for email verification
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  
  // Admin credentials
  ADMIN_EMAIL: 'admin123@gmail.com',
  ADMIN_PASSWORD: 'admin123'
};
