import { Article } from "../models/article.model.js";
import { User } from "../models/user.model.js";
import { Category } from "../models/category.model.js";
import axios from "axios";
import { CohereClientV2 } from "cohere-ai";

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

        const limit = parseInt(req.query.limit);

        const articles = await Article.find().limit(limit);

        res.status(200).json({
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


        const articles = await Article.find({category:cat_id});
        if(!articles)
            return res.status(404).json({
                success:false,
                message:"No articles with this id"
            });

        res.status(200).json({
            data:articles
        });

    }catch(error){
         return res.status(500).json({
            success:false,
            message:"Internal Server error",
            error:error.message
        });
    }
}

const getById = async (req,res) => {
    
    try{

        const id = req.params.id;
        if(!id)
            return res.status(400).json({
                success:false,
                message:"No Id in req params"
            });

        const article = await Article.findOne({_id:id});
        if(!article)
            return res.status(404).json({
                success:false,
                message:"Article not found"
            });

        res.status(200).json({
            data:article
        });

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal Server error",
            error:error.message
        });
    }
}

const getLatestArticles = async (req,res) => {
    
    try{
        const limit = parseInt(req.query.limit) || 10;
        const page = req.query.page;

        let articles = {};

        if(page){
            articles = await Article.find().sort({createdAt: -1}).skip((page-1)*limit).limit(limit);
        }
        else{
            articles = await Article.find().sort({createdAt: -1}).limit(limit);
        }

        res.status(200).json({
            data:articles
        });

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal Server error",
            error:error.message
        });
    }
}

const fetchArticlesAndStore = async () => {

  console.log("🟢 VulNews Cron: Starting article fetch...");

  try {
    const { NEWS_API_KEY, COHERE_API_KEY } = process.env;

    if (!NEWS_API_KEY || !COHERE_API_KEY) {
      console.error("❌ Missing API keys (NEWS_API_KEY / COHERE_API_KEY)");
      return;
    }

    const categories = await Category.find().lean();
    if (!categories.length) {
      console.log("⚠️ No categories found. Aborting cron task.");
      return;
    }

    const categoryNames = categories.map(c => c.name);
    const categoryMap = Object.fromEntries(categories.map(c => [c.name, c._id]));
    console.log(`📂 Loaded ${categories.length} categories`);

    /* ───────────────────────
       Fetch cybersecurity news
    ─────────────────────── */
    const { data } = await axios.get(
      "https://newsapi.org/v2/everything",
      {
        params: {
          q: "cybersecurity OR vulnerability OR hacking OR security breach",
          sortBy: "publishedAt",
          language: "en",
          pageSize: 20,
          apiKey: NEWS_API_KEY,
        },
      }
    );

      const articles = data?.articles ?? [];
       if (!articles.length) {
      console.log("ℹ️ No articles returned from NewsAPI");
      return;
      }
    console.log(`📰 Fetched ${articles.length} articles`);

    /* ───────────────────────
       Initialize Cohere V2 client
    ─────────────────────── */
      const cohere = new CohereClientV2({ token: COHERE_API_KEY });

    /* ───────────────────────
       Classify & format articles using chat
    ─────────────────────── */
     const formattedArticles = [];

     for (const article of articles) {
      const text = `${article.title}. ${article.description ?? ""}`;

      try {
        // Chat-based classification prompt
        const response = await cohere.chat({
          model: "command-a-03-2025", // free-tier chat model
          messages: [
            {
              role: "user",
              content: `Classify this text into one of the following categories: ${categoryNames.join(
                ", "
              )}. Text: "${text}"`,
            },
          ],
        });

        // Cohere v2 returns choices array
        const predictedLabelRaw = response.choices?.[0]?.message?.content || "";
        const predictedLabel = categoryNames.find(cat =>
          predictedLabelRaw.toLowerCase().includes(cat?.toLowerCase())
        );
        const categoryId = categoryMap[predictedLabel];

        if (!categoryId) continue;

        formattedArticles.push({
          title: article.title,
          author: article.author || article.source?.name || "Unknown",
          category: [categoryId],
          content: article.description || article.content || "No content available",
          reactions: 0,
        });
        
      } catch (error) {
        console.warn(
          `⚠️ Classification failed: ${article.title}, error: ${error.message}`
        );
      }
    }

    if (!formattedArticles.length) {
      console.log("ℹ️ Articles fetched but none classified");
      return;
    }

    /* ───────────────────────
       Insert into MongoDB
    ─────────────────────── */
      const inserted = await Article.insertMany(formattedArticles, { ordered: false });
      console.log(`✅ Inserted ${inserted.length} new articles`);
   } catch (error) {
    console.error("🔥 VulNews Cron Error:", error.message);
   } finally {
      console.log("🔵 VulNews Cron: Task completed\n");
   }
};




export {
    createArticle,
    deleteArticle,
    updateArticle,
    getArticles,
    insertMany,
    getByCategory,
    getById,
    getLatestArticles,
    fetchArticlesAndStore
}