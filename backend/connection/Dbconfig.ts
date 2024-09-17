import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

async function Connection() {
  try {
    await mongoose.connect(process.env.MONGOURL as string);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Connection Error");
    process.exit(1);
  }
}

export default Connection;
