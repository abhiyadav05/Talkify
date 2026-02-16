import type { NextFunction,Response,Request } from "express";
import type { IUser } from "../models/user.model.js";
import jwt, { type JwtPayload } from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
    user?:IUser|null;
}

export const userAuth= async(req:AuthenticatedRequest,res:Response,next:NextFunction)
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
        req.user = decoded as IUser;
        next();
    } catch (error) {
        res.status(401).json({message:'JWT - Invalid Token'});
    }
}