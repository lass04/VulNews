import { Article } from "../models/article.model.js";
import { User } from "../models/user.model.js";
import { Category } from "../models/category.model.js";
import { CohereClientV2 } from "cohere-ai";
import Parser from 'rss-parser';

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

const CYBERSECURITY_FEEDS = [
  {
    url: 'https://www.securityweek.com/feed/',
    name: 'SecurityWeek'
  },
  {
    url: 'https://feeds.feedburner.com/TheHackersNews',
    name: 'The Hacker News'
  },
  {
    url: 'https://krebsonsecurity.com/feed/',
    name: 'Krebs on Security'
  },
  {
    url: 'https://www.bleepingcomputer.com/feed/',
    name: 'BleepingComputer'
  },
  {
    url: 'https://threatpost.com/feed/',
    name: 'Threatpost'
  },
  {
    url: 'https://www.darkreading.com/rss.xml',
    name: 'Dark Reading'
  },
];

const fetchArticlesAndStore = async () => {

  console.log('🟢 VulNews Cron: Starting article fetch...');
  
  try {
    const { COHERE_API_KEY } = process.env;
    
    if (!COHERE_API_KEY) {
      console.error('❌ Missing COHERE_API_KEY');
      return;
    }

    
    const categories = await Category.find().lean();
    if (!categories.length) {
      console.log('⚠️ No categories found. Aborting cron task.');
      return;
    }

    const categoryNames = categories.map(c => c.title);
    const categoryMap = Object.fromEntries(categories.map(c => [c.title, c._id]));
    console.log(`📂 Loaded ${categories.length} categories:`, categoryNames);

    
    const parser = new Parser({
      customFields: {
        item: ['content:encoded', 'dc:creator']
      }
    });

    const allArticles = [];

    for (const feed of CYBERSECURITY_FEEDS) {
      try {
        console.log(`🔍 Fetching from ${feed.name}...`);
        const parsedFeed = await parser.parseURL(feed.url);
        
        
        const articles = parsedFeed.items.slice(0, 5).map(item => ({
          title: item.title,
          author: item.creator || item['dc:creator'] || feed.name,
          description: item.contentSnippet || item.summary || '',
          content: item.content || item['content:encoded'] || item.contentSnippet || '',
          url: item.link,
          publishedAt: item.pubDate || item.isoDate,
          source: feed.name
        }));

        allArticles.push(...articles);
        console.log(`  ✓ Fetched ${articles.length} articles`);
        
      } catch (error) {
        console.warn(`  ⚠️ Failed to fetch ${feed.name}:`, error.message);
      }
    }

    if (!allArticles.length) {
      console.log('ℹ️ No articles fetched from any feed');
      return;
    }

    console.log(`📰 Total articles fetched: ${allArticles.length}`);

    // ==========================================
    // DEDUPLICATE BY TITLE
    // ==========================================
    const uniqueArticles = [];
    const seenTitles = new Set();

    for (const article of allArticles) {
      const titleKey = article.title.toLowerCase().substring(0, 50);
      if (!seenTitles.has(titleKey)) {
        seenTitles.add(titleKey);
        uniqueArticles.push(article);
      }
    }

    console.log(`📊 Unique articles after deduplication: ${uniqueArticles.length}`);

    // ==========================================
    // CLASSIFY WITH COHERE
    // ==========================================
    const cohere = new CohereClientV2({ token: COHERE_API_KEY });
    const formattedArticles = [];
    
    for (const article of uniqueArticles) {
      // Check if article already exists
      const exists = await Article.findOne({ title: article.title });
      if (exists) {
        console.log(`⏭️ Skipping duplicate: ${article.title.substring(0, 50)}...`);
        continue;
      }

      const text = `${article.title}. ${article.description}`;
      
      try {
        // Classify article
        const response = await cohere.chat({
          model: 'command-r-08-2024',
          messages: [
            {
              role: 'user',
              content: `You are a cybersecurity expert. Classify this article into ONE of these categories: ${categoryNames.join(', ')}.
              Article: "${text}"
              Respond with ONLY the category name, nothing else.`,
            },
          ],
        });

        const predictedLabelRaw = response.message?.content?.[0]?.text || '';
        const predictedLabel = categoryNames.find(cat =>
          predictedLabelRaw.toLowerCase().includes(cat.toLowerCase())
        );

        if (!predictedLabel) {
          console.warn(`⚠️ No category match for: ${article.title.substring(0, 50)}...`);
          continue;
        }

        const categoryId = categoryMap[predictedLabel];

        formattedArticles.push({
          title: article.title,
          author: article.author,
          category: [categoryId],
          content: article.content || article.description || 'No content available',
        });

        console.log(`✓ Classified "${article.title.substring(0, 40)}..." → ${predictedLabel}`);

      } catch (error) {
        console.warn(`⚠️ Classification failed for "${article.title.substring(0, 40)}...":`, error.message);
      }

      // Rate limiting - wait 1 second between Cohere calls (free tier)
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    if (!formattedArticles.length) {
      console.log('ℹ️ No articles classified successfully');
      return;
    }

    // ==========================================
    // INSERT INTO DATABASE
    // ==========================================

    try {
      const inserted = await Article.insertMany(formattedArticles, { 
        ordered: false // Continue even if some fail
      });
      console.log(`✅ Successfully inserted ${inserted.length} new articles`);
    } catch (error) {
      
      if (error.code === 11000) {
        const insertedCount = error.insertedDocs?.length || 0;
        console.log(`✅ Inserted ${insertedCount} articles (${formattedArticles.length - insertedCount} duplicates skipped)`);
      } else {
        throw error;
      }
    }


  } catch (error) {
    console.error('🔥 VulNews Cron Error:', error.message);
    console.error(error.stack);
  } finally {
    console.log('🔵 VulNews Cron: Task completed\n');
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