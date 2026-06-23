"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { Product } from "@/types";
import { sounds } from "@/lib/sound-utils";

export type Theme = 'obsidian' | 'cyber' | 'ivory' | 'emerald';

export type CartItem = Product & { 
  orderQuantity: number;
  selectedSize: string;
  selectedColor: string;
  selectedGender: string;
};

interface ShopContextType {
  cart: CartItem[];
  wishlist: Product[];
  cartTotal: number;
  addToCart: (product: any, quantity?: number) => void;
  removeFromCart: (productId: string, size: string, color: string, gender: string) => void;
  updateQuantity: (productId: string, size: string, color: string, gender: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  
  theme: Theme;
  setTheme: (theme: Theme) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setWishlistOpen: (open: boolean) => void;
  isOracleOpen: boolean;
  setOracleOpen: (open: boolean) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  
  const [theme, setThemeState] = useState<Theme>('obsidian');
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(false);
  const [isCartOpen, setCartOpen] = useState<boolean>(false);
  const [isWishlistOpen, setWishlistOpen] = useState<boolean>(false);
  const [isOracleOpen, setOracleOpen] = useState<boolean>(false);

  // Skip the initial mount synchronization lock
  const isFirstRender = useRef(true);

  // 1. Initial hydration safely from local cache matrices on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("norex_cart");
    const savedWishlist = localStorage.getItem("norex_wishlist");
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  }, []);

  // 2. ⚡ DUAL SYNC ACTION: Update Local Storage and dispatch updates to MongoDB pipelines
  useEffect(() => {
    localStorage.setItem("norex_cart", JSON.stringify(cart));
    localStorage.setItem("norex_wishlist", JSON.stringify(wishlist));

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Prepare clean strings values from the target wishlist object parameters
    const sanitizedWishlistIds = wishlist.map((item: any) => item.id || item._id);

    const syncDatabaseLedger = async () => {
      try {
        await fetch("/api/user/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cart: cart,
            wishlist: sanitizedWishlistIds
          })
        });
      } catch (err) {
        console.error("Background ledger sync thread timeout:", err);
      }
    };

    // Debounce the database dispatches slightly to handle quick quantity double-clicks gracefully
    const debounceTimeout = setTimeout(() => {
      syncDatabaseLedger();
    }, 800);

    return () => clearTimeout(debounceTimeout);
  }, [cart, wishlist]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.classList.remove('theme-obsidian', 'theme-cyber', 'theme-ivory', 'theme-emerald');
      root.classList.add(`theme-${theme}`);
    }
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (soundEnabled) sounds.playSweep();
  };

  const setSoundEnabled = (enabled: boolean) => {
    setSoundEnabledState(enabled);
    sounds.enable(enabled);
    if (enabled) {
      setTimeout(() => { sounds.playChord(); }, 50);
    }
  };

  const addToCart = (product: any, quantity = 1) => {
    const targetSize = product.selectedSize || "M";
    const targetColor = product.selectedColor || "Default Matrix";
    const targetGender = product.selectedGender || product.gender || "Female";
    const targetId = product.id || product._id;

    setCart((prev) => {
      const isMatch = (item: CartItem) => 
        item.id === targetId && 
        item.selectedSize === targetSize && 
        item.selectedColor === targetColor && 
        item.selectedGender === targetGender;

      const existing = prev.find(isMatch);
      if (existing) {
        return prev.map((item) =>
          isMatch(item) ? { ...item, orderQuantity: item.orderQuantity + quantity } : item
        );
      }
      
      return [...prev, { 
        ...product, 
        id: targetId,
        selectedSize: targetSize, 
        selectedColor: targetColor, 
        selectedGender: targetGender, 
        orderQuantity: quantity 
      }];
    });
    if (soundEnabled) sounds.playSuccess();
  };

  const removeFromCart = (productId: string, size: string, color: string, gender: string) => {
    setCart((prev) => prev.filter((item) => !(
      item.id === productId && 
      item.selectedSize === size && 
      item.selectedColor === color && 
      item.selectedGender === gender
    )));
    if (soundEnabled) sounds.playPop();
  };

  const updateQuantity = (productId: string, size: string, color: string, gender: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((item) => (
        item.id === productId && 
        item.selectedSize === size && 
        item.selectedColor === color && 
        item.selectedGender === gender
          ? { ...item, orderQuantity: quantity } 
          : item
      ))
    );
    if (soundEnabled) sounds.playClick();
  };

  const clearCart = () => {
    setCart([]);
    if (soundEnabled) sounds.playPop();
  };

  const toggleWishlist = (product: Product) => {
    const targetId = product.id || (product as any)._id;
    setWishlist((prev) => {
      const exists = prev.find((item) => (item.id || (item as any)._id) === targetId);
      if (exists) {
        if (soundEnabled) sounds.playPop();
        return prev.filter((item) => (item.id || (item as any)._id) !== targetId);
      }
      if (soundEnabled) sounds.playSuccess();
      return [...prev, { ...product, id: targetId }];
    });
  };

  const isInWishlist = (productId: string) => !!wishlist.find((item) => (item.id || (item as any)._id) === productId);

  const cartTotal = cart.reduce((total, item) => total + item.price * item.orderQuantity, 0);

  return (
    <ShopContext.Provider 
      value={{ 
        cart, wishlist, cartTotal, addToCart, removeFromCart, updateQuantity, clearCart, toggleWishlist, isInWishlist,
        theme, setTheme, soundEnabled, setSoundEnabled, isCartOpen, setCartOpen, isWishlistOpen, setWishlistOpen, isOracleOpen, setOracleOpen
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop must be used within a ShopProvider");
  return context;
};