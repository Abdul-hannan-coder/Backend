# Portfolio Management System

A full-stack portfolio management system with user authentication (OTP), profile & project management, and a super admin dashboard for monitoring and controlling users and their projects.

## 🚀 Features

- **User Authentication**: OTP-based email verification, JWT tokens
- **User Management**: Registration, login, password reset
- **Profile Management**: Professional profiles with skills, experience, and social links
- **Project Showcase**: Portfolio projects with images and descriptions
- **Admin Panel**: Super admin dashboard for user and project management
- **Image Upload**: Cloudinary integration for profile and project images
- **Email Service**: Nodemailer for OTP and password reset emails

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js**
- **MongoDB** with **Mongoose**
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Cloudinary** for image storage
- **Nodemailer** for email services
- **Multer** for file uploads

### Frontend
- **Next.js 14** with **TypeScript**
- **Tailwind CSS** for styling
- **React Hook Form** for form handling
- **Axios** for API calls

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB database
- Cloudinary account
- Gmail account for email services

## 🚀 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd Team-project-website
```

### 2. Install backend dependencies
```bash
npm install
```

### 3. Install frontend dependencies
```bash
cd frontend
npm install
cd ..
```

### 4. Environment Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

# Cloudinary Configuration
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=your_email@gmail.com

# Frontend URL for email verification
FRONTEND_URL=http://localhost:3000
```

### 5. Setup Admin User

Run the admin setup script:

```bash
node setup-admin.js
```

This will create an admin user with:
- Email: `admin123@gmail.com`
- Password: `admin123`

### 6. Start the Application

#### Start Backend Server
```bash
npm run dev
```

#### Start Frontend (in a new terminal)
```bash
cd frontend
npm run dev
```

## 🌐 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/verify-otp` - OTP verification
- `POST /auth/resend-otp` - Resend OTP
- `POST /auth/login` - User login
- `POST /auth/admin-login` - Admin login
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password/:token` - Reset password
- `GET /auth/verify-user` - Verify JWT token

### Profiles
- `POST /profile/add` - Create profile
- `GET /profile/me` - Get own profile
- `PUT /profile/update/:id` - Update profile
- `GET /profile/:userId` - Get profile by user ID
- `GET /profiles` - Get all profiles (admin only)
- `DELETE /profile/delete/:id` - Delete profile (admin only)

### Projects
- `POST /project/add` - Create project
- `GET /project/me` - Get own projects
- `PUT /project/update/:id` - Update project
- `DELETE /project/delete/:id` - Delete project
- `GET /project/:userId` - Get projects by user ID
- `GET /projects` - Get all projects (admin only)

### Admin
- `GET /admin/users` - Get all users
- `PUT /admin/block/:userId` - Block user
- `PUT /admin/unblock/:userId` - Unblock user
- `DELETE /admin/delete-user/:id` - Delete user
- `PUT /admin/update-project/:id` - Update any project
- `DELETE /admin/delete-project/:id` - Delete any project
- `GET /admin/dashboard` - Get dashboard stats

## 🎯 User Roles

### Regular User
- Register and verify email with OTP
- Create and manage professional profile
- Add and showcase portfolio projects
- Access personal dashboard

### Admin
- Access super admin dashboard
- View all users and projects
- Block/unblock users
- Delete users and projects
- Monitor system statistics

## 📱 Frontend Pages

- **Home** (`/`) - Landing page with features
- **Login** (`/login`) - User and admin login
- **Register** (`/register`) - User registration with OTP
- **Dashboard** (`/dashboard`) - User dashboard
- **Admin** (`/admin`) - Admin dashboard

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- OTP email verification
- Role-based access control
- Input validation and sanitization
- File upload restrictions

## 📧 Email Features

- OTP verification emails
- Password reset emails
- Welcome emails after verification
- Professional HTML email templates

## 🖼️ Image Management

- Profile image uploads
- Project thumbnail uploads
- Multiple project images (max 3)
- Certificate uploads
- Cloudinary integration with optimization

## 🚀 Deployment

### Backend Deployment
1. Set environment variables
2. Build and start the server
3. Ensure MongoDB connection
4. Configure CORS for frontend domain

### Frontend Deployment
1. Build the Next.js application
2. Deploy to Vercel, Netlify, or similar
3. Update `FRONTEND_URL` in backend environment

## 📝 Database Schema

### User
- Basic info (name, email, password)
- Role (user/admin)
- Verification status
- Account status (blocked/active)

### Profile
- Professional information
- Skills and experience
- Social media links
- Profile and certificate images

### Project
- Project details and description
- Skills used
- Images and thumbnail
- Live project links

### OTP
- Temporary verification codes
- Automatic expiration (10 minutes)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

## 🔄 Updates

Stay updated with the latest features and improvements by:
- Watching the repository
- Checking release notes
- Following the development roadmap

---

**Happy Coding! 🎉**
