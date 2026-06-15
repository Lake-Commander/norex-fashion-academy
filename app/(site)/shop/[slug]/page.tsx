import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Product from "@/lib/models/ProductModel";
import ProductDetailClient from "./ProductDetailClient";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectDB();
  const product = await Product.findOne({ slug }).lean();
  
  if (!product) return { title: "Product Not Found" };
  
  return {
    title: `${product.name} | Norex Fashion`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectDB();

  // Fetch the primary product document
  const productDoc = await Product.findOne({ slug }).lean();
  if (!productDoc) notFound();

  // Stringify MongoDB ObjectIds to prevent Next.js Hydration boundary exceptions
  const product = JSON.parse(JSON.stringify(productDoc));

  // Query up to 3 related garments in the same category, excluding the active item
  const relatedDocs = await Product.find({
    category: product.category,
    _id: { $ne: product._id }
  }).limit(3).lean();
  
  const relatedProducts = JSON.parse(JSON.stringify(relatedDocs));

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}