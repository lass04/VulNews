import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
    firstName:{
        type:String,
        required:true,
        minlength:3
    },
    lastName:{
        type:String,
        required:true,
        minlength:3
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
        minlength:8
    },
    refreshToken:{
        type:String
    },
    role:{
        type:String,
        enum:["customer","admin"],
        default:"customer"
    }
},
{
    timestamps:true
}
);

userSchema.pre("save",async () => {
    if(!this.isModified("password"))
        return;
    this.password = await bcrypt.hash(this.password,10);
});

userSchema.methods.comparePassword = async (password) => {
    return await bcrypt.compare(password,this.password);
}

export const User = mongoose.model("User",userSchema);