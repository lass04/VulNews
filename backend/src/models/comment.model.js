import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema({

    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    content:{
        type:String,
        trim:true,
        required:true
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post",
        required:true
    },
    reactions:{
        type:Number,
        required:true
    }
},
{
    timestamps: true
}
);

export const Comment = mongoose.model("Comment",commentSchema);