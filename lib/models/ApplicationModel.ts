import mongoose, { Schema, Document } from "mongoose";

export interface IApplication extends Document {
  fullName: string;
  email: string;
  phone: string;
  course: string;
  experienceLevel: string;
  message?: string;
  user?: mongoose.Types.ObjectId;
  studentId?: string;
  applicationFee: number;
  applicationFeeReference?: string;
  status: "pending" | "approved" | "enrolled" | "rejected";
  acceptedAt?: Date;
  createdAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    course: { type: String, required: true },
    experienceLevel: { type: String, required: true },
    message: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    studentId: { type: String },
    applicationFee: { type: Number, required: true, default: 5000 },
    applicationFeeReference: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "enrolled", "rejected"],
      default: "pending",
    },
    acceptedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Application ||
  mongoose.model<IApplication>("Application", ApplicationSchema);