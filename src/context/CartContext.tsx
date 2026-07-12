"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { StoreProduct } from "@/lib/products";

export interface CartItem extends Pick<StoreProduct, "id" | "slug" | "name" | "price" | "images" | "brand"> {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: StoreProduct, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("cart");
      if (stored) {
        setCart(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load cart from local storage", e);
    }
    setIsInitialized(true);
  }, []);

  // Save to local storage whenever cart changes, but only after initial load
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem("cart", JSON.stringify(cart));
      } catch (e) {
        console.error("Failed to save cart to local storage", e);
      }
    }
  }, [cart, isInitialized]);

  const addToCart = (product: StoreProduct, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      const item: CartItem = {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        images: product.images,
        brand: product.brand,
        quantity,
      };

      return [...prev, item];
    });
    setIsCartOpen(true); // Auto-open cart when adding items
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        isCartOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
