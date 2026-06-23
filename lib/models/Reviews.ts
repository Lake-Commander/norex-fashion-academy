import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  // FIXED: Linked productId as a strict relational ObjectId pointing to your Product Model
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  user: { type: String, required: true },
  email: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Avoid re-compilation models collision over serverless environment hot reloads
export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);