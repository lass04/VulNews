import { User } from "../models/user.model.js";

const createUser = async (req,res) => {
    
    try{

        const { firstName, lastName, email, password, role } = req.body;

        if(!firstName || ! lastName || !email || !password)
            return res.status(400).json({
                success:false,
                message:"All fields are required"    
            });

        const findUser = await User.findOne({email:email});
        if(findUser)
            return res.status(400).json({
                success:false,
                message:"This User is already registered"
            });

        const createUser = await User.create({
            firstName,
            lastName,
            email,
            password,
            role
        });

        res.status(201).json({
            user:createUser
        });

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal Server error",
            error:error.message
        });
    }
}

const deleteUser = async (req,res) => {
    
    try{


        const id = req.params.id;
        if(!id)
            return res.status(400).json({
                success:false,
                message:"No User Id in request parameters"
            });

        const deleteUser = await User.findByIdAndDelete(id);
        if(!deleteUser)
            return res.status(404).json({
                success:false,
                message:"User not found"
            });

        res.status(200).json({
            message:"Successfully deleted"
        })
 
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal Server error",
            error:error.message
        });
    }
}

const updateUser = async (req,res) => {
   
    try{

        if(Object.keys(req.body).length===0)
            return res.status(400).json({
                success:false,
                message:"No data provided"
            });

        const id = req.params.id;
        if(!id)
            return res.status(400).json({
                success:false,
                message:"No User id in request parameters"
            });

        const updateUser = await User.findByIdAndUpdate(id,req.body,{new:true});
        if(!updateUser)
            return res.status(404).json({
                success:false,
                message:"User does not exist"
            });

        res.status(200).json({
            user:updateUser
        });

    }catch(error){
       return res.status(500).json({
            success:false,
            message:"Internal Server error",
            error:error.message
        }); 
    }
}

const getUsers = async (req,res) => {
   
    try{

        const users = await User.find();
        
        res.status(200).json({
            data:users
        });

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal Server error",
            error:error.message
        }); 
    }
} 

const insertMany = async (req,res) => {
    
    try{

        const insertMany = await User.insertMany(req.body);
        res.status(201).json({
            insertions:insertMany
        });

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal Server error",
            error:error.message
        });
    }
}

export {
    createUser,
    deleteUser,
    updateUser,
    insertMany,
    getUsers
}