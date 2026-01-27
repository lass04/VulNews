import { User } from "../models/user.model.js";
import { createRefreshToken , createAccessToken } from "../utils/jwt.js";

// Auth controllers

const refresh = async (req,res) => {

    const token = req.cookies.refreshToken;

    if(!token)
        return res.status(401).json({
            success:false,
            message:"No Refresh Token"
        });

    const findUser = await User.findOne({refreshToken:token});
    if(!findUser)
        return res.status(401).json({
            success:false,
            message:"User not found "
        });

    try{

        jwt.verify(token,process.env.REFRESH_TOKEN_SECRET);

    }catch(error){
        return res.status(401).json({
            success:false,
            message:"False Token",
            error:error.message
        });
    }

    const accessToken = createAccessToken(findUser);

    res.status(200).json({
        accessToken
    });

}

const login = async (req,res) => {

    try{
        
        const { email, password } = req.body;

        if(!email || !password)
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            });

        const user = await User.findOne({email:email});
        if(!user)
            return res.status(404).json({
                succes:false,
                message:"No user with these credentials"
            });

            
        const match = await user.comparePassword(password);
        if(!match)
            return res.status(401).json({
                succes:false,
                message:"Invalid Credentials"
            });


        const refreshToken = createRefreshToken(user);
        const accessToken = createAccessToken(user);


        user.refreshToken = refreshToken;
        await user.save();

        res.cookie("refreshToken",refreshToken,{
            httpOnly:true,
            secure:false,
            sameSite:"lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            accessToken,
            user
        });

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal server error",
            error:error.message
        });
    }
}

const logout = async (req,res) => {

    const token = req.cookies.refreshToken;console.log(token);

    if(!token)
        return res.status(403).json({
            success:false,
            message:"No Token"
        });

    const logoutUser = User.updateOne({refreshToken:token},{$unset:{refreshToken:""}});
    if(!logoutUser)
        return res.status(404).json({
            success:false,
            message:"User does not exist"
        });

    res.clearCookie("refreshToken");
    res.sendStatus(204);
}

const register = async (req,res) => {
    
    try{

        const { firstName , lastName , email , password } = req.body;

        if(!firstName || !lastName || !email || !password)
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            });

        const findUser = await User.findOne({email:email});
        if(findUser)
            return res.status(400).json({
                success:false,
                message:"User already exist"
            });

        const registerUser = await User.create({
            firstName,
            lastName,
            email,
            password
        });

        res.status(201).json({
            data:registerUser
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
    refresh,
    login,
    logout,
    register
}