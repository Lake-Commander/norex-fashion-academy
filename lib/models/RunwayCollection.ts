// lib/models/RunwayCollection.ts
import mongoose, { Schema, Document } from "mongoose";

interface IPalette {
  name: string;
  hex: string;
  rgb: string;
  desc: string;
}

export interface IRunwayCollection extends Document {
  title: string;
  slug: string;
  waSeason: "Pluvial Drop" | "Harmattan Regal" | "August Break" | "Sultry Heat";
  campaignPlot: string;
  coverImage: string;
  btsImage: string;
  // Climatic Swatches
  palette: IPalette[];
  // Filmhouse Mapping
  hasFilm: boolean;
  filmTitle?: string;
  filmDirector?: string;
  filmDuration?: string;
  filmDescription?: string;
  youtubeId?: string;
  // Campaign Credits Mapping
  photographer?: string;
  stylist?: string;
  castCredits?: string;
  createdAt: Date;
}

const RunwayCollectionSchema = new Schema<IRunwayCollection>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  waSeason: { type: String, enum: ["Pluvial Drop", "Harmattan Regal", "August Break", "Sultry Heat"], required: true },
  campaignPlot: { type: String, required: true },
  coverImage: { type: String, default: "" },
  btsImage: { type: String, default: "" },
  palette: [{
    name: String,
    hex: String,
    rgb: String,
    desc: String
  }],
  hasFilm: { type: Boolean, default: false },
  filmTitle: String,
  filmDirector: String,
  filmDuration: String,
  filmDescription: String,
  youtubeId: String,
  photographer: String,
  stylist: String,
  castCredits: String
}, { timestamps: true });

export default mongoose.models.RunwayCollection || mongoose.model<IRunwayCollection>("RunwayCollection", RunwayCollectionSchema);