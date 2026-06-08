// app/api/reviews/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Review from '@/lib/models/Reviews';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const newReview = await Review.create(body);
    return NextResponse.json({ success: true, data: newReview }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to save review' }, { status: 500 });
  }
}