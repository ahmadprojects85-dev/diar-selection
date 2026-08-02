"use client";

import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import type { StoreProduct } from "@/lib/products";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";
import { formatPrice } from "@/lib/price";

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

  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(-1);

  // Gracefully fallback to the first gallery image if the main image is missing
  let mainImg = product.image || (product.images && product.images.length > 0 ? product.images[0] : null);
  
  if (selectedColorIndex >= 0 && product.colors && product.colors[selectedColorIndex]) {
    mainImg = product.colors[selectedColorIndex].image || mainImg;
  }
  
  const bgImage = mainImg 
    ? (mainImg.startsWith('http') || mainImg.startsWith('/') ? mainImg : `/${mainImg}`) 
    : '';

  const isNewActive = Boolean(
    (product as any).isNew &&
    (!product.createdAt || (Date.now() - new Date(product.createdAt).getTime() <= 7 * 24 * 60 * 60 * 1000))
  );

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

        {/* Wishlist Button — Top Right */}
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
          {/* Badges — Clean & Non-obscuring */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            {isNewActive && product.inStock && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#10b981] text-white text-[10px] sm:text-[11px] font-black uppercase tracking-wider rounded-md shadow-sm shadow-[#10b981]/40">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                {t("newArrival")}
              </span>
            )}
            {product.isBestSeller && product.inStock && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#d49f37] text-bg-primary text-[10px] sm:text-[11px] font-black uppercase tracking-wider rounded-md shadow-sm shadow-[#d49f37]/40">
                ★ {t("bestSeller")}
              </span>
            )}
            {!product.inStock && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-500/10 border border-red-500/30 text-red-500 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider rounded-md">
                {t("soldOut")}
              </span>
            )}
          </div>

          {/* Name */}
          <Link href={`/products/${product.slug}`}>
            <h3 className="text-text-primary text-[13px] sm:text-[17px] font-medium leading-snug group-hover:text-gold transition-colors line-clamp-2 mb-0.5 sm:mb-1">
              {language === "ar"
                ? (product.nameAr || product.name)
                : language === "kmr"
                ? ((product as any).nameKm || product.nameKu || product.name)
                : language === "ku"
                ? (product.nameKu || product.name)
                : product.name}
            </h3>
          </Link>

          {/* Category */}
          <p className="text-[10px] sm:text-[12px] font-medium tracking-widest uppercase text-text-muted/80">
            {product.category}
          </p>
          
          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex justify-center gap-2 mt-2">
              {product.colors.map((color, index) => (
                <button
                  key={color.id || index}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedColorIndex(index);
                  }}
                  onMouseEnter={() => setSelectedColorIndex(index)}
                  className={`w-5 h-5 rounded-full border-2 transition-all ${selectedColorIndex === index ? 'border-gold scale-110' : 'border-border/50 hover:scale-110'}`}
                  style={{ backgroundColor: color.colorCode }}
                  title={color.name}
                />
              ))}
            </div>
          )}
        </div>

        {/* Price + Action */}
        <div className="pt-2 sm:pt-4 flex flex-col gap-2.5 sm:gap-3 mt-auto">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-bold text-[17px] sm:text-[22px] text-text-primary break-words tracking-tight">
              {formatPrice(product.price, language)}
            </span>
            {product.originalPrice != null && product.originalPrice > 0 && (
              <span className="text-[12px] sm:text-[14px] text-text-muted line-through font-medium">
                {formatPrice(product.originalPrice, language)}
              </span>
            )}
          </div>
          
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
