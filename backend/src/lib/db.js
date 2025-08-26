import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config(); //helps in loading environment variables from .env file
const MONGO_URI = process.env.MONGO_URI;

export const connectToDB = async () =>{
    try{
        const conn = await mongoose.connect(MONGO_URI);
        console.log(`Connected to mongoDB : ${conn.connection.host}`);
    }catch(error){
         console.error('Error connecting to mongoDB:', error)
    }
}