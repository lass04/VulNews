import mongoose, { Schema } from "mongoose";

const articleSchema = new Schema({
    
    title:{
        type:String,
        trim:true,
        required:true,
        minlength:3
    },
    author:{
        type:String,
        required:true
    },
    category:[
      { 
         type:mongoose.Schema.Types.ObjectId,
         ref:"Category",
         required:true
      }
     ],

    content:{
        type:String,
        required:true,
        minlength:15
    },
    reactions:{
        type:Number,
        required:true
    }

},
{
    timestamps:true
}
);

export const Article = mongoose.model("Article",articleSchema);