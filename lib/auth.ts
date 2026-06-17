// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials"; 
import clientPromise from "./mongodb-client";
import connectDB from "./mongodb"; 
import mongoose from "mongoose";   
import bcrypt from "bcryptjs";     

// ⚡ UPDATED: Integrated cart and wishlist properties directly into the base memorandum model structure
const UserModel = mongoose.models.User || mongoose.model("User", new mongoose.Schema({
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
  wishlist: [{ type: String }] // Array of dynamic Product ID strings
}));

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: Record<"email" | "password", string> | undefined) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials parameter inputs.");
        }

        const inputEmail = credentials.email.toLowerCase().trim();
        const inputPassword = credentials.password;

        // 🔒 1. THE ISOLATED ENV ADMIN GUARD: Completely decoupled from checking user DB arrays
        if (
          process.env.ADMIN_EMAIL && 
          process.env.ADMIN_PASSWORD &&
          inputEmail === process.env.ADMIN_EMAIL.toLowerCase().trim() &&
          inputPassword === process.env.ADMIN_PASSWORD
        ) {
          return {
            id: "master-admin-env-node",
            name: "Director Admin",
            email: process.env.ADMIN_EMAIL.toLowerCase(),
            role: "admin", // Strict Admin privilege flag
          };
        }

        // 👤 2. THE STUDENT/CUSTOMER DATABASE FALLBACK
        await connectDB();
        const user = await UserModel.findOne({ email: inputEmail });
        
        // Block entry if a database profile attempts to spoof administrative configurations
        if (!user || !user.password || user.role === "admin") {
          throw new Error("No student record matches the provided credentials.");
        }

        const passwordMatches = await bcrypt.compare(inputPassword, user.password);
        if (!passwordMatches) {
          throw new Error("Invalid password verification challenge.");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: "student", // Enforce standard student profile baseline for DB accounts
          image: user.image
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "student";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role || "student";
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};