import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import postRoutes from "./routes/posts.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const port = process.env.PORT || 9090;
const dbUrl = process.env.MONGO_URL;

const app = express();

app.use(cors());
app.use(express.json());

app.use(postRoutes);
app.use(userRoutes);
app.use(express.static("uploads"));

const start = async () => {
    const connectDB = await mongoose.connect(dbUrl);

    app.listen(port, () => {
        console.log("Server is running on port 9090");
    });
}

start();