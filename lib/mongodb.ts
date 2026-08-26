// lib/mongodb.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside your configuration dashboard.");
}

// Global caching to handle Vercel serverless cold starts cleanly
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // Terminate frozen requests early instead of hanging
      connectTimeoutMS: 10000,
      tls: true,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    // Log the underlying error to aid debugging (network, DNS, Atlas state)
    // eslint-disable-next-line no-console
    console.error("MongoDB connection error:", e);
    throw e;
  }

  return cached.conn;
}

export default connectDB;