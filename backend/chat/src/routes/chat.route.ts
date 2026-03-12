import express from 'express';
import { chatAuth } from '../middlewares/chatAuth.middleware.js';
import { createNewChat } from '../controllers/chat.controller.js';

const chatRouter = express.Router();


chatRouter.post('/chat/new',chatAuth,createNewChat);

export default chatRouter;