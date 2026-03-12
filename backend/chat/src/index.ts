import express from 'express';
import dotenv from 'dotenv';
import chatRouter from './routes/chat.route.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;
app.use(express.json());


// connection to database
import connectDB from './config/db.js';
connectDB();

// routes
app.use('/api/v1', chatRouter);


app.listen(PORT, () => {
  console.log(`Chat service is running on port ${PORT}`);
});