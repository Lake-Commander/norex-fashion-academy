// lib/models/CategoryModel.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  tag: string;
  desc: string;
  image: string;
  link: string;
  order: number;
}

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  tag: { type: String, required: true },
  desc: { type: String, required: true },
  image: { type: String, required: true }, // Cloudinary URL string
  link: { type: String, required: true },  // e.g., "/shop?gender=Female"
  order: { type: Number, default: 0 }      // To maintain sorting layout
}, { timestamps: true });

export default mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);