// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials"; 
import clientPromise from "./mongodb-client";
import connectDB from "./mongodb"; 
import mongoose from "mongoose";   
import bcrypt from "bcryptjs";     

// Inline definition to prevent compile loops across dynamic Next.js edge environments
const UserModel = mongoose.models.User || mongoose.model("User", new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, default: "student" },
  image: { type: String }
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

        // ⚡ 1. THE ENV GUARD: Evaluates secure master credentials flags first
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
            role: "admin",
          };
        }

        // ⚡ 2. THE DATABASE FALLBACK: Evaluates client clusters tables matches
        await connectDB();
        
        // ✅ THE FIX: Pull directly from the safe, pre-compiled UserModel variable above. 
        // This ensures the model registers on context load instead of crash-looping on the connection pool.
        const user = await UserModel.findOne({ email: inputEmail });
        
        if (!user || !user.password) {
          throw new Error("No record matches the provided credentials.");
        }

        const passwordMatches = await bcrypt.compare(inputPassword, user.password);
        if (!passwordMatches) {
          throw new Error("Invalid password verification challenge.");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role || "student",
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