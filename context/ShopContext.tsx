"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { Product } from "@/types";
import { sounds } from "@/lib/sound-utils";

/* ==========================================
   TYPE DEFINITIONS & INTERFACES
   ========================================== */

// Defines the allowed global luxury themes across the brand's digital ecosystem
export type Theme = 'obsidian' | 'cyber' | 'ivory' | 'emerald';

// Extends the base Product type to explicitly track unique garment configurations chosen by the client
export type CartItem = Product & { 
  orderQuantity: number;
  selectedSize: string;
  selectedColor: string;
  selectedGender: string;
};

// Contract outlining all properties, state flags, and mutation functions exposed by the context engine
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

// Creates the actual React context instance (defaults to undefined until wrapped by the Provider)
const ShopContext = createContext<ShopContextType | undefined>(undefined);

/* ==========================================
   STATE PROVIDER CORE ENGINE
   ========================================== */

export function ShopProvider({ children }: { children: React.ReactNode }) {
  /* --- Core Data Memory Collections --- */
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  
  /* --- UI Interface State Flags --- */
  const [theme, setThemeState] = useState<Theme>('obsidian');
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(false);
  const [isCartOpen, setCartOpen] = useState<boolean>(false);
  const [isWishlistOpen, setWishlistOpen] = useState<boolean>(false);
  const [isOracleOpen, setOracleOpen] = useState<boolean>(false);

  /* --- Infrastructure Tracking Refs --- */
  // Used to skip running database sync requests during the component's initial mounting layout pass
  const isFirstRender = useRef(true);

  /* ==========================================
     SYNCHRONIZATION SIDE-EFFECTS (EFFECTS LOOP)
     ========================================== */

  // Hook 1: Initial Hydration on Mount
  // Safely loads cached data strings from browser LocalStorage to restore user state upon page reload
  useEffect(() => {
    const savedCart = localStorage.getItem("norex_cart");
    const savedWishlist = localStorage.getItem("norex_wishlist");
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  }, []);

  // Hook 2: State Persistence & Database Sync
  // Monitored by [cart, wishlist] modifications. Writes changes to localStorage and debounces a sync fetch down to MongoDB
  useEffect(() => {
    localStorage.setItem("norex_cart", JSON.stringify(cart));
    localStorage.setItem("norex_wishlist", JSON.stringify(wishlist));

    // Guard: Prevents clean database entries from being overwritten by blank states on mount
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Normalizes wishlist array map objects to contain clean product ID strings
    const sanitizedWishlistIds = wishlist.map((item: any) => item.id || item._id);

    // Dispatches state updates down to your Next.js API sync router pipeline
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

    // Debounce loop (800ms) to throttle rapid input mutations (e.g., clicking item quantities repeatedly)
    const debounceTimeout = setTimeout(() => {
      syncDatabaseLedger();
    }, 800);

    return () => clearTimeout(debounceTimeout);
  }, [cart, wishlist]);

  // Hook 3: Global HTML Theme Node Painter
  // Injects/clears the active visual theme class strings straight onto the browser DOM document root element
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.classList.remove('theme-obsidian', 'theme-cyber', 'theme-ivory', 'theme-emerald');
      root.classList.add(`theme-${theme}`);
    }
  }, [theme]);

  /* ==========================================
     MUTATION CONTROLLERS (ACTION HANDLERS)
     ========================================== */

  // Swaps out themes globally and triggers an ambient audio notification sweep
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (soundEnabled) sounds.playSweep();
  };

  // Configures global client audio parameters and plays a system sound chord verification check
  const setSoundEnabled = (enabled: boolean) => {
    setSoundEnabledState(enabled);
    sounds.enable(enabled);
    if (enabled) {
      setTimeout(() => { sounds.playChord(); }, 50);
    }
  };

  // Adds or increments a product, treating unique size/color/gender configurations as distinct line entries
  const addToCart = (product: any, quantity = 1) => {
    const targetSize = product.selectedSize || "M";
    const targetColor = product.selectedColor || "Default Matrix";
    const targetGender = product.selectedGender || product.gender || "Female";
    const targetId = product.id || product._id;

    setCart((prev) => {
      // Identity check match closure criteria mapping
      const isMatch = (item: CartItem) => 
        item.id === targetId && 
        item.selectedSize === targetSize && 
        item.selectedColor === targetColor && 
        item.selectedGender === targetGender;

      const existing = prev.find(isMatch);
      if (existing) {
        // If an entry matching all properties exists, increment the quantity
        return prev.map((item) =>
          isMatch(item) ? { ...item, orderQuantity: item.orderQuantity + quantity } : item
        );
      }
      
      // If it's a completely distinct style variant setup, append a fresh object item node
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

  // Filters out specific items matching exact style variants from the collection
  const removeFromCart = (productId: string, size: string, color: string, gender: string) => {
    setCart((prev) => prev.filter((item) => !(
      item.id === productId && 
      item.selectedSize === size && 
      item.selectedColor === color && 
      item.selectedGender === gender
    )));
    if (soundEnabled) sounds.playPop();
  };

  // Locates specific line item variants and assigns a fresh explicit order quantity value
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

  // Completely flushes out all active contents inside your cart array
  const clearCart = () => {
    setCart([]);
    if (soundEnabled) sounds.playPop();
  };

  // Toggles items in or out of the user's wishlist depending on whether its ID is already saved
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

  // Returns a quick boolean check assessing if a product ID matches an item in the current wishlist
  const isInWishlist = (productId: string) => !!wishlist.find((item) => (item.id || (item as any)._id) === productId);

  /* ==========================================
     COMPUTED DATA & RENDER PACKAGING
     ========================================== */

  // Dynamic accumulator computing the total cash cost of all items in the bag context
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

/* ==========================================
   CUSTOM INVOCATION HOOK ACCESS
   ========================================== */

// Exposes context parameters cleanly down to frontend sub-components, checking bounds safety automatically
export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop must be used within a ShopProvider");
  return context;
};