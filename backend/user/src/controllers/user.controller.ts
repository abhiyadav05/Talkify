import type { Request, RequestHandler, Response } from "express";
import redis from "../config/redis.js";
import { publishToQueue } from "../config/rabbitMQ.js";
import User from "../models/user.model.js";
import { generateToken } from "../config/jwtToken.js";
import type { AuthenticatedRequest } from "../middlewares/userAuth.middleware.js";


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

export const getUserProfile = async (req : AuthenticatedRequest,res:Response)=>{
    const user = req.user;

    if(!user){
        res.status(404).json({
            message : "User not found.."
        })
        return ;
    }
    res.json(user);
}

export const updateUserName= async (req : AuthenticatedRequest,res:Response)=>{

    try {
        const user = await User.findById(req.user?._id);

        if(!user){
            res.status(404).json({
                message : "User not found.."
            })
            return ;
        }
        user.name = req.body.name;
        await user.save();

        const token=generateToken(user);
        res.status(200).json({
            message : "User name updated successfully..",
            user,
            token
        })
    } catch (error) {
        console.log("something is wrong in updateUserName...", error)
    }
}

export const getAllExistingUser= async(req : Request, res: Response)=>{
    
    try {
        const users = await User.find();

        res.json(users);
    } catch (error) {
        
    }
}

export const getUser = async(req:Request,res:Response)=>{

    try {
        
        const userId=req.params.id;

        const user = await User.findById(userId);

        if(!user){
            res.status(404).json({
                message : "User not found.."
            })
            return ;
        }
        res.json(user);
    } catch (error) {
        console.log("something is wrong in getUser...", error)
    }
}