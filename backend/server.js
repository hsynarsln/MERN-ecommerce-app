import dotenv from 'dotenv';
import app from './app.js';
import connectDatabase from './config/database.js';

//! Config
dotenv.config({ path: 'backend/config/config.env' });

//! connection database
connectDatabase();

app.listen(process.env.PORT, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`);
});
