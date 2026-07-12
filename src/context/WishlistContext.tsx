"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { StoreProduct } from "@/lib/products";

// We store a minimal representation of the product in the wishlist
export type WishlistItem = Pick<StoreProduct, "id" | "slug" | "name" | "price" | "images" | "brand" | "inStock" | "isBestSeller">;

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (product: StoreProduct | WishlistItem) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("wishlist");
      if (stored) {
        setWishlist(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load wishlist from local storage", e);
    }
    setIsInitialized(true);
  }, []);

  // Save to local storage whenever wishlist changes, but only after initial load
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
      } catch (e) {
        console.error("Failed to save wishlist to local storage", e);
      }
    }
  }, [wishlist, isInitialized]);

  const addToWishlist = (product: StoreProduct | WishlistItem) => {
    setWishlist((prev) => {
      // Don't add if it already exists
      if (prev.some((item) => item.id === product.id)) {
        return prev;
      }
      
      const item: WishlistItem = {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        images: product.images,
        brand: product.brand,
        inStock: product.inStock,
        isBestSeller: product.isBestSeller,
      };
      
      return [...prev, item];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        wishlistCount: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
