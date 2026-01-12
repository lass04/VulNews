import express from "express";

import userRouter from "./routes/user.route.js";
import articleRouter from "./routes/article.route.js";
import postRouter from "./routes/post.route.js";
import categoryRouter from "./routes/category.route.js";
import commentRouter from "./routes/comment.route.js";

const app = express();

// Parse Request to JSON

app.use(express.json());


// Routing

app.use("/users",userRouter);
app.use("/articles",articleRouter);
app.use("/posts",postRouter);
app.use("/categories",categoryRouter);
app.use("/comments",commentRouter);

export default app;