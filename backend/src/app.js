import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRouter from "./routes/user.route.js";
import articleRouter from "./routes/article.route.js";
import postRouter from "./routes/post.route.js";
import categoryRouter from "./routes/category.route.js";
import commentRouter from "./routes/comment.route.js";
import authRouter from "./routes/auth.route.js";
import cveRouter from "./routes/cve.route.js";
import toolRouter from "./routes/tool.route.js";


const app = express();

// Parse Request to JSON

app.use(express.json());
app.use(cookieParser());

// Cors Configuration

app.use(cors({
  origin: 'http://localhost:4200', 
  methods: ['GET','POST','PUT','DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));


// Routing

app.use("/users",userRouter);
app.use("/articles",articleRouter);
app.use("/posts",postRouter);
app.use("/categories",categoryRouter);
app.use("/comments",commentRouter);
app.use("/auth",authRouter);
app.use("/cve",cveRouter);
app.use("/tools",toolRouter);


export default app;