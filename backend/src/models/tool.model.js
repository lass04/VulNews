import mongoose, { Schema } from "mongoose";

const toolSchema = new Schema({
    
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    category:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Category",
            required:true
        }
    ],
    link:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    }
},
{
    timestamps : true
}
);

export const Tool = mongoose.model("Tool",toolSchema);