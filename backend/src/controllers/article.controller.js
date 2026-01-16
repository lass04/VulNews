import { Article } from "../models/article.model.js";
import { User } from "../models/user.model.js";

const createArticle = async (req,res) => {
    
    try{

        const { title , content, author, reactions} = req.body;

        if(!title || !content || !author || reactions===undefined)
            return res.status(400).json({
                success:false,
                message:"All fields are required (Author field is a MongoDB Id)"
            });

        const findAuthor = await User.findOne({_id:author});
        if(!findAuthor)
            return res.status(400).json({
                success:false,
                message:"Author does not exist"
            });

        const createArticle = await Article.create({
            title,
            content,
            author,
            reactions
        });

        res.status(201).json({
            success:true,
            message:"Successfully created",
            article:createArticle
        });

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal Server error",
            error:error.message
        }); 
    }
}

const deleteArticle = async (req,res) => {
   
    try{

        const id = req.params.id;
        if(!id)
            return res.status(400).json({
                success:false,
                message:"No Article Id in request parameters"
            });

        
        const deleteArticle = await Article.findByIdAndDelete(id);
        if(!deleteArticle)
            return res.status(404).json({
                success:false,
                message:"Article does not exist"
            });

        res.status(200).json({
            success:true,
            message:"Successfully deleted"
        });
            
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal Server error",
            error:error.message
        }); 
    }
}

const updateArticle = async (req,res) => {
    
    try{

        const id = req.params.id;
        if(!id)
            return res.status(400).json({
                success:false,
                message:"No Article Id in request parameters"
            });

        if(!Object.keys(req.body).length===0)
            return res.status(400).json({
                success:false,
                message:"No data provided"
            });

        const updateArticle = await Article.findByIdAndUpdate(id,req.body,{new:true});
        if(!updateArticle)
            return res.status(404).json({
                success:false,
                message:"Article does not exist"
            });

        res.status(200).json({
            succes:true,
            message:"Successfully updated",
            article:updateArticle
        });

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal Server error",
            error:error.message
        }); 
    }
}

const getArticles = async (req,res) => {

    try{

        const articles = await Article.find();

        res.status(200).json({
            success:true,
            message:"All Articles : ",
            data:articles
        })

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

        const insertMany = await Article.insertMany(req.body);
        res.status(201).json({
            success:true,
            message:"Successfully inserted",
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
    createArticle,
    deleteArticle,
    updateArticle,
    getArticles,
    insertMany
}