import express from 'express';
import { chatAuth } from '../middlewares/chatAuth.middleware.js';
import { createNewChat, getUserChats } from '../controllers/chat.controller.js';

const chatRouter = express.Router();


chatRouter.post('/chat/new',chatAuth,createNewChat);
chatRouter.get('/chat/all',chatAuth,getUserChats);

export default chatRouter;