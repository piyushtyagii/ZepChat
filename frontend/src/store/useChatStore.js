import {create} from 'zustand'
import { axiosInstance } from '../lib/axios.js'
import {toast} from 'react-hot-toast'
import { useAuthStore} from './useAuthStore.js'

export const useChatStore = create((set,get)=>({
    messages:[],
    users:[],
    selectedUser:null,
    isMessagesLoading:false,
    isUsersLoading:false,
    onlineUsers:[],

    getUsers : async ()=>{
        set({isUsersLoading : true})
        try {
            const resp = await axiosInstance.get("/message/users");
            set({users:resp.data})
        } catch (error) {
            toast.error("Error in loading users")
        }finally{
            set({isUsersLoading : false})
        }
    },
    getMessages : async (userID)=>{
        set({isMessagesLoading:true})
        try {
            const resp = await axiosInstance.get(`/message/${userID}`);
            set({messages : resp.data});
        } catch (error) {
            toast.error("Error in loading messages")
        }finally{
            set({isMessagesLoading:false})
        }
    },
    sendMessage : async (messageData)=>{
        const {selectedUser,messages} = get();
        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`,messageData);
            set({messages : [...messages,res.data]});
            
        } catch (error) {
            toast.error(error.response.data.message)
            console.log("Error in sending message",error.response.data.message);
        }
    },
    subscribeToMessages : ()=>{ //used to recieve message in real tie
        const { selectedUser } = get();
        if(!selectedUser) return;

        
        const socket= useAuthStore.getState().socket;

        socket.on("newMessage",(newMessage)=>{
            const isMessageSentFromSelectedUser = newMessage.senderID === selectedUser._id;
            if(!isMessageSentFromSelectedUser)return; //otherwise the message will be displayed on the window of every currently selected user
            set({messages : [...get().messages,newMessage]})
        });//whenever new message comes , add it to messages array
        
    },

    unSubscribeFromMessages : ()=>{
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },

    setSelectedUser : (selectedUser)=>set({selectedUser})



}))