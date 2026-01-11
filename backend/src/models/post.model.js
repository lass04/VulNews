import mongoose, { Schema } from "mongoose";

const postSchema = new Schema({
    title:{
        type:String,
        required:true,
        minlength:3
    },

    content:{
        type:String,
        trim:true,
        required:true,
        minlength:10
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    reactions:{
        type:Number
    }
},
{
    timestamps:true
}
);

export const Post = mongoose.model("Post",postSchema);