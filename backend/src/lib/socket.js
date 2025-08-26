import {Server} from "socket.io";
import http from "http"
import express from "express"

const app = express();

const server = http.createServer(app); //server

const io = new Server(server,{ //socket server
    cors : {
        origin : ["http://localhost:5173"],
    },
});

//used to store online users
const userSocketMap = {}; //object in fromat {userID : socketID}

export function getRecieverSocketID(userID){
    return userSocketMap[userID];
}
io.on("connection",(socket)=>{
    console.log("A user connected",socket.id);

    const userID = socket.handshake.query.userID;
    if(userID) userSocketMap[userID] = socket.id; //whenever user comes online,connection builds up and the user is stored in this object userSocketMap

    //used to send event to all connected users
    io.emit("getOnlineUsers",Object.keys(userSocketMap));//getOnlineUsers is the event clients can listen for and data is sent when they listen

    socket.on("disconnect",()=>{
        console.log("User disconnected",socket.id);
        delete userSocketMap[userID];
        io.emit("getOnlineUsers",Object.keys(userSocketMap));
    })
})

export {io,server,app}