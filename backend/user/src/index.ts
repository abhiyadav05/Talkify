import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

// connection of the rabbitMQ will be here
import connectToRabbitMQ from './config/rabbitMQ.js';
connectToRabbitMQ();
// connection of the database will be here
import connectDB from './config/db.js';
connectDB();


const app = express();

// redis connection will be here
import redis from './config/redis.js';

app.get('/redis-health', async (req,res)=>{
    try {
         await redis.ping();
        console.log("❤️ Redis is healthy!");

    } catch (error) {
        console.error("Error checking Redis health:", error);
    }
})

const PORT = 3001;

app.listen(PORT ,()=>{
    console.log(`Server is running on port ${PORT}`);
})