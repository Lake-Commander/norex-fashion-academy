// app/api/user/sync/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/UserModel";
import Product from "@/lib/models/ProductModel";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

const noStoreHeaders = { "Cache-Control": "no-store, max-age=0" };

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json(
      { success: false, error: "Unauthenticated session profile context." },
      { status: 401, headers: noStoreHeaders }
    );
  }

  try {
    await connectDB();
    const normalizedEmail = session.user.email.toLowerCase().trim();
    const profile = await User.findOne({ email: normalizedEmail }).lean();

    if (!profile) {
      return NextResponse.json(
        { success: false, error: "The authenticated account could not be found." },
        { status: 404, headers: noStoreHeaders }
      );
    }

    const wishlistIds = (profile.wishlist || []).filter((id: string) =>
      mongoose.Types.ObjectId.isValid(id)
    );
    const wishlist = wishlistIds.length
      ? await Product.find({ _id: { $in: wishlistIds } }).lean()
      : [];

    return NextResponse.json(
      { success: true, cart: profile.cart || [], wishlist },
      { headers: noStoreHeaders }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  // ⚡ Fix: Enforce strong type safety boundary right at the top of the execution thread
  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, error: "Unauthenticated session profile context." }, 
      { status: 401 }
    );
  }

  // Safe to read: Evaluates administrative clearance tiers
  if ((session.user as any).role === "admin" || !session.user.email) {
    return NextResponse.json(
      { success: false, error: "Unauthorized access tier token signature." }, 
      { status: 401 }
    );
  }

  try {
    await connectDB();
    const body = await request.json();
    const cart = Array.isArray(body.cart)
      ? body.cart
          .map((item: any) => ({
            id: String(item.id || item._id || ""),
            name: item.name,
            price: Number(item.price || 0),
            images: Array.isArray(item.images) ? item.images : [],
            selectedColor: item.selectedColor || "Default Matrix",
            selectedSize: item.selectedSize || "M",
            selectedGender: item.selectedGender || item.gender || "Unisex",
            orderQuantity: Math.max(1, Number(item.orderQuantity || 1)),
          }))
          .filter((item: any) => item.id)
      : [];
    const wishlist = Array.isArray(body.wishlist)
      ? body.wishlist.filter((id: unknown) => typeof id === "string")
      : [];

    const result = await User.updateOne(
      { email: session.user.email.toLowerCase().trim() },
      { $set: { cart, wishlist } }
    );
    if (!result.matchedCount) {
      return NextResponse.json(
        { success: false, error: "The authenticated account could not be found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Registry profiles synchronized." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}