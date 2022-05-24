import mongoose from "mongoose";

const userCollectioon = 'user'

const userSchema = new mongoose.Schema({

    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const User = mongoose.model(userCollectioon,userSchema)
export default User;