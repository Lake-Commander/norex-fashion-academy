// lib/models/RunwayLook.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IRunwayLook extends Document {
  collectionId: mongoose.Types.ObjectId;
  lookNumber: string; // e.g., "01"
  type: "look" | "backstage";
  image: string;
  garmentName?: string;
  modelName?: string;
  commentary: string; // Serves as designer note or backstage scene caption
  createdAt: Date;
}

const RunwayLookSchema = new Schema<IRunwayLook>({
  collectionId: { type: Schema.Types.ObjectId, ref: "RunwayCollection", required: true },
  lookNumber: { type: String, required: true },
  type: { type: String, enum: ["look", "backstage"], default: "look" },
  image: { type: String, required: true },
  garmentName: String,
  modelName: String,
  commentary: { type: String, required: true }
}, { timestamps: true });

export default mongoose.models.RunwayLook || mongoose.model<IRunwayLook>("RunwayLook", RunwayLookSchema);