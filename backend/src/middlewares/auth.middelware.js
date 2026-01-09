import jwt from "jsonwebtoken";

const authenticate = (req,res,next) => {

    const token = req.headers.authorization;
    if(!token)
        return res.status(403).json({
            success:false,
            message:"No Access Token"
        });

    req.user = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,payload)=>{
        if(err)
            return res.status(403).json({
        success:false,
        message:"Not authorized (Error while verifying token)"
    });

    req.user = payload;
    next();
    })
    
}

const adminOnly = (req,res,next) => {
    
    const auth = req.headers.authorization;
    const token = auth.split(" ")[1];

    if(!token)
        return res.status(403).json({
            success:false,
            message:"No token"
            });
        
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,payload))

    

}