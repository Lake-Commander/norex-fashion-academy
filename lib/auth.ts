// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials"; 
import clientPromise from "./mongodb-client";
import connectDB from "./mongodb"; 
import UserModel from "@/lib/models/UserModel"; 
import bcrypt from "bcryptjs";     

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: "jwt" },
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

        const inputEmail = credentials.email.toLowerCase().trim();
        const inputPassword = credentials.password;

        // 1. Check for Master Admin environment variables credentials
        if (
          process.env.ADMIN_EMAIL && 
          process.env.ADMIN_PASSWORD &&
          inputEmail === process.env.ADMIN_EMAIL.toLowerCase().trim() &&
          inputPassword === process.env.ADMIN_PASSWORD
        ) {
          return { id: "master-admin-env-node", name: "Director Admin", email: process.env.ADMIN_EMAIL.toLowerCase(), role: "admin" };
        }

        await connectDB();
        const user = await UserModel.findOne({ email: inputEmail });
        
        // 🚨 FIX 1: Reject the request if the user account has been soft-deleted
        if (user && user.isDeleted) {
          throw new Error("This account has been deactivated. Please contact support.");
        }

        // If no user exists, or they don't have a password, or they are trying to log in as admin here
        if (!user || !user.password || user.role === "admin") {
          throw new Error("No student record matches the provided credentials.");
        }

        const passwordMatches = await bcrypt.compare(inputPassword, user.password);
        if (!passwordMatches) {
          throw new Error("Invalid password verification challenge.");
        }

        // 🛡️ Explicitly return the role stored on the database object
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
        (session.user as any).role = token.role || "student"; // Pass role cleanly down to client states
      }
      return session;
    }
  },
  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
};