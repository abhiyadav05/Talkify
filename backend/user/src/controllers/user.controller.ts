import type { Request, RequestHandler, Response } from "express";
import redis from "../config/redis.js";
import { publishToQueue } from "../config/rabbitMQ.js";
import User from "../models/user.model.js";
import { generateToken } from "../config/jwtToken.js";


export const loginUser = async (req : Request,res : Response)=>{

    try {
        const {email}=req.body;

        const rateLimitKey=`otp:ratelimit:${email}`;
        const rateLimit=await redis.get(rateLimitKey);

        if(rateLimit){
            res.status(429).json({
                message : "To many request ...."
            })
            return ;
        }

        const otp=Math.floor(100000+Math.random()*900000);

        await redis.set(`otp:${email}`,otp,{
            ex : 300,
        })

        await redis.set(`otp:{rateLimit}`,"true",{
            ex:60,
        })

        const message={
            to : email,
            subject : "Your otp code..",
            body : `Your opt code is ${otp} and it is valid for 5 minutes..`
        }

        await publishToQueue("send-otp",message);

        res.status(200).json({
            message : "Your otp send successfully..."
        })

    } catch (error) {
        
    }
}

export const verifyUser= async (req : Request,res : Response)=>{
      
    try {
        const {otp,email}=req.body;

    if(!otp || !email ){
        res.status(400).json({
            messsage : "Please enter otp or email ..."
        })
        return ;
    }
    console.log(otp);

    const otpKey= `otp:${email}`
    const realOtp= await redis.get(otpKey);
    console.log(realOtp);
    if(!realOtp || realOtp.toString()!==otp.toString()){
        res.status(400).json({
            message : "Your otp is not match .. "
        })
        return;
    }

    await redis.del(otpKey);

    let user = await User.findOne({email});

    if(!user){
        const name = email.slice(0,7);
        user = await User.create({
            name,
            email
        })
    }

    const token=generateToken(user);
    
    res.status(200).json({
        message : "User verified successfull..",
        user,
        token
    })


    } catch (error) {
        console.log("something is wrong in verifyUser...")
    }

}