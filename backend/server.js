import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
import app from './app.js';
import connectDatabase from './config/database.js';

//! Handled uncaught exception
process.on('uncaughtException', err => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to uncaught Exception`);

  process.exit(1);
});

//! Config
dotenv.config({ path: 'backend/config/config.env' });

//! connection database
connectDatabase();
//! image upload
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`);
});

//! unhandled promise rejection
process.on('unhandledRejection', error => {
  console.log(`Error: ${error.message}`);
  console.log(`Shutting down the server due to unhandled promise rejection`);

  server.close(() => {
    process.exit(1);
  });
});
