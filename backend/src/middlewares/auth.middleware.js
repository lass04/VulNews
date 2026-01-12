import jwt from "jsonwebtoken";

const verifyToken = (authHead) => {

    if(!authHead)
        return null;

    const token = authHead.split(" ")[1];
    if(!token)
        return null

    try{
        const payload = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        return payload;
    }catch(err){
        return null;
    }
}


const authenticate = (req,res,next) => {

    const authHead = req.headers.authorization;
    
    const verif = verifyToken(authHead);

    if(verif===null)
        return res.status(403).json({
            success:false,
            message:"Access Denied"
    });

    req.user=verif;
    next();
}

const adminOnly = (req,res,next) => {

    const authHead = req.headers.authorization;

    const verif = verifyToken(authHead);

    if(verif===null)
        return res.status(403).json({
            success:false,
            message:"Access Denied"
        });

    if(verif.role!=="admin")
        return res.status(403).json({
            success:false,
            message:"Admin Only"
        });

    next();
}

export {
    authenticate,
    adminOnly
}