import jwt from "jsonwebtoken";

export const createRefreshToken = (user) => {
    jwt.sign(
        {userId:user._id},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn:"7d"}
    );
}

export const createAccessToken = (user) => {
    jwt.sign(
        {userId:user._id},
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m"}
    );
}