// lib/models/EditorialModel.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IEditorial extends Document {
  contentType: "article" | "insight" | "interview" | "story";
  title: string;
  slug: string;
  category: string;
  image?: string;
  summary?: string;
  author?: string;
  readTime?: string;
  date?: string;
  // Article & Story specific options
  content?: string[];
  pullQuote?: string;
  photography?: string;
  styling?: string;
  // Insight specific options
  metric?: string;
  chartData?: number[];
  // Interview specific options
  cast?: string;
  qaPairs?: { q: string; a: string }[];
  featured: boolean;
  createdAt: Date;
}

const EditorialSchema = new Schema<IEditorial>({
  contentType: { type: String, enum: ["article", "insight", "interview", "story"], required: true },
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  image: { type: String },
  summary: { type: String },
  author: { type: String },
  readTime: { type: String },
  date: { type: String },
  content: [{ type: String }],
  pullQuote: { type: String },
  photography: { type: String },
  styling: { type: String },
  metric: { type: String },
  chartData: [{ type: Number }],
  cast: { type: String },
  qaPairs: [{ q: String, a: String }],
  featured: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models.Editorial || mongoose.model<IEditorial>("Editorial", EditorialSchema);