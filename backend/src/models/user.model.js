import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        email:{
            type:String,
            required:true,
            unique:true
        },
        fullname:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true,
            minlength:6
        },
        profilePicture:{
            type:String,
            default:""
        },
    },
    {
        timestamps:true //this will add createdAt and updatedAt fields automatically
    }

)


const User = mongoose.model('User', UserSchema); //'Users' will create a collection named User

export default User; //exporting the User model to use it in other files