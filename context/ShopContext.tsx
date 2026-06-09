"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/types";
import { sounds } from "@/lib/sound-utils"; // Make sure this path is correct

export type Theme = 'obsidian' | 'cyber' | 'ivory' | 'emerald';

type CartItem = Product & { orderQuantity: number };

interface ShopContextType {
  // E-commerce State
  cart: CartItem[];
  wishlist: Product[];
  cartTotal: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  
  // UI & Theme State
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
  // --- STATE ---
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  
  const [theme, setThemeState] = useState<Theme>('obsidian');
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(false);
  const [isCartOpen, setCartOpen] = useState<boolean>(false);
  const [isWishlistOpen, setWishlistOpen] = useState<boolean>(false);
  const [isOracleOpen, setOracleOpen] = useState<boolean>(false);

  // --- EFFECTS ---
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

  // Sync theme class to html/body
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.classList.remove('theme-obsidian', 'theme-cyber', 'theme-ivory', 'theme-emerald');
      root.classList.add(`theme-${theme}`);
    }
  }, [theme]);


  // --- FUNCTIONS ---

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (soundEnabled) sounds.playSweep();
  };

  const setSoundEnabled = (enabled: boolean) => {
    setSoundEnabledState(enabled);
    sounds.enable(enabled);
    if (enabled) {
      setTimeout(() => {
        sounds.playChord();
      }, 50);
    }
  };

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
    if (soundEnabled) sounds.playSuccess();
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
    if (soundEnabled) sounds.playPop();
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, orderQuantity: quantity } : item))
    );
    if (soundEnabled) sounds.playClick();
  };

  const clearCart = () => {
    setCart([]);
    if (soundEnabled) sounds.playPop();
  };

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        if (soundEnabled) sounds.playPop();
        return prev.filter((item) => item.id !== product.id);
      }
      if (soundEnabled) sounds.playSuccess();
      return [...prev, product];
    });
  };

  const isInWishlist = (productId: string) => !!wishlist.find((item) => item.id === productId);

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