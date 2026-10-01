import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import postRoutes from "./routes/posts.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(postRoutes);
app.use(userRoutes);
app.use(express.static("uploads"));

const start = async () => {
    const connectDB = await mongoose.connect("mongodb+srv://manju_db:qzmanju48@proconnect.qvk4lsf.mongodb.net/?appName=proConnect");

    app.listen(9090, () => {
        console.log("Server is running on port 9090");
    });
}

start();