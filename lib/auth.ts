// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "@/lib/mongodb-client";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Safe model mapping evaluation inside the configuration framework
const UserSchema = mongoose.models.User || mongoose.model("User", new mongoose.Schema({
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
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials parameter inputs.");
        }

        await connectDB();
        const user = await mongoose.models.User.findOne({ email: credentials.email.toLowerCase() });
        
        if (!user || !user.password) {
          throw new Error("No record matches the provided credentials.");
        }

        const passwordMatches = await bcrypt.compare(credentials.password, user.password);
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