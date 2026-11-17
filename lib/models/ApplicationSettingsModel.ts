import mongoose, { Document, Schema } from "mongoose";

export interface IApplicationSettings extends Document {
  applicationFeeEnabled: boolean;
  applicationFee: number;
}

const ApplicationSettingsSchema = new Schema<IApplicationSettings>(
  {
    applicationFeeEnabled: { type: Boolean, default: true },
    applicationFee: { type: Number, default: 5000, min: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.ApplicationSettings ||
  mongoose.model<IApplicationSettings>("ApplicationSettings", ApplicationSettingsSchema);
