import { Comment } from "../models/comment.model.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";

const createComment = async (req,res) => {
    
    try{

        const { author, content , post} = req.body;

        if(!author || !content || !post )
            return res.status(400).json({
                success:false,
                message:"All fields are required (author,content,post)"
            });


        const findAuthor = await User.findOne({_id:author});
        if(!findAuthor)
            return res.status(404).json({
                success:false,
                message:"Author not found"
            });

        const findPost = await Post.findOne({_id:post});
        if(!findPost)
            return res.status(404).json({
                success:false,
                message:"Post not found"
            });

        const createComment = await Comment.create({
            author,
            content,
            post
        });

        const populatedComment = await Comment.findById(createComment._id)
        .populate("author");


        res.status(201).json({
            data:populatedComment
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

const getPostComments = async (req,res) => {

    try{

        const postId = req.params.id;
        if(!postId)
            return res.status(400).json({
                success:false,
                message:"PostId required in params"
            });

        const comments = await Comment.find({post:postId})
        .populate('author');

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

const insertMany = async (req,res) => {
    
    try{

        const comments = req.body;

        const insertMany = await Comment.insertMany(comments);

        res.status(200).json({
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
    createComment,
    deleteComment,
    updateComment,
    getPostComments,
    insertMany
}