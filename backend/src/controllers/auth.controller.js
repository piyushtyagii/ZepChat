
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import { generateToken } from '../lib/utils.js';
import User from '../models/user.model.js'; // Assuming you have a User model defined
import cloudinary from '../lib/cloudinary.js'

export const signup = async (req,res)=>{
    const { fullname, email, password } = req.body;
    try {
        if(!fullname || !email || !password){
            return res.status(400).json({message:"Please fill all the fields"}); //400: Bad Request
        }
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            if(errors.array().length > 1){
                res.status(400).json({message : "Invalid email or password"}); //400: Bad Request
                return;
            }
            res.status(400).json({message : errors.array()});
            return;
        }

        //check is user already exists
        const user = await User.findOne({email:email}); 
        if(user){
            return res.status(400).json({message : "Email already exists"})
        }

        //hashing the password
        const salt = bcrypt.genSaltSync(10); //salt which we use to hash the password
        const hashedpassword = await bcrypt.hash(password,salt); //hashing the password

        //create a new user
        const newuser = new User({
            fullname:fullname,
            email:email,
            password : hashedpassword
        })

        //check if any error occurs while saving the user
        if(newuser){
            //will return the jwt in cookies so that whenever the user tries to signin again, the request will be made using the same cookie..and we will check if the token is valid in it or not at that time
            generateToken(newuser._id,res); // we have sent response here so that it can send the cookie in response;
            await newuser.save(); //save the user to the database
            res.status(201).json({ //201: Created
                message:"User created successfully",
                _id:newuser._id,
                fullname:newuser.fullname,
                //password:newuser.password, //we should not send the password in the response
                email:newuser.email,  
                profilePicture:newuser.profilePicture,   
            })
        }else{
            res.status(400).json({message:"Invalid user data"})
        }
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({message:"Internal server error"}); //500: Internal server error
    }
}

export const login =async (req,res)=>{
    const {email,password} = req.body;

    try {

        const errors = validationResult(req);

    if(!email || !password){
        return res.status(400).json({message:"Please fill all the fields"}); //400: Bad Request
    }
    if(!errors.isEmpty()){
        if(errors.array().length > 1){
            res.status(400).json({message : "Invalid email or password"}); //400: Bad Request
            return;
        }
        res.status(400).json({message : errors.array()});
        return;
    }
    const user =await User.findOne({email:email});  
    if(!user){
        res.status(400).json({message:"Invalid credentials"})//if the user is malicious..it should know what is wrong
    }
    //compare the password with the hashed password in the database
    
    const isPasswordCorrect = await bcrypt.compare(password,user.password);
    if(!isPasswordCorrect){
        return res.status(400).json({message:"Invalid credentials"}); //400: Bad Request
    }
    
    //if the user is found and the password is correct, generate a token and send it in the response
    generateToken(user._id,res); 
    res.status(200).json({
        message:"User logged in successfully",
        _id:user._id,
        fullname:user.fullname,
        email:user.email,
        profilePicture:user.profilePicture, //if the user has a profile picture, it will be sent in the response
    })
    }catch (error) {
        console.log("Error in login controller:", error);
        // Handle the error appropriately, e.g., log it and send a response
        res.status(500).json({message:"Internal server error"}); //500: Internal server error
    }   
};

export const logout = (req,res)=>{
    try {
        res.cookie("jwt","",{
            maxAge:0
 })//clearing the cookie by setting the maxAge to 0
        res.status(200).json({message:"User logged out successfully"}); //200: OK
    } catch (error) {
        console.log("Error in logout controller:", error);
        res.status(500).json({message:"Internal server error"}); //500: Internal
    }
};


export const updateProfile = async (req, res) => {
      try {
        const {profilePicture} = req.body;
        const userId = req.user._id; // Assuming req.user is set by ProtectRoute middleware

        if(!profilePicture){
            res.status(400).json({message:"Please provide a profile picture"}); //400: Bad Request
            return;
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePicture);
        const updateUser = await User.findByIdAndUpdate(userId,{profilePicture:uploadResponse.secure_url},{new:true}); //new:true will return the updated user
        //Otherwise findbyidandupdate will return the user which was before updated
        res.status(200).json(updateUser);
      } catch (error) {
        console.log("Error in updateProfile",error);
        res.status(500).json({message:"Internal server occured"});
      }
}


export const checkAuth = (req,res)=>{
    try{
        console.log("Checking auth for user:", req.user);
        res.status(200).json(req.user)
    }catch(error){
        console.log("Error in checkAuth controller:", error);
        res.status(500).json({message:"Internal server error"}); //500: Internal server error
    }
}
