import mongoose, { Schema, Document } from "mongoose";

export interface IRunway extends Document {
  seasonId: "SS24" | "FW24" | "SS25" | "FW25" | "SS26";
  title: string;
  venue: string;
  story: string;
  videoUrl?: string; // Links for embed look streaming
  lookbookImages: string[];
  highlights: string[];
  isPinnedHome: boolean;
}

const RunwaySchema = new Schema<IRunway>({
  seasonId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  venue: { type: String, required: true },
  story: { type: String, required: true },
  videoUrl: { type: String },
  lookbookImages: [{ type: String }],
  highlights: [{ type: String }],
  isPinnedHome: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models.Runway || mongoose.model<IRunway>("Runway", RunwaySchema);