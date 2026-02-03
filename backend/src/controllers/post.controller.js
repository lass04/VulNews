import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";

const createPost = async (req,res) => {
    
    try{

        const { title , content, author, reactions} = req.body;
        if( !content || !author )
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

        const createPost = await Post.create({
            title,
            content,
            author,
            reactions
        });

        let populatedPost = await Post.findOne({_id:createPost._id})
        .populate("author").populate("reactions");

        res.status(201).json({
            data:populatedPost
        });

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal Server error",
            error:error.message
        }); 
    }
}

const deletePost = async (req,res) => {
   
    try{

        const id = req.params.id;
        if(!id)
            return res.status(400).json({
                success:false,
                message:"No Post Id in request parameters"
            });

        
        const deletePost = await Post.findByIdAndDelete(id);
        if(!deletePost)
            return res.status(404).json({
                success:false,
                message:"Post does not exist"
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

const updatePost = async (req,res) => {
    
    try{

        const id = req.params.id;
        if(!id)
            return res.status(400).json({
                success:false,
                message:"No Post Id in request parameters"
            });

        if(!Object.keys(req.body).length===0)
            return res.status(400).json({
                success:false,
                message:"No data provided"
            });

        const updatePost = await Post.findByIdAndUpdate(id,req.body,{new:true});
        if(!updatePost)
            return res.status(404).json({
                success:false,
                message:"Post does not exist"
            });

        res.status(200).json({
            post:updatePost
        });

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal Server error",
            error:error.message
        }); 
    }
}

const getPost = async (req,res) => {
    try{

        const id = req.params.id;
        if(!id)
            return res.status(400).json({
                success:false,
                message:"No postId in req params"
            });

        const post = await Post.findById(id).populate('author').populate('reactions');
        if(!post)
            return res.status(404).json({
                succes:false,
                message:"Post not found"
            });
        
        res.status(200).json({data:post});


    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal server error",
            error:error.message
        })
    }
}

const getPosts = async (req,res) => {

    try{
        
        const limit = req.query.limit;

        const posts = await Post.find()
       .populate('author')
       .populate('reactions')
       .limit(limit);

        res.status(200).json({
            data:posts
        });

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal Server error",
            error:error.message
        }); 
    }
}

const LikedPosts = async (req,res) => {
    
    try{

        const limit = req.query.limit;

        const id = req.user.userId;
        if(!id)
            return res.status(401).json({
                success:false,
                message:"Not authorized"
            });

        const likedPosts = await Post.find({ reactions: id }) 
       .populate('author', 'firstName lastName email')   
       .populate('reactions', 'firstName lastName email')
       .limit(limit);

        
        res.status(200).json({
            data: likedPosts
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

        const insertMany = await Post.insertMany(req.body);
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

const LikePost = async (req,res) => {
    
    try{

        const { postId } = req.body;
        const userId = req.params.id;
        
        if(!userId || !postId)
            return res.status(400).json({
                success:false,
                message:"Check userId in params and post in body"
            });


        const post = await Post.findByIdAndUpdate(
            postId,
            { $addToSet: { reactions: userId } },
            { new: true }
            );


        if(!post)
            return res.status(404).json({
                success:false,
                message:"Post Not found"
            });
            
        res.status(200).json({success:true});

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal Server error",
            error:error.message
        });
    }
}

const UnlikePost = async (req,res) => {
    
    try{

        const { postId } = req.body;
        const userId = req.params.id;
        
        if(!userId || !postId)
            return res.status(400).json({
                success:false,
                message:"Check userId in params and post in body"
            });


        const post = await Post.findByIdAndUpdate(
          postId,
         { $pull: { reactions: userId } },
         { new: true }
         );



        if(!post)
            return res.status(404).json({
                success:false,
                message:"Post Not found"
            });
            
        res.status(200).json({success:true});

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal Server error",
            error:error.message
        });
    }
}

export {
    createPost,
    deletePost,
    updatePost,
    getPosts,
    getPost,
    LikedPosts,
    insertMany,
    LikePost,
    UnlikePost
}