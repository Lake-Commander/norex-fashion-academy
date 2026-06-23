// app/shop/[slug]/page.tsx
import connectDB from "@/lib/mongodb";
import Product from "@/lib/models/ProductModel";
import Review from "@/lib/models/Reviews"; // Ensure the model is registered in memory
import ProductDetailClient from "./ProductDetailClient";
import { notFound } from "next/navigation";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  await connectDB();

  // ⚡ FIX: Convert the Mongoose document to a plain object and query matching reviews
  const productDoc = await Product.findOne({ slug: params.slug }).lean();
  
  if (!productDoc) {
    notFound();
  }

  // Query reviews directly linked to this productId object reference
  const dynamicReviews = await Review.find({ productId: productDoc._id })
    .sort({ createdAt: -1 })
    .lean();

  // Normalize document ID objects to clean text strings for Next.js boundary passing
  const product = {
    ...productDoc,
    _id: productDoc._id.toString(),
    reviews: dynamicReviews.map((r: any) => ({
      ...r,
      _id: r._id.toString(),
      productId: r.productId.toString(),
      createdAt: r.createdAt.toISOString()
    }))
  };

  // Fetch your related fallback products array matching parameters
  const relatedDocs = await Product.find({ 
    category: product.category, 
    _id: { $ne: product._id } 
  }).limit(3).lean();

  const relatedProducts = relatedDocs.map((p: any) => ({
    ...p,
    _id: p._id.toString()
  }));

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}