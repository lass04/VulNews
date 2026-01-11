import { Article } from "../models/article.model.js";
import { User } from "../models/user.model.js";

const createArticle = async (req,res) => {
    
    try{

        const { title , content, author} = req.body;
        if(!title || !content || !author)
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            });

        const findAuthor = await User.findOne({_id:author});
        if(!findAuthor)
            return res.status(400).json({
                success:false,
                message:"User does not exist"
            });

        const createArticle = await Article.create({

        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal Server error",
            error:error.message
        }); 
    }
}

export {
    createArticle
}