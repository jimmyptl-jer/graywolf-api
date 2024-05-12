// server.js

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import serverless from "serverless-http";

import connectDB from './Config/db.js';
import authRoutes from './Routes/auth.route.js'
import contactRoutes from './Routes/contact.route.js';
import postRoutes from './Routes/post.route.js';
import projectRoutes from './Routes/project.route.js';
import cloudinaryConnect from './Config/cloudinary.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:5173", "https://jimmypatel.tech"],
    credentials: true,
  })
);

app.use('/api/contact', contactRoutes);
app.use('/api/post', postRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/auth', authRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    message: message,
    statusCode: statusCode,
  });
});

app.use('/', (req, res) => {
  res.send('Server is running');
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    await cloudinaryConnect();
    app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1); // Exit with non-zero status code to indicate failure
  }
};

// Export your Express app as a serverless function handler
export const handler = serverless(app);
