# community-driven learning platform

## 🔹 Project Overview
A full-stack  community-driven learning platform management system with **user authentication (OTP)**, **profile & project management**, and a **super admin dashboard** for monitoring and controlling users and their projects.

- **Frontend**: Next.js  
- **Backend**: Node.js + Express  
- **Database**: MongoDB  
- **Storage**: Cloudinary (Images)  
- **Email**: Nodemailer (OTP & Reset Password)  

---

## 🔹 User Roles
- **User** → Registers, verifies OTP, creates profile & projects.  
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
  certificates: [String], image  // Cloudinary URLs
  profileImage: String,  image // Cloudinary URL
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
  images: [String], atleast 3 image  // Cloudinary (max 3)
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
```

---

## 🔹 Image Handling (Cloudinary)
- **Profile Image** → single upload  
- **Certificates** → multiple uploads  
- **Project Thumbnail** → single upload  
- **Project Images** → max 3 uploads  

---

## 🔹 Middleware
- **authMiddleware** → Verify JWT  
- **roleMiddleware(["admin"])** → Restrict access for admin routes  

---

## 🔹 Tools & Libraries
- **bcrypt.js** → Password hashing  
- **jsonwebtoken (JWT)** → Auth tokens  
- **nodemailer** → OTP & password reset emails  
- **multer / multer-storage-cloudinary** → Image uploads  
- **mongoose** → MongoDB ORM  










# ENV

# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb+srv://fahaddb:o7ffIwy1czoYwliW@cluster0.fvflzhn.mongodb.net/discord_learning_community

# JWT Configuration
JWT_SECRET=fahad93&875$
JWT_EXPIRES_IN=7d

# Cloudinary Configuration
CLOUDINARY_URL=cloudinary://494861241695638:4PXIVQ5y4rvrx2caFGRX_ydtkIS8@dhvk1yovx
CLOUDINARY_CLOUD_NAME=dhvk1yovx
CLOUDINARY_API_KEY=494861241695638
CLOUDINARY_API_SECRET=4PXIVQ5y4rvrx2caFGRX_ydtkIS8

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=pythonfor18@gmail.com
EMAIL_PASS=nhzmmwanlvzyhngr
EMAIL_FROM=pythonfor18@gmail.com

# Frontend URL for email verification
FRONTEND_URL=http://localhost:3000


Frontend create in Nextjs ok

and backend create in node + express js use 

