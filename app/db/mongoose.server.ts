import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is missing");
  }

  await mongoose.connect(MONGODB_URI);

  isConnected = true;

  console.log("✅ MongoDB Connected");
}
