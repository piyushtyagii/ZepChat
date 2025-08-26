import {v2 as cloudinary} from "cloudinary"; // Import Cloudinary SDK
//v2 is the latest version of the Cloudinary SDK

import {config} from "dotenv"; // Import dotenv to load environment variables
config(); // Load environment variables from .env file

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Cloudinary cloud name 
    api_key: process.env.CLOUDINARY_API_KEY, // Cloudinary API key
    api_secret: process.env.CLOUDINARY_API_SECRET // Cloudinary API secret     
// These values are set in the .env file for security
});

export default cloudinary; // Export the configured Cloudinary instance for use in other parts of the application