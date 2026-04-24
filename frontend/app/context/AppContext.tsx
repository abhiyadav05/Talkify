"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

const user_service = "";
const chat_service = "";

export interface User{
    _id: string;
    name: string;
    email: string;
}

export interface Chat{
    _id: string;
    user : string[];
    latestMessage: {
        text : string;
        sender: string;
    };
    createdAt: string;
    updatedAt: string;
    lastSeenCount?: number;
}

export interface Chats{
    _id: string;
    user : User;
    chat : string;
}

interface AppContextType{
    user: User | null;
    loading: boolean;
    isAuth: boolean;
    setUser : React.Dispatch<React.SetStateAction<User | null>>;
    setIsAuth : React.Dispatch<React.SetStateAction<boolean>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps{
    children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isAuth, setIsAuth] = useState<boolean>(false);

    // fetch user 

    async function fetchUser(){
        try{
            
           const token = Cookies.get("token");
           if(!token){
            setUser(null);
            setIsAuth(false);
            setLoading(false);
            return;
           } 
           
           const data = await axios.get(`${user_service}/api/v1/me`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        });

        setUser(data.data.user);
        setIsAuth(true);
        setLoading(false);
            
        }catch(err){
            console.error("Error fetching user data:", err);
            setUser(null);
            setIsAuth(false);
        }finally{
            setLoading(false);
        }
    }

    const value: AppContextType = {
        user,
        loading,
        isAuth,
        setUser,
        setIsAuth
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}


export const useAppData=(): AppContextType => {
    const context = useContext(AppContext); 
    if(context === undefined){
        throw new Error("useAppData must be used within an AppProvider");
    }
    return context;
}