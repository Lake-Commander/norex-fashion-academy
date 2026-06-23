import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  orderId: string;
  user?: mongoose.Types.ObjectId; //  Maps the billing ledger node to an authentic student/client profile row
  email: string; //  Ensures quick tracking even if a custom manual entry uses an unregistered guest email node
  items: {
    product?: mongoose.Types.ObjectId; //  Made optional to support generic tuition tracks without physical inventory items
    name: string;
    quantity: number;
    size: string;
    color: string; //  Serves beautifully as a fallback for internal administrative logging comments on manual cards
    gender: string;
  }[];
  totalAmount: number;
  shippingAddress?: string; //  Captures tracking delivery destinations for physical items
  phone?: string; //  Captures mobile references for outfacing coordination
  paymentGateway: "Paystack" | "Flutterwave" | "WhatsApp" | "Manual Audit"; //  Added Manual Audit for internal academy sheets
  paymentStatus: "Pending" | "Completed" | "Failed" | "Paid"; //  Appended "Paid" to align with Paystack callback states
  paymentReference?: string; //  Securely holds transaction tracing strings to block duplicate reference processing loops
  orderType: "Storefront" | "Academy Tuition"; //  Differentiates retail inventory item logs from educational track credits
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>({
  orderId: { type: String, required: true, default: () => `NRX-${Math.floor(100000 + Math.random() * 900000)}` },
  user: { type: Schema.Types.ObjectId, ref: "User", default: null }, //  Connected relationship pointer anchor
  email: { type: String, required: true, trim: true, lowercase: true }, //  Normalized for quick filtering parameters
  items: [{
    product: { type: Schema.Types.ObjectId, ref: "Product", required: false },
    name: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    size: { type: String, default: "N/A" },
    color: { type: String, default: "Default" },
    gender: { type: String, default: "N/A" }
  }],
  totalAmount: { type: Number, required: true },
  shippingAddress: { type: String, default: "" },
  phone: { type: String, default: "" },
  paymentGateway: { 
    type: String, 
    enum: ["Paystack", "Flutterwave", "WhatsApp", "Manual Audit"], //  Added manual accounting support
    required: true 
  },
  paymentStatus: { 
    type: String, 
    enum: ["Pending", "Completed", "Failed", "Paid"], //  Added Paid support
    default: "Pending" 
  },
  paymentReference: { type: String, unique: true, sparse: true }, //  Sparse unique index blocks duplicate network hits without throwing validation errors on empty fields
  orderType: { 
    type: String, 
    enum: ["Storefront", "Academy Tuition"], //  Differentiates revenue data types
    default: "Storefront" 
  }
}, { timestamps: true }); // Next.js automatically maps timestamps to standard tracking variables createdAt and updatedAt

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);