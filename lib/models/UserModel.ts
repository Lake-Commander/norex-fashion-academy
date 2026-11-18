// lib/models/UserModel.ts
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, default: "student" },
  image: { type: String },
  studentId: { type: String, unique: true, sparse: true },
  profilePhoto: { type: String },
  phone: { type: String, default: "" },
  whatsapp: { type: String, default: "" },
  shippingAddress: { type: String, default: "" },
  billingAddress: { type: String, default: "" },
  readHistory: [{ type: mongoose.Schema.Types.Mixed }],
  watchHistory: [{ type: mongoose.Schema.Types.Mixed }],
  recentlyViewedProducts: [{ type: String }],
  recentlyViewedCourses: [{ type: String }],
  
  // ⚡ Normalized to map perfectly with your Frontend CartItem typing keys
  cart: [
    {
      id: { type: String, required: true },
      name: { type: String },
      price: { type: Number },
      images: [{ type: String }], // Array fallback match for Cloudinary maps
      selectedColor: { type: String },
      selectedSize: { type: String },
      selectedGender: { type: String },
      orderQuantity: { type: Number, default: 1 }
    }
  ],
  wishlist: [{ type: String }], // Array of matching Product ID strings
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
  isDeleted: { type: Boolean, default: false }
});

const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);
export default UserModel;