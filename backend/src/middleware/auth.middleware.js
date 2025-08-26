import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const ProtectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt; // Get the token from cookies

        if(!token){
            res.status(401).json({message: "Unauthorized, please login"}); // 401: Unauthorized
            return;
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET);//this will decode the token and verify it using the secret key
        // If the token is valid, decoded will contain the userID i.e payload which we passed while signing the token
        if(!decoded){
            return res.status(401).json({message: "Invalid token, please login again"}); // 401: Unauthorized
        }

        const user = await User.findById(decoded.userID).select("-password");// Find the user by ID and exclude the password field
        if(!user){
            return res.status(404).json({message: "User not found"}); // 404: Not Found
        }

        req.user = user; // Attach the user to the request object
        next(); // Call the next middleware or route handler
    } catch (error) {
        console.log('Error in ProtectRoute middleware:', error);
        res.status(500).json({message: "Internal server error"}); // 500: Internal Server Error
    }
}