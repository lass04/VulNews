import { Comment } from "../models/comment.model.js";

const createComment = async (req,res) => {
    
    try{

        const { author, content, post, reactions } = req.body;

        if(!author || !content || !post || !reactions)
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            });

        const findComment = await Comment.findOne({title:title});
        if(findComment)
            return res.status(400).json({
                success:false,
                message:"Comment already exist"
            });

        const createComment = await Comment.create({
            author,
            content,
            post,
            reactions
        });

        res.status(201).json({
            comment:createComment
        });

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal Server error",
            error:error.message
        }); 
    }
}

const deleteComment = async (req,res) => {
   
    try{

        const id = req.params.id;
        if(!id)
            return res.status(400).json({
                success:false,
                message:"No Comment Id in request parameters"
            });

        
        const deleteComment = await Comment.findByIdAndDelete(id);
        if(!deleteComment)
            return res.status(404).json({
                success:false,
                message:"Comment does not exist"
            });

        res.status(200).json({
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

const updateComment = async (req,res) => {
    
    try{

        const id = req.params.id;
        if(!id)
            return res.status(400).json({
                success:false,
                message:"No Comment Id in request parameters"
            });

        const content = req.body;

        if(!content)
            return res.status(400).json({
                success:false,
                message:"No content provided"
            });

        const updateComment = await Comment.findByIdAndUpdate(id,{content:content},{new:true});
        if(!updateComment)
            return res.status(404).json({
                success:false,
                message:"Comment does not exist"
            });

        res.status(200).json({
            comment:updateComment
        });

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal Server error",
            error:error.message
        }); 
    }
}

const getComments = async (req,res) => {

    try{

        const comments = await Comment.find();

        res.status(200).json({
            data:comments
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
    createComment,
    deleteComment,
    updateComment,
    getComments
}