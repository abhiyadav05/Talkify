import express from 'express'
import dotenv from 'dotenv'
import { startSendOtp } from './consumer.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

//  this is for starting the rabbitmq for the sending the otp 
startSendOtp();


app.listen(PORT, () => {
    console.log(`Mail service is running on port ${PORT}`);
    
});