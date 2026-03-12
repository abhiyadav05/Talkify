import axios from "axios";
import { chatAuth, type AuthenticatedRequest } from "../middlewares/chatAuth.middleware.js";
import { Chat } from "../models/chat.model.js";
import { Messages } from "../models/messages.js";


export const createNewChat = async (req : AuthenticatedRequest, res) => {
    try {
        const userId = req.user?._id;
        const {otherUserId} = req.body;
        if(!userId){
            return res.status(401).json({message: 'Unauthorized'});
        }
        if(!otherUserId){
            return res.status(400).json({message: 'Other user id is required'});
        }

        const existingChat= await Chat.findOne({
            users: { $all: [userId, otherUserId], $size: 2 }
        });

        if(existingChat){
            return res.status(200).json({message: 'Chat already exists', chatId: existingChat._id});
        }

        const newChat = await Chat.create({
            users: [userId, otherUserId],
        });

        res.status(201).json({message: 'Chat created successfully', chatId: newChat._id});

    }catch(error){
        res.status(500).json({message: 'Error creating new chat'});
    }
}

export const getUserChats = async (req : AuthenticatedRequest, res) => {
    try {
        const userId = req.user?._id;
        if(!userId){
            return res.status(401).json({message: 'Unauthorized'});
        }
        const chats = await Chat.find({users: userId}).sort({updatedAt: -1});

        const chatWithUserData= await Promise.all(chats.map(async (chat) => {
            const otherUserId = chat.users.find((id) => id.toString() !== userId.toString());
            
            const unseenCount = await Messages.countDocuments({
                chatId: chat._id,
                seen: false,
                sender: { $ne: userId }
            });

            try {
                const {data} = await axios.get(`${process.env.USER_SERVICE_URL}/api/v1/user/${otherUserId}`);

                return {
                    user : data,
                    chat : {
                        ...chat.toObject(),
                        latestMessage : chat.latestMessage || null,
                        unseenCount,
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                return {
                    user : {_id: otherUserId, name: 'Unknown User'},
                    chat : {
                        ...chat.toObject(),
                        latestMessage : chat.latestMessage || null,
                        unseenCount,
                    }
                }
            }
        }));
        res.status(200).json({chats : chatWithUserData});
    }catch(error){
        res.status(500).json({message: 'Error fetching user chats'});
    }
}
