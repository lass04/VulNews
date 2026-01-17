import { Category } from "../models/category.model.js";

const createCategory = async (req,res) => {
    
    try{

        const { title , description } = req.body;

        if(!title || !description)
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            });

        const findCategory = await Category.findOne({title:title});
        if(findCategory)
            return res.status(400).json({
                success:false,
                message:"Category already exist"
            });

        const createCategory = await Category.create({
            title,
            description
        });

        res.status(201).json({
            success:true,
            message:"Successfully created",
            category:createCategory
        });

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal Server error",
            error:error.message
        }); 
    }
}

const deleteCategory = async (req,res) => {
   
    try{

        const id = req.params.id;
        if(!id)
            return res.status(400).json({
                success:false,
                message:"No Category Id in request parameters"
            });

        
        const deleteCategory = await Category.findByIdAndDelete(id);
        if(!deleteCategory)
            return res.status(404).json({
                success:false,
                message:"Category does not exist"
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

const updateCategory = async (req,res) => {
    
    try{

        const id = req.params.id;
        if(!id)
            return res.status(400).json({
                success:false,
                message:"No Category Id in request parameters"
            });

        if(!Object.keys(req.body).length===0)
            return res.status(400).json({
                success:false,
                message:"No data provided"
            });

        const updateCategory = await Category.findByIdAndUpdate(id,req.body,{new:true});
        if(!updateCategory)
            return res.status(404).json({
                success:false,
                message:"Category does not exist"
            });

        res.status(200).json({
            succes:true,
            message:"Successfully updated",
            category:updateCategory
        });

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal Server error",
            error:error.message
        }); 
    }
}

const getCategories = async (req,res) => {

    try{

        const limit = req.query.limit;
        const categories = await Category.find().limit(limit);

       res.status(200).json({
            success:true,
            message:"All Categories : ",
            data:categories
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

        const insertMany = await Category.insertMany(req.body);
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

const getCategoryByName = async (req,res) => {
    
    try{

        const category = req.query.category;

        if(!category)
            return res.status(400).json({
                succes:false,
                message:"No category in query params"
            });

        const findCategory = await Category.findOne({title:{$regex:category,$options:"i"}});
        if(!findCategory)
            return res.status(404).json({
                success:false,
                message:"No category with this name"
            });

        res.status(200).json({
            success:true,
            message:"Category",
            data:findCategory
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
    createCategory,
    deleteCategory,
    updateCategory,
    getCategories,
    insertMany,
    getCategoryByName
}