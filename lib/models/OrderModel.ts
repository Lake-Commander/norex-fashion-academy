import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  orderId: string;
  items: {
    product: mongoose.Types.ObjectId;
    name: string;
    quantity: number;
    size: string;
    color: string;
    gender: string;
  }[];
  totalAmount: number;
  paymentGateway: "Paystack" | "Flutterwave" | "WhatsApp";
  paymentStatus: "Pending" | "Completed" | "Failed";
  createdAt: Date;
}

const OrderSchema = new Schema<IOrder>({
  orderId: { type: String, required: true, default: () => `NRX-${Math.floor(100000 + Math.random() * 900000)}` },
  items: [{
    product: { type: Schema.Types.ObjectId, ref: "Product" },
    name: String,
    quantity: { type: Number, default: 1 },
    size: String,
    color: String,
    gender: String
  }],
  totalAmount: { type: Number, required: true },
  paymentGateway: { type: String, enum: ["Paystack", "Flutterwave", "WhatsApp"], required: true },
  paymentStatus: { type: String, enum: ["Pending", "Completed", "Failed"], default: "Pending" }
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);