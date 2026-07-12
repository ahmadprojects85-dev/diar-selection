"use client";

import { X, Minus, Plus, ShoppingCart, ArrowRight, MessageCircle } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { getWhatsAppCartUrl } from "@/lib/whatsapp";
import { useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export function CartDrawer() {
  const { isCartOpen, closeCart, cart, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const { language } = useLanguage();
  const isRTL = language === "ar" || language === "ku";

  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  const handleCheckout = () => {
    const url = getWhatsAppCartUrl(cart, cartTotal);
    window.open(url, "_blank", "noopener,noreferrer");
    clearCart();
    closeCart();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-300 ${
          isCartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 bottom-0 ${isRTL ? "left-0" : "right-0"} w-full max-w-[420px] bg-bg-primary z-[101] shadow-2xl transition-transform duration-500 ease-in-out flex flex-col ${
          isCartOpen
            ? "translate-x-0"
            : isRTL ? "-translate-x-full" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3 text-text-primary">
            <ShoppingCart size={24} />
            <h2 className="font-serif text-2xl font-bold">Your Cart</h2>
          </div>
          <button
            onClick={closeCart}
            className="p-2 -mr-2 text-text-muted hover:text-text-primary hover:bg-bg-elevated rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-70">
              <ShoppingCart size={48} className="text-text-muted mb-2" />
              <p className="text-text-primary font-medium text-lg">Your cart is empty</p>
              <p className="text-text-muted text-sm max-w-[200px]">
                Looks like you haven't added any premium coffee tools yet.
              </p>
              <button
                onClick={closeCart}
                className="mt-4 px-6 py-2.5 bg-text-primary text-bg-primary rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gold transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 group">
                <Link href={`/products/${item.slug}`} onClick={closeCart} className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-bg-card border border-border group-hover:border-gold/50 transition-colors">
                  <Image
                    src={item.images[0]}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </Link>
                <div className="flex flex-col flex-1 py-1">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="text-text-muted text-[10px] uppercase tracking-wider block mb-1">
                        {item.brand}
                      </span>
                      <Link href={`/products/${item.slug}`} onClick={closeCart} className="text-text-primary font-medium text-sm leading-snug line-clamp-2 hover:text-gold transition-colors">
                        {item.name}
                      </Link>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 -mr-1.5 text-text-muted hover:text-red-500 rounded-md transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  
                  <div className="mt-auto flex items-center justify-between">
                    <span className="font-semibold text-text-primary">
                      ${item.price.toFixed(2)}
                    </span>
                    
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-3 bg-bg-elevated border border-border rounded-lg p-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-primary rounded transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-xs font-medium w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-primary rounded transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Checkout */}
        {cart.length > 0 && (
          <div className="border-t border-border p-6 bg-bg-card">
            <div className="flex items-center justify-between mb-4">
              <span className="text-text-muted font-medium">Subtotal</span>
              <span className="text-2xl font-bold text-text-primary">
                ${cartTotal.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-text-muted mb-6">
              Shipping and taxes calculated at checkout via WhatsApp.
            </p>
            <button
              onClick={handleCheckout}
              className="w-full flex items-center justify-center gap-3 py-4 bg-[#128C7E] hover:bg-[#075E54] text-white rounded-xl font-bold uppercase tracking-widest text-sm transition-all duration-300 shadow-xl shadow-[#128C7E]/20"
            >
              <MessageCircle size={20} className="text-white" />
              Checkout via WhatsApp
            </button>
          </div>
        )}
      </div>
    </>
  );
}
