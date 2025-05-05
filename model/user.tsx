import mongoose,{Schema} from "mongoose";

const userSchema = new Schema({
    name:{
        required: true,
        type: String
    },
  
    password:{
        type: String
    },
    email:{
        required: true,
        type: String
    },
    role:{
        type: String
    },
    bio:{
        required: false,
        type: String
    },
    phone:{
        required: false,
        type: Number
    },
    socialMedia:{
        required: false,
        type: Object
    },   
  
    profilePicture:{
        required: false,
        type: String
    },
    designation:{
        required: false,
        type: String
    } ,
    isGoogleUser: { type: Boolean, default: false },
    
},
{ timestamps: true });
export const User = mongoose.models.User ?? mongoose.model("User",userSchema);