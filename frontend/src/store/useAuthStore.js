import {create} from 'zustand'
import { axiosInstance } from '../lib/axios'
import axios from 'axios';
import toast from 'react-hot-toast';
import {io} from 'socket.io-client'

const URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";
export const useAuthStore = create((set,get)=>({
    authUser: null, //will use this to store the currently authenticated user data
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,//will use this to show loading state while checking auth
    onlineUsers:[],
    socket : null,
    checkAuth : async()=>{
        try {
            const res = await axiosInstance.get('/auth/check');
            // we have already create a baseRUL for http://localhost:5001/api
            // so we can directly use the endpoint
            set({authUser : res.data});
            get().connectSocket(); 
        } catch (error) {
            set({authUser: false});
            console.log("Error checking auth:", error);
        } finally{ //finally runs after every try catch block
            set({isCheckingAuth:false}) //set isCheckingAuth to false after checking auth})
        }
    },

    signUp : async(data)=>{
        set({isSigningUp : true}); //set isSigningUp to true while signing up
        try {
            const user = await axiosInstance.post('/auth/signup', data);
            set({authUser: user.data}); //set authUser to the signed up user data
            toast.success("Account created successfully");
            get().connectSocket(); 
        } catch (error) {
            toast.error(error.response.data.message || "Error signing up");
            console.error("Error signing up:", error.response.data.message);
        }finally{
            set({isSigningUp: false}); //set isSigningUp to false after signing up
        }
    },
    logOut: async ()=>{
        try {
            axiosInstance.post('/auth/logout');
            set({authUser: null}); //set authUser to null on logout
            get().disconnectSocket();
        } catch (error) {
            toast.error(error.response.data.message || "Error logging out");
            console.error("Error logging out:", error.response.data.message);
        }
    },
    login : async (data)=>{
        set({isLoggingIn: true}); //set isLoggingIn to true while logging in
        try{
            const response = await axiosInstance.post('/auth/login',data);
            set({authUser: response.data}); //set authUser to the logged in user data
            toast.success("Logged in successfully");
            get().connectSocket(); 
        }catch(error){
            toast.error(error.response.data.message || "Error logging in");
            console.error("Error logging in:", error.response.data.message);
        }finally{
            set({isLoggingIn: false}); //set isLoggingIn to false after logging in
        }
    },
    updateProfile : async (data)=>{
        set({isUpdatingProfile:true}); //set isUpdatingProfile to true while updating profile
        try{
            const response = await axiosInstance.put('/auth/update-profile', data);
            set({authUser: response.data}); //set authUser to the updated user data
            toast.success("Profile updated successfully");
        }catch(error){
            toast.error(error.response.data.message || "Error updating profile");
        }finally{
            set({isUpdatingProfile:false}); //set isUpdatingProfile to false after updating profile
        }
    },
    connectSocket : ()=>{
        const {authUser} = get();
        if(!authUser || get().socket?.connected) return; //if no user or socket already connected
        
        //build up the connection
        const socket = io(URL,{ 
            query : {
                userID : authUser._id
            }
        }); //URL to our backend server
        socket.connect();
        set({socket : socket});

        socket.on("getOnlineUsers", (userIDs)=>{ //get online users update
            set({onlineUsers : userIDs});
        })
    },
    disconnectSocket : ()=>{
        if(get().socket?.connected) get().socket.disconnect();
    }

    
}))

//create function is basically used to create a store in zustand
//it takes function as a argument to get or set the state and returns value from create
//this creates a state globally accessible in the app