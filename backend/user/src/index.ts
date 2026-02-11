import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

// connection of the database will be here
import connectDB from './config/db.js';
connectDB();


const app = express();

const PORT = 3001;

app.listen(PORT ,()=>{
    console.log(`Server is running on port ${PORT}`);
})