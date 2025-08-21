import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// Load environment variables
dotenv.config();
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import mongoose from 'mongoose';
import connectDB from './config/database.js';
import notFound from './middlewares/notFound.js';
import errorHandler from './middlewares/errorHandler.js';
import authRoutes from './routes/auth.routes.js';
import profileRoutes from './routes/profile.routes.js';
import projectRoutes from './routes/project.routes.js';
import adminRoutes from './routes/admin.routes.js';
import homeRoutes from './routes/home.routes.js';
import commentRoutes from './routes/comment.routes.js';
import morgan from 'morgan';




// Connect to database
connectDB().catch(() => {});

const app = express();
app.use(morgan('dev'));

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Community Learning Platform API',
      version: '1.0.0',
      description: 'A comprehensive API for managing community-driven learning platform, user profiles, and learning projects',
      contact: {
        name: 'Community Learning Platform Team',
        email: 'support@communitylearning.com'
      },
      servers: [
        {
          url: `http://localhost:${process.env.PORT || 5000}`,
          description: 'Development server'
        }
      ]
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.js', './src/models/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000'
];

// app.use(cors({
//   origin: function (origin, callback) {
//     // Allow requests with no origin (like curl or mobile apps)
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.includes(origin)) return callback(null, true);
//     return callback(new Error('Not allowed by CORS'));
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));
// // app.use(cors());

// //Explicitly handle preflight
// app.options('*', cors({
//   origin: allowedOrigins,
//   credentials: true
// }));

// app.use(cors({
//   origin:"*",
//   credentials: true
// }))
// app.use(cors({
//   origin: "http://localhost:5173", // your Vite frontend
//   credentials: true
// }));


app.use(cors())
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/project', projectRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/comment', commentRoutes);
app.use('/api/v1/home', homeRoutes);



// Health check
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Portfolio System API is running',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.get('/check', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the Community Learning Platform API',
    documentation: 'Visit /api-docs for API documentation'
  });
});





// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

// Global error handler for multipart issues
app.use((error, req, res, next) => {
  if (error.message?.includes('Unexpected end of form')) {
    return next();
  }
  
  if (error.message?.includes('Multipart')) {
    return res.status(400).json({
      success: false,
      message: 'File upload error',
      error: 'Invalid form data'
    });
  }
  
  next(error);
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API documentation available at http://localhost:${PORT}/api-docs`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  server.close(() => process.exit(1));
});