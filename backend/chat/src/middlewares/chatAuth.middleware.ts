import type { NextFunction,Response,Request } from "express";
import type { IChat } from "../models/chat.model.js";
import jwt, { type JwtPayload } from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
    user?:IChat|null;
}

export const chatAuth= async(req:AuthenticatedRequest,res:Response,next:NextFunction)
 : Promise<void>=>{
    try {
        const header = req.headers.authorization;

        if(!header || !header.startsWith('Bearer ')){
             res.status(401).json({message:'Unauthorized - Token'})
             return;
        }

        const token = header.split(' ')[1];

        const decoded = jwt.verify(token,process.env.JWT_SECRET as string) as JwtPayload;

        if(!decoded){
             res.status(401).json({message:'Unauthorized - Invalid Token'})
             return;
        }
        req.user = decoded as IChat;
        next();
    } catch (error) {
        res.status(401).json({message:'JWT - Invalid Token'});
    }
}