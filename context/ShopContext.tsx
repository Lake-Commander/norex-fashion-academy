"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/types"; // Adjust import based on your structure

type CartItem = Product & { orderQuantity: number };

interface ShopContextType {
  cart: CartItem[];
  wishlist: Product[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  cartTotal: number;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("norex_cart");
    const savedWishlist = localStorage.getItem("norex_wishlist");
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem("norex_cart", JSON.stringify(cart));
    localStorage.setItem("norex_wishlist", JSON.stringify(wishlist));
  }, [cart, wishlist]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, orderQuantity: item.orderQuantity + quantity } : item
        );
      }
      return [...prev, { ...product, orderQuantity: quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, orderQuantity: quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) return prev.filter((item) => item.id !== product.id);
      return [...prev, product];
    });
  };

  const isInWishlist = (productId: string) => !!wishlist.find((item) => item.id === productId);

  const cartTotal = cart.reduce((total, item) => total + item.price * item.orderQuantity, 0);

  return (
    <ShopContext.Provider value={{ cart, wishlist, addToCart, removeFromCart, updateQuantity, clearCart, toggleWishlist, isInWishlist, cartTotal }}>
      {children}
    </ShopContext.Provider>
  );
}

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop must be used within a ShopProvider");
  return context;
};