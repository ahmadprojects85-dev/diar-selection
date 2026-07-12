"use client";

import Link from "next/link";
import { ArrowRight, Heart, ShoppingCart } from "lucide-react";
import type { StoreProduct } from "@/lib/products";
import { useWishlist } from "@/context/WishlistContext";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: StoreProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { t, language } = useLanguage();
  const isSaved = isInWishlist(product.id);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isSaved) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.inStock) {
      addToCart(product, 1);
    }
  };

  // Gracefully fallback to the first gallery image if the main image is missing
  const mainImg = product.image || (product.images && product.images.length > 0 ? product.images[0] : null);
  const bgImage = mainImg 
    ? (mainImg.startsWith('http') || mainImg.startsWith('/') ? mainImg : `/${mainImg}`) 
    : '';

  return (
    <div className="group rounded-2xl sm:rounded-[24px] overflow-hidden border border-border/50 hover:border-gold/30 transition-all duration-500 flex flex-col h-full bg-bg-card"
         style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
      {/* Image Container */}
      <Link href={`/products/${product.slug}`} className="block relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden bg-bg-elevated">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url('${bgImage}')` }}
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />

        {/* Wishlist Button */}
        <button
          onClick={toggleWishlist}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 p-2 sm:p-2.5 rounded-full bg-bg-card/80 backdrop-blur-md border border-border text-text-primary hover:bg-gold hover:border-gold hover:text-bg-primary transition-all duration-300 transform group-hover:scale-110"
          aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={14} className={`sm:w-4 sm:h-4 ${isSaved ? "fill-current text-gold" : ""}`} />
        </button>
      </Link>

      {/* Info */}
      <div className="p-3 sm:p-6 flex flex-col flex-1 justify-between gap-2 sm:gap-4">
        <div>
          {/* Badges */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-3">
            {!product.inStock && (
              <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-text-primary text-bg-primary text-[8px] sm:text-[9px] font-bold uppercase tracking-widest rounded-md">
                {t("soldOut")}
              </span>
            )}
            {product.isBestSeller && product.inStock && (
              <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gold text-bg-primary text-[8px] sm:text-[9px] font-bold uppercase tracking-widest rounded-md">
                {t("bestSeller")}
              </span>
            )}
          </div>

          {/* Name */}
          <Link href={`/products/${product.slug}`}>
            <h3 className="text-text-primary text-[13px] sm:text-[17px] font-medium leading-snug group-hover:text-gold transition-colors line-clamp-2 mb-0.5 sm:mb-1">
              {product.name}
            </h3>
          </Link>

          {/* Category */}
          <p className="text-[10px] sm:text-[12px] font-medium tracking-widest uppercase text-text-muted/80">
            {product.category}
          </p>
        </div>

        {/* Price + Action */}
        <div className="pt-2 sm:pt-4 flex flex-col gap-2.5 sm:gap-3 mt-auto">
          <span className="font-bold text-[17px] sm:text-[22px] text-text-primary break-words tracking-tight">
            ${product.price.toFixed(2)}
          </span>
          
          <div className="flex items-center gap-2">
            <Link
              href={`/products/${product.slug}`}
              className="flex-1 flex items-center justify-center h-9 sm:h-11 rounded-lg sm:rounded-xl bg-text-primary text-bg-primary hover:bg-gold hover:text-bg-primary transition-all duration-300 text-[11px] font-bold uppercase tracking-widest px-2 text-center leading-tight"
            >
              {t("viewProduct")}
            </Link>
            
            {product.inStock && (
              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center shrink-0 w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-bg-elevated text-text-primary border border-border hover:border-gold hover:text-gold active:bg-gold/10 transition-all duration-300"
                aria-label="Add to Cart"
              >
                <ShoppingCart size={14} className="sm:w-5 sm:h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
