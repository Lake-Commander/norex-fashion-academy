"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { Product } from "@/types";
import { sounds } from "@/lib/sound-utils";

export type Theme = "obsidian" | "cyber" | "ivory" | "emerald";

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

function getItemId(item: any): string {
  return String(item?.id || item?._id || "");
}

function readLocalArray(key: string): any[] {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [theme, setThemeState] = useState<Theme>("obsidian");
  const [soundEnabled, setSoundEnabledState] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);
  const [isWishlistOpen, setWishlistOpen] = useState(false);
  const [isOracleOpen, setOracleOpen] = useState(false);
  const { data: session, status } = useSession();

  const isHydrated = useRef(false);
  const hydratedEmail = useRef<string | null>(null);
  const mutationRevision = useRef(0);
  const savedRevision = useRef(0);
  const accountSyncInFlight = useRef(false);

  const markLocalChange = () => {
    mutationRevision.current += 1;
  };

  useEffect(() => {
    if (status === "loading") return;

    const email = session?.user?.email?.toLowerCase().trim() || null;
    if (status === "authenticated" && hydratedEmail.current === email) return;
    if (status === "unauthenticated" && isHydrated.current && hydratedEmail.current === null) return;

    let cancelled = false;

    async function hydrate() {
      if (status === "authenticated") {
        const migratedEmail = localStorage.getItem("norex_migrated_account");
        const shouldMergeGuests = !migratedEmail || migratedEmail === "legacy";
        const guestCart = shouldMergeGuests
          ? readLocalArray("norex_guest_cart").length
            ? readLocalArray("norex_guest_cart")
            : readLocalArray("norex_cart")
          : [];
        const guestWishlist = shouldMergeGuests
          ? readLocalArray("norex_guest_wishlist").length
            ? readLocalArray("norex_guest_wishlist")
            : readLocalArray("norex_wishlist")
          : [];

        try {
          const response = await fetch("/api/user/sync", { cache: "no-store" });
          const data = await response.json();
          if (!response.ok || !data.success) throw new Error(data.error || "Could not load account state.");

          if (cancelled) return;

          const accountCart: CartItem[] = Array.isArray(data.cart) ? data.cart : [];
          const accountWishlist: Product[] = Array.isArray(data.wishlist) ? data.wishlist : [];

          const mergedCart = [...accountCart];
          for (const guestItem of guestCart as CartItem[]) {
            const guestId = getItemId(guestItem);
            const existingIndex = mergedCart.findIndex((item) =>
              getItemId(item) === guestId &&
              item.selectedSize === guestItem.selectedSize &&
              item.selectedColor === guestItem.selectedColor &&
              item.selectedGender === guestItem.selectedGender
            );

            if (existingIndex >= 0) {
              mergedCart[existingIndex] = {
                ...mergedCart[existingIndex],
                orderQuantity:
                  (mergedCart[existingIndex].orderQuantity || 1) +
                  (guestItem.orderQuantity || 1),
              };
            } else {
              mergedCart.push(guestItem);
            }
          }

          const mergedWishlist = [...accountWishlist];
          for (const guestItem of guestWishlist) {
            const guestId = getItemId(guestItem);
            if (guestId && !mergedWishlist.some((item) => getItemId(item) === guestId)) {
              mergedWishlist.push(guestItem);
            }
          }

          hydratedEmail.current = email;
          mutationRevision.current = 0;
          savedRevision.current = 0;
          isHydrated.current = true;
          setCart(mergedCart);
          setWishlist(mergedWishlist);

          localStorage.setItem("norex_cart", JSON.stringify(mergedCart));
          localStorage.setItem("norex_wishlist", JSON.stringify(mergedWishlist));
          if (email) localStorage.setItem("norex_migrated_account", email);

          if (guestCart.length || guestWishlist.length) {
            const wishlistIds = mergedWishlist.map(getItemId).filter(Boolean);
            await fetch("/api/user/sync", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ cart: mergedCart, wishlist: wishlistIds }),
              keepalive: true,
            }).catch(() => undefined);
            savedRevision.current = mutationRevision.current;
          }
        } catch (error) {
          console.error("Account shop state could not be loaded:", error);
          if (!cancelled) {
            setCart(Array.isArray(guestCart) ? guestCart : []);
            setWishlist(Array.isArray(guestWishlist) ? guestWishlist : []);
            hydratedEmail.current = email;
            isHydrated.current = true;
          }
        }
        return;
      }

      hydratedEmail.current = null;
      isHydrated.current = true;
      const guestCart =
        readLocalArray("norex_guest_cart").length
          ? readLocalArray("norex_guest_cart")
          : readLocalArray("norex_cart");
      const guestWishlist =
        readLocalArray("norex_guest_wishlist").length
          ? readLocalArray("norex_guest_wishlist")
          : readLocalArray("norex_wishlist");
      setCart(guestCart as CartItem[]);
      setWishlist(guestWishlist as Product[]);
    }

    isHydrated.current = false;
    void hydrate();
    return () => {
      cancelled = true;
    };
  }, [status, session?.user?.email]);

  useEffect(() => {
    if (!isHydrated.current) return;

    if (status === "authenticated") {
      localStorage.setItem("norex_cart", JSON.stringify(cart));
      localStorage.setItem("norex_wishlist", JSON.stringify(wishlist));
    } else {
      localStorage.setItem("norex_guest_cart", JSON.stringify(cart));
      localStorage.setItem("norex_guest_wishlist", JSON.stringify(wishlist));
    }

    if (status !== "authenticated") return;
    if (mutationRevision.current === savedRevision.current) return;

    const timeout = window.setTimeout(async () => {
      if (accountSyncInFlight.current) return;
      accountSyncInFlight.current = true;
      const revisionToSave = mutationRevision.current;

      try {
        const response = await fetch("/api/user/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cart,
            wishlist: wishlist.map(getItemId).filter(Boolean),
          }),
          keepalive: true,
        });
        if (!response.ok) throw new Error("Account synchronization failed.");
        savedRevision.current = revisionToSave;
      } catch (error) {
        console.error("Could not save shop state:", error);
      } finally {
        accountSyncInFlight.current = false;
      }
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [cart, wishlist, status]);

  useEffect(() => {
    if (status !== "authenticated") return;

    async function pullAccountState() {
      if (mutationRevision.current !== savedRevision.current) return;

      try {
        const response = await fetch("/api/user/sync", { cache: "no-store" });
        const data = await response.json();
        if (!response.ok || !data.success) return;
        if (mutationRevision.current !== savedRevision.current) return;

        setCart(Array.isArray(data.cart) ? data.cart : []);
        setWishlist(Array.isArray(data.wishlist) ? data.wishlist : []);
        localStorage.setItem("norex_cart", JSON.stringify(data.cart || []));
        localStorage.setItem("norex_wishlist", JSON.stringify(data.wishlist || []));
      } catch {
        // Preserve the last known local state during temporary network failures.
      }
    }

    const interval = window.setInterval(pullAccountState, 5000);
    window.addEventListener("focus", pullAccountState);
    document.addEventListener("visibilitychange", pullAccountState);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", pullAccountState);
      document.removeEventListener("visibilitychange", pullAccountState);
    };
  }, [status]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      root.classList.remove("theme-obsidian", "theme-cyber", "theme-ivory", "theme-emerald");
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
    if (enabled) window.setTimeout(() => sounds.playChord(), 50);
  };

  const addToCart = (product: any, quantity = 1) => {
    markLocalChange();
    const targetSize = product.selectedSize || "M";
    const targetColor = product.selectedColor || "Default Matrix";
    const targetGender = product.selectedGender || product.gender || "Female";
    const targetId = getItemId(product);

    setCart((previous) => {
      const matches = (item: CartItem) =>
        getItemId(item) === targetId &&
        item.selectedSize === targetSize &&
        item.selectedColor === targetColor &&
        item.selectedGender === targetGender;
      const existing = previous.find(matches);

      if (existing) {
        return previous.map((item) =>
          matches(item)
            ? { ...item, orderQuantity: item.orderQuantity + quantity }
            : item
        );
      }

      return [
        ...previous,
        {
          ...product,
          id: targetId,
          selectedSize: targetSize,
          selectedColor: targetColor,
          selectedGender: targetGender,
          orderQuantity: quantity,
        },
      ];
    });
    if (soundEnabled) sounds.playSuccess();
  };

  const removeFromCart = (productId: string, size: string, color: string, gender: string) => {
    markLocalChange();
    setCart((previous) =>
      previous.filter((item) =>
        !(getItemId(item) === productId &&
          item.selectedSize === size &&
          item.selectedColor === color &&
          item.selectedGender === gender)
      )
    );
    if (soundEnabled) sounds.playPop();
  };

  const updateQuantity = (
    productId: string,
    size: string,
    color: string,
    gender: string,
    quantity: number
  ) => {
    if (quantity < 1) return;
    markLocalChange();
    setCart((previous) =>
      previous.map((item) =>
        getItemId(item) === productId &&
        item.selectedSize === size &&
        item.selectedColor === color &&
        item.selectedGender === gender
          ? { ...item, orderQuantity: quantity }
          : item
      )
    );
    if (soundEnabled) sounds.playClick();
  };

  const clearCart = () => {
    markLocalChange();
    setCart([]);
    if (soundEnabled) sounds.playPop();
  };

  const toggleWishlist = (product: Product) => {
    markLocalChange();
    const targetId = getItemId(product);
    if (!targetId) return;

    setWishlist((previous) => {
      if (previous.some((item) => getItemId(item) === targetId)) {
        if (soundEnabled) sounds.playPop();
        return previous.filter((item) => getItemId(item) !== targetId);
      }
      if (soundEnabled) sounds.playSuccess();
      return [...previous, { ...product, id: targetId }];
    });
  };

  const isInWishlist = (productId: string) =>
    wishlist.some((item) => getItemId(item) === productId);

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.orderQuantity,
    0
  );

  return (
    <ShopContext.Provider
      value={{
        cart,
        wishlist,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        theme,
        setTheme,
        soundEnabled,
        setSoundEnabled,
        isCartOpen,
        setCartOpen,
        isWishlistOpen,
        setWishlistOpen,
        isOracleOpen,
        setOracleOpen,
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
