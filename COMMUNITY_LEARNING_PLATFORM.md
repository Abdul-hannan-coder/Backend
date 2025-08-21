# Community-Driven Learning Platform

## 🔹 Project Overview
A full-stack community-driven learning platform management system with **user authentication (OTP)**, **profile & project management**, and a **super admin dashboard** for monitoring and controlling users and their learning projects.

- **Frontend**: Next.js  
- **Backend**: Node.js + Express  
- **Database**: MongoDB  
- **Storage**: Cloudinary (Images)  
- **Email**: Nodemailer (OTP & Reset Password)  
- **Testing**: Jest + Supertest + MongoDB Memory Server

---

## 🔹 User Roles
- **User** → Registers, verifies OTP, creates profile & learning projects.  
- **Admin** → Super Admin with full access to block/unblock users, delete projects, and update data.  

---

## 🔹 Database Schemas

### 1. **User Schema**
```js
User {
  _id: ObjectId,
  fullName: String,
  email: String,
  password: String (hashed),
  role: { type: String, enum: ["user", "admin"], default: "user" },
  isVerified: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  createdAt: Date,
  updatedAt: Date
}
```

---

### 2. **Profile Schema**
```js
Profile {
  _id: ObjectId,
  userId: ObjectId (ref: User),
  profession: { type: String, enum: ["Full Stack Developer", "Frontend Developer", "Figma Developer"] },
  skills: [String],
  description: String,
  yearsOfExperience: Number,
  linkedin: String,
  github: String,
  fiverr: String,
  whatsapp: String,
  certificates: [String], // Cloudinary URLs
  profileImage: String,   // Cloudinary URL
  createdAt: Date,
  updatedAt: Date
}
```

---

### 3. **Project Schema**
```js
Project {
  _id: ObjectId,
  userId: ObjectId (ref: User),
  title: String,
  summary: String, // 15 words only
  skills: [String], // comma separated → array
  description: String,
  link: String,
  thumbnail: String, // Cloudinary
  images: [String], // Cloudinary (max 3)
  createdAt: Date,
  updatedAt: Date
}
```

---

### 4. **OTP Schema**
```js
Otp {
  _id: ObjectId,
  userId: ObjectId (ref: User),
  code: String,
  expiresAt: Date,
  createdAt: Date
}
```

---

## 🔹 Authentication Flow

1. **Register User** → Save in DB (unverified), send OTP via Nodemailer.  
2. **Verify OTP** → Validate code, mark user as verified.  
3. **Login** → JWT token generated.  
4. **Admin Login** → Only role: "admin".  
5. **Forgot Password** → Send reset link via email.  
6. **Reset Password** → Update password using token.  

---

## 🔹 API Routes

### 1. **Auth Routes**
```
POST   /auth/register           → Register user
POST   /auth/login              → Login user
POST   /auth/admin-login        → Admin login
POST   /auth/verify-otp         → Verify OTP
POST   /auth/resend-otp         → Resend OTP
POST   /auth/forgot-password    → Request reset link
POST   /auth/reset-password/:t  → Reset password
GET    /auth/verify-user        → Verify JWT + get user info
```

---

### 2. **Profile Routes**
```
POST   /profile/add             → Create profile (user only)
GET    /profile/me              → Get own profile
PUT    /profile/update/:id      → Update profile
GET    /profile/:userId         → Get profile by user
GET    /profiles                → Get all profiles (admin only)
DELETE /profile/delete/:id      → Delete profile (admin only)
```

---

### 3. **Project Routes**
```
POST   /project/add             → Add new project (user only)
GET    /project/me              → Get own projects
PUT    /project/update/:id      → Update project
DELETE /project/delete/:id      → Delete project
GET    /project/:userId         → Get projects by user
GET    /projects                → Get all projects (admin only)
```

---

### 4. **Admin Routes (Super Admin Panel)**
```
GET    /admin/users              → Get all users
PUT    /admin/block/:userId      → Block user
PUT    /admin/unblock/:userId    → Unblock user
DELETE /admin/delete-user/:id    → Delete user + profile + projects
PUT    /admin/update-project/:id → Update any project
DELETE /admin/delete-project/:id → Delete any project
GET    /admin/dashboard          → Get dashboard statistics
```

---

## 🔹 Image Handling (Cloudinary)
- **Profile Image** → single upload to `portfolio/profiles` folder
- **Certificates** → multiple uploads to `portfolio/certificates` folder (max 5)
- **Project Thumbnail** → single upload to `portfolio/projects/thumbnails` folder
- **Project Images** → max 3 uploads to `portfolio/projects/images` folder

### Cloudinary Features:
- Automatic image optimization and transformation
- Secure URL generation
- Folder organization for different content types
- File size limits (5MB per image)
- Supported formats: JPG, JPEG, PNG, GIF, WebP

---

## 🔹 Email Service (Community Learning Platform)
- **OTP Emails**: Welcome users to the learning community
- **Password Reset**: Secure password recovery
- **Branding**: All emails include community learning platform context
- **Templates**: Professional HTML email templates

---

## 🔹 Testing Suite

### Test Coverage
The platform includes comprehensive testing for all backend functionality:

#### 1. **Authentication Tests**
- User registration and OTP verification
- Login (user and admin)
- Password reset functionality
- JWT token validation

#### 2. **Profile Management Tests**
- Profile creation with image uploads
- Profile updates and image replacement
- Certificate management (multiple uploads)
- Profile retrieval and validation

#### 3. **Project Management Tests**
- Project creation with thumbnail and images
- Project updates with new images
- Image count validation (max 3 project images)
- Project CRUD operations

#### 4. **Admin Panel Tests**
- User management (block/unblock/delete)
- Project oversight and management
- Dashboard statistics
- Role-based access control

#### 5. **Cloudinary Integration Tests**
- Image upload validation
- File type and size restrictions
- Folder structure verification
- Error handling for upload failures

#### 6. **Email Service Tests**
- OTP email delivery
- Password reset emails
- Community platform branding
- Error handling for email failures

### Running Tests
```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run tests for CI/CD
npm run test:ci
```

### Test Environment
- **MongoDB**: In-memory database for testing
- **Cloudinary**: Mocked for consistent testing
- **Email**: Mocked to avoid sending actual emails
- **JWT**: Test-specific secret keys
- **File Uploads**: Simulated with buffer data

---

## 🔹 Middleware
- **authMiddleware** → Verify JWT  
- **roleMiddleware(["admin"])** → Restrict access for admin routes  
- **uploadMiddleware** → Handle file uploads to Cloudinary
- **errorHandler** → Centralized error handling
- **notFound** → 404 route handler

---

## 🔹 Tools & Libraries
- **bcrypt.js** → Password hashing  
- **jsonwebtoken (JWT)** → Auth tokens  
- **nodemailer** → OTP & password reset emails  
- **multer + multer-storage-cloudinary** → Image uploads  
- **mongoose** → MongoDB ORM  
- **jest** → Testing framework
- **supertest** → HTTP testing
- **mongodb-memory-server** → Test database

---

## 🔹 Environment Variables
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# JWT Configuration
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=7d

# Cloudinary Configuration
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com

# Frontend URL for email verification
FRONTEND_URL=http://localhost:3000
```

---

## 🔹 Getting Started

### Prerequisites
- Node.js >= 14.0.0
- MongoDB database
- Cloudinary account
- Gmail account with app password

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd community-learning-platform-backend

# Install dependencies
npm install

# Set up environment variables
cp env.example .env
# Edit .env with your configuration

# Run tests to verify setup
npm test

# Start development server
npm run dev

# Start production server
npm start
```

### API Documentation
- **Swagger UI**: Available at `/api-docs` when server is running
- **Health Check**: Available at `/health` endpoint
- **Base URL**: `http://localhost:5000/api/v1`

---

## 🔹 Community Learning Platform Features

### Learning Focus
- **Skill Development**: Users can showcase their learning journey
- **Project Portfolio**: Display learning projects and achievements
- **Community Building**: Connect learners and developers
- **Professional Growth**: Build professional profiles and networks

### Platform Benefits
- **Centralized Learning**: All learning resources in one place
- **Community Support**: Learn from and with other community members
- **Professional Development**: Build a portfolio for career advancement
- **Skill Validation**: Showcase real projects and achievements

---

## 🔹 Contributing
1. Fork the repository
2. Create a feature branch
3. Write tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

---

## 🔹 License
MIT License - see LICENSE file for details

---

## 🔹 Support
For support and questions:
- Email: support@communitylearning.com
- Documentation: Available at `/api-docs` endpoint
- Issues: Use GitHub issues for bug reports and feature requests
