import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js"
import { getRecieverSocketID } from "../lib/socket.js";
import {io} from '../lib/socket.js'
export const getUsersForChat = async (req, res) => {
    try {
        const loggedInUserID = req.user._id;

        const filteredUsers = await User.find({_id : {$ne : loggedInUserID}}).select("-password");
        //ne= not equal to, so we are excluding the logged in user from the list of users.. which we will display on the sidebar for particular user
        res.status(200).json(filteredUsers);
        console.log(filteredUsers)
    } catch (error) {
        console.error("Error fetching users for chat:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getMessages = async (req,res)=>{
    try{
        const {id:userToChatID} = req.params; //id of the friend with whom we are chatting .. this will assign the id of the friend to userToChatID
        const myID = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderID: myID, receiverID: userToChatID },
                { senderID: userToChatID, receiverID: myID } //this will get all the messages of a chat no matter i am the sender or userToChatID is the sender and vice versa

            ]
        })
        res.status(200).json(messages);

    }catch(error){
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const sendMessage = async (req,res)=>{
    try {
        const {text,image} = req.body;
        const {id:userToChatID} = req.params; //id of the friend with whom we are chatting .. this will assign the id of the friend to userToChatID
    
        const myId = req.user._id;

        let imageURL;//null by default
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            //uploading the image to cloudinary and getting the url of the image
            imageURL = uploadResponse.secure_url; //secure_url is the url of the image uploaded to cloudinary
        }

        const newmessage = await new Message({
            senderID:myId,
            receiverID:userToChatID,
            text:text,
            image:imageURL
        })
        await newmessage.save(); //saving the message to the database

        

        //sending message to reciever in real time
        const recieverSocketID = getRecieverSocketID(userToChatID);
        if(recieverSocketID){ //send only if user if online
            io.to(recieverSocketID).emit("newMessage",newmessage); //only send this message to reciever, not to all users
        }

        res.status(200).json(newmessage);

        //real time functionality using socket.io
    } catch (error) {
        console.log(error);
    }
}