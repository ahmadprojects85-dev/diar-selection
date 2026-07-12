"use client";

import Link from "next/link";
import { ChevronRight, Heart, ArrowRight } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { ProductCard } from "@/components/ProductCard";

export function WishlistClient() {
  const { wishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="pt-20 lg:pt-24 pb-20 min-h-screen flex flex-col">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-text-muted mb-8">
          <Link href="/" className="hover:text-gold transition-colors">
            Home
          </Link>
          <ChevronRight size={12} />
          <span className="text-text-secondary">My Wishlist</span>
        </nav>

        {/* Header */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-3 flex items-center gap-4">
              My Wishlist
              <Heart size={32} className="text-gold fill-gold/20" />
            </h1>
            <p className="text-text-secondary text-base">
              Products you have saved for later.
            </p>
          </div>
          <div className="flex items-center gap-4 hidden sm:flex">
            <span className="text-text-muted text-sm">
              {wishlist.length} item{wishlist.length !== 1 ? "s" : ""}
            </span>
            {wishlist.length > 0 && (
              <button
                onClick={() => {
                  wishlist.forEach((item) => {
                    addToCart(item as any, 1);
                  });
                }}
                className="px-6 py-2.5 bg-text-primary text-bg-primary rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gold transition-colors whitespace-nowrap"
              >
                Add All to Cart
              </button>
            )}
          </div>
        </div>

        {wishlist.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-5">
            {/* The wishlist items are minimal StoreProduct objects (missing description etc) but have enough for ProductCard */}
            {wishlist.map((item) => (
              <ProductCard key={item.id} product={item as any} />
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
            <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
              <Heart size={40} className="text-text-muted" />
            </div>
            <h2 className="text-2xl font-serif text-text-primary mb-4">Your wishlist is empty</h2>
            <p className="text-text-secondary max-w-md mb-8">
              Looks like you haven't saved any products yet. Browse our collection and click the heart icon to save items here.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gold hover:bg-[#B8965E] text-bg-primary font-bold uppercase tracking-widest rounded-xl transition-all duration-300 text-sm"
            >
              Explore Products
              <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
