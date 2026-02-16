import express from 'express';
import { getAllExistingUser, getUser, getUserProfile, loginUser, updateUserName, verifyUser } from '../controllers/user.controller.js';
import { userAuth } from '../middlewares/userAuth.middleware.js';

const userRouter =express.Router();


userRouter.post('/login',loginUser)
userRouter.post('/verify',verifyUser)
userRouter.get('/profile',userAuth,getUserProfile)
userRouter.get('/all/users',userAuth,getAllExistingUser);
userRouter.get('/user/:id',getUser);
userRouter.post('/update/name',userAuth,updateUserName);



export default userRouter;