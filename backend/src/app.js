import express from "express";

const app = express();

// Parse Request to JSON
app.use(express.json());

export default app;