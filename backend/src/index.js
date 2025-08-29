import express from 'express';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import dotenv from 'dotenv';
dotenv.config();
import {connectToDB} from './lib/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { app,server } from './lib/socket.js'
import path from 'path'

app.use(cors({
  origin : "http://localhost:5173", // Allow requests from this origin
  credentials: true, // Allow cookies to be sent with requests
}))

const PORT = process.env.PORT ;
const __dirname = path.resolve();
app.use(cookieParser()); // Middleware to parse cookies

app.use(express.json()); // Middleware to parse JSON bodies ..basically extract the fields fron req body

app.use("/api/auth" , authRoutes);
app.use("/api/message",messageRoutes);


if (process.env.NODE_ENV === "production") { //if we are in production,join to frontend
  app.use(express.static(path.join(__dirname, "../frontend/dist"))); //statically serve the website using express
  //dist contains the whole frontend

  app.get(/(.*)/, (req, res) => { //catch all route
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}


server.listen(PORT, () => {
  console.log('Server is running on port ', PORT);
  connectToDB(); //As soon as the server starts, connect to the database
});
