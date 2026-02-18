import express from 'express';
import dotenv from 'dotenv';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

// connection to database
import connectDB from './config/db.js';
connectDB();
app.listen(PORT, () => {
  console.log(`Chat service is running on port ${PORT}`);
});