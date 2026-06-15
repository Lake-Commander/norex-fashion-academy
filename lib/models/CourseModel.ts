// lib/models/CourseModel.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ICourse extends Document {
  slug: string;
  title: string;
  description: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  price: number;
  image: string;
  curriculum: string[];
  featured: boolean;
  createdAt: Date;
}

const CourseSchema = new Schema<ICourse>({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: String, required: true }, // e.g., "3 Months"
  level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true }, // Cloudinary CDN link
  curriculum: [{ type: String }],          // Array of curriculum milestone steps
  featured: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema);