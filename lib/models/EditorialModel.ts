import mongoose, { Schema, Document } from "mongoose";

export interface IEditorial extends Document {
  title: string;
  category: "Couture & Atelier" | "Sustainability Deck" | "Culture & Heritage";
  image: string;
  summary: string;
  author: string;
  content: string[];
  pullQuote: string;
  isPinnedHome: boolean;
}

const EditorialSchema = new Schema<IEditorial>({
  title: { type: String, required: true },
  category: { type: String, enum: ["Couture & Atelier", "Sustainability Deck", "Culture & Heritage"], required: true },
  image: { type: String, required: true },
  summary: { type: String, required: true },
  author: { type: String, required: true },
  content: [{ type: String }],
  pullQuote: { type: String },
  isPinnedHome: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models.Editorial || mongoose.model<IEditorial>("Editorial", EditorialSchema);