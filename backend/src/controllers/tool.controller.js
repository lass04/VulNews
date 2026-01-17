import { Tool } from "../models/tool.model.js";

const createTool = async (req,res) => {
    
    try{

        const { name, description, category , link , image } = req.body;

        if(!name || !description || category.length===0 || !link || !image)
            return res.status(400).json({
                succes:false,
                message:"All fields are required"
            });

        const findTool = await Tool.findOne({name:name});
        if(findTool)
            return res.status(400).json({
                success:false,
                message:"Tool already exist"
            });

        const createTool = await Tool.create({
            name,
            description,
            category,
            link,
            image
        });

        res.status(201).json({
            success:true,
            message:"Successfully created",
            tool:createTool
        });

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal Server error",
            error:error.message
        });
    }
}

const deleteTool = async (req,res) => {
    
    try{

        const id = req.params.id;
        if(!id)
            return res.status(400).json({
                success:false,
                message:"No Tool Id in request params"
            });

        const deleteTool = await Tool.findByIdAndDelete(id);
        if(!deleteTool)
            return res.status(404).json({
                success:false,
                message:"Tool does not exist"
            });

        res.status(200).json({
            success:true,
            message:"Deleted successfully"
        });

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal Server error",
            error:error.message
        });
    }
}

const updateTool = async (req,res) => {
    
    try{

        const id = req.params.id;
        if(!id)
            return res.status(400).json({
                success:false,
                message:"No Tool Id in request params"
            });

        if(Object.keys(req.body).length===0)
            return res.status(400).json({
                success:false,
                message:"No Data Provided"
            });

        const updateTool = await Tool.findByIdAndUpdate(id,req.body,{new:true});
        if(!updateTool)
            return res.status(404).json({
                success:false,
                message:"Tool does not exist"
            });
            
        res.status(200).json({
            success:true,
            message:"Updated succesfully",
            tool:updateTool
        });

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal Server error",
            error:error.message
        });
    }
}

const getTools = async (req,res) => {
   
    try{

        const limit = req.query.limit;
        const tools = await Tool.find().limit(limit);

        res.status(200).json({
            succes:true,
            message:"All Tools : ",
            data:tools
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

        const insertMany = await Tool.insertMany(req.body);
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

const getByCategory = async (req,res) => {
   
    try{

        const cat_id = req.params.id;
        if(!cat_id)
            return res.status(400).json({
                succes:false,
                message:"No Category id in req params"
            });

        const tools = await Tool.find({category:cat_id});
        if(!tools)
            return res.status(404).json({
                success:false,
                message:"No articles with this id"
            });

        res.status(200).json({
            success:true,
            message:"Tools : ",
            data:tools
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
    createTool,
    deleteTool,
    updateTool,
    getTools,
    insertMany,
    getByCategory
}