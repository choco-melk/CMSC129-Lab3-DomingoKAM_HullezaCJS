import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import addUserAnimeRouter from "./routes/AddUserAnimeRoute.js";
import fetchUserAnimeRouter from "./routes/FetchUserAnimesRoute.js";

dotenv.config();    
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());    

// Routes
app.use("/api", addUserAnimeRouter);
app.use("/api", fetchUserAnimeRouter);

// Test route
app.get("/api/test", (req, res) => res.json({ message: "Server is running" }));

// Start the server
app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
});
