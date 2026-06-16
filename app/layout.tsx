import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ShopProvider } from "@/context/ShopContext";
// ⚡ Import your NextAuth AuthProvider layout component hook
import AuthProvider from "@/context/AuthProvider"; 

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Norex Fashion | Design & Academy",
    template: "%s | Norex Fashion",
  },
  description: "Norex Fashion — Premium ready-to-wear fashion collections and a world-class fashion design academy in Warri, Nigeria.",
  keywords: ["fashion", "couture", "Warri", "Nigeria", "fashion academy", "ready-to-wear", "fashion design"],
  openGraph: {
    title: "Norex Fashion | Design & Academy",
    description: "Premium ready-to-wear fashion and world-class fashion education in Warri, Nigeria.",
    type: "website",
    locale: "en_NG",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body suppressHydrationWarning>
        {/* ⚡ Wrapped both contexts globally at the absolute root level */}
        <AuthProvider>
          <ShopProvider>
            {children}
          </ShopProvider>
        </AuthProvider>
      </body>
    </html>
  ); 
}