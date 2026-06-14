import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  slug: string;
  name: string;
  price: number;
  category: string;
  gender: "Male" | "Female" | "Both";
  description: string;
  images: string[];
  sizes: string[];
  colors: string[];
  inStock: boolean;
  // Dynamic Homepage & UI Controls
  isFeatured: boolean;
  isNewArrival: boolean;
  isSignature: boolean;
  collectionGroup: "pluvial-drop" | "harmattan-regal" | "heritage-capsules" | "none";
  additionalInfo: { label: string; value: string }[];
}

const ProductSchema = new Schema<IProduct>({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  gender: { type: String, enum: ["Male", "Female", "Both"], required: true },
  description: { type: String, required: true },
  images: [{ type: String }], // Array for multiple views
  sizes: [{ type: String }],
  colors: [{ type: String }],
  inStock: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  isSignature: { type: Boolean, default: false },
  collectionGroup: { type: String, enum: ["pluvial-drop", "harmattan-regal", "heritage-capsules", "none"], default: "none" },
  additionalInfo: [{ label: String, value: String }]
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);