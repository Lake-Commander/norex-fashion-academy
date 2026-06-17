import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import UserModel from "@/lib/models/UserModel"; // Replace with your exact User model import path

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role === "admin") {
    return NextResponse.json({ success: false, error: "Unauthorized access tier" }, { status: 401 });
  }

  await connectDB();
  const { cart, wishlist } = await request.json();

  await UserModel.updateOne(
    { email: session.user.email },
    { $set: { cart, wishlist } }
  );

  return NextResponse.json({ success: true });
}