"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { StoreProduct } from "@/lib/products";

export interface CartItem extends Pick<StoreProduct, "id" | "slug" | "name" | "nameAr" | "nameKu" | "price" | "image" | "images" | "brand"> {
  cartItemId: string; // unique id in cart (id + color)
  quantity: number;
  selectedColor?: import("@/lib/products").StoreProductColor;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: StoreProduct, quantity?: number, selectedColor?: import("@/lib/products").StoreProductColor) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
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

  const addToCart = (product: StoreProduct, quantity: number = 1, selectedColor?: import("@/lib/products").StoreProductColor) => {
    setCart((prev) => {
      const cartItemId = selectedColor ? `${product.id}-${selectedColor.name}` : product.id;
      const existing = prev.find((item) => item.cartItemId === cartItemId);
      
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      const item: CartItem = {
        id: product.id,
        cartItemId,
        slug: product.slug,
        name: product.name,
        nameAr: product.nameAr,
        nameKu: product.nameKu,
        price: product.price,
        image: selectedColor?.image || product.image,
        images: product.images,
        brand: product.brand,
        quantity,
        selectedColor,
      };

      return [...prev, item];
    });
    setIsCartOpen(true); // Auto-open cart when adding items
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity } : item
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
