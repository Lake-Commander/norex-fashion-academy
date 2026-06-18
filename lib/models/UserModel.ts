// lib/models/UserModel.ts
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, default: "student" },
  image: { type: String },
  cart: [
    {
      id: { type: String, required: true },
      name: { type: String },
      price: { type: Number },
      image: { type: String },
      color: { type: String },
      size: { type: String },
      orderQuantity: { type: Number, default: 1 }
    }
  ],
  wishlist: [{ type: String }],
  // 🔐 Added these fields for token tracking:
  resetToken: { type: String },
  resetTokenExpiry: { type: Date }
});

// Checks if model is compiled, otherwise safe-compiles it once globally
const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);

export default UserModel;