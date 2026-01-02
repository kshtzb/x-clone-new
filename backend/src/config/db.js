import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB SUCCESSFULLY");
  } catch (error) {
    console.log("Error connecting to MONGODB", error);
    process.exit(1);
  }
};
