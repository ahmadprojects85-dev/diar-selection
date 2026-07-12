"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MessageCircle,
  ChevronRight,
  BadgeCheck,
  ShieldCheck,
  Check,
  Heart,
  ShoppingCart,
} from "lucide-react";
import type { StoreProduct } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { getWhatsAppOrderUrl, getWhatsAppOrderWithDetailsUrl } from "@/lib/whatsapp";

interface Props {
  product: StoreProduct;
  relatedProducts: StoreProduct[];
}

export function ProductDetailClient({ product, relatedProducts }: Props) {
  const [selectedImage, setSelectedImage] = useState(0);
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { t, language } = useLanguage();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    city: "",
    address: "",
  });

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = getWhatsAppOrderWithDetailsUrl(product, formData);
    window.open(url, "_blank", "noopener,noreferrer");
    setIsOrderModalOpen(false);
    setFormData({ fullName: "", phone: "", city: "", address: "" });
  };
  
  const isSaved = isInWishlist(product.id);
  const toggleWishlist = () => {
    if (isSaved) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  // Combine main thumbnail image and gallery images, removing duplicates, and ensure absolute path
  const allImages = [product.image, ...product.images]
    .filter(Boolean)
    .filter((v, i, a) => a.indexOf(v) === i)
    .map(img => img.startsWith('http') || img.startsWith('/') ? img : `/${img}`);

  return (
    <div className="pt-20 lg:pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-text-muted mb-8">
          <Link href="/" className="hover:text-gold transition-colors">
            Home
          </Link>
          <ChevronRight size={12} />
          <Link href="/products" className="hover:text-gold transition-colors">
            Products
          </Link>
          <ChevronRight size={12} />
          <span className="text-text-secondary">{product.name}</span>
        </nav>

        {/* Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left — Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square rounded-2xl overflow-hidden bg-bg-card border border-border">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url('${allImages[selectedImage]}')`,
                }}
              />
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-colors ${
                      selectedImage === i
                        ? "border-gold"
                        : "border-border hover:border-border-light"
                    }`}
                  >
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url('${img}')` }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right — Product Info */}
          <div className="space-y-6">
            {/* Brand + Badge */}
            <div className="flex items-center gap-3">
              <span className="text-text-muted text-sm uppercase tracking-wider">
                {product.brand}
              </span>
              {product.officialProduct && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gold/10 border border-gold/20 rounded-full text-gold text-[10px] font-medium">
                  <BadgeCheck size={12} />
                  Official Product
                </span>
              )}
            </div>

            {/* Name */}
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-text-primary leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-4">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold" style={{ color: 'black' }}>
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-text-muted line-through text-lg">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              {!product.inStock && (
                <span className="px-3 py-1 bg-red-900/20 text-red-400 border border-red-900/50 rounded-full text-xs font-bold uppercase tracking-widest">
                  Sold Out
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-text-secondary leading-relaxed">
              {product.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4">
              {/* Option 1: Order via WhatsApp (Direct Link) */}
              <button
                onClick={() => {
                  const url = getWhatsAppOrderUrl(product);
                  window.open(url, "_blank", "noopener,noreferrer");
                }}
                className="w-full h-[54px] sm:h-[58px] flex items-center justify-center gap-3 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold uppercase tracking-widest rounded-full transition-all duration-300 text-xs sm:text-sm shadow-lg shadow-[#16a34a]/15 hover:shadow-xl hover:shadow-[#16a34a]/20 transform hover:-translate-y-0.5"
              >
                <MessageCircle size={20} className="text-white" />
                {t("orderWhatsApp")}
              </button>

              {/* Option 2: Order with Delivery Info (Form modal popup) */}
              <button
                onClick={() => setIsOrderModalOpen(true)}
                className="w-full h-[54px] sm:h-[58px] flex items-center justify-center gap-3 bg-[#D4A24C] hover:bg-[#c29340] text-white font-bold uppercase tracking-widest rounded-full transition-all duration-300 text-xs sm:text-sm shadow-lg shadow-[#D4A24C]/15 hover:shadow-xl hover:shadow-[#D4A24C]/20 transform hover:-translate-y-0.5"
              >
                <MessageCircle size={20} className="text-white" />
                {t("orderWithDetails")}
              </button>

              {/* Option 3: Standard E-Commerce (Add to Cart & Wishlist) */}
              <div className="flex items-center gap-3">
                {product.inStock ? (
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 h-[54px] sm:h-[58px] flex items-center justify-center gap-3 bg-text-primary hover:bg-gold hover:text-bg-primary text-bg-primary font-bold uppercase tracking-widest rounded-full transition-all duration-300 text-xs sm:text-sm shadow-lg shadow-black/5 transform hover:-translate-y-0.5"
                  >
                    <ShoppingCart size={20} />
                    {t("addToCart")}
                  </button>
                ) : (
                  <button
                    disabled
                    className="flex-1 h-[54px] sm:h-[58px] flex items-center justify-center gap-3 bg-bg-card border border-border text-text-muted font-bold uppercase tracking-widest rounded-full text-xs sm:text-sm cursor-not-allowed"
                  >
                    {t("outOfStock")}
                  </button>
                )}
                
                {/* Wishlist Circle Button */}
                <button
                  onClick={toggleWishlist}
                  className={`w-[54px] h-[54px] sm:w-[58px] sm:h-[58px] shrink-0 flex items-center justify-center rounded-full border transition-all duration-300 transform hover:-translate-y-0.5 ${
                    isSaved 
                      ? "bg-gold/10 border-gold text-gold" 
                      : "bg-bg-card border-border text-text-muted hover:border-gold hover:text-gold"
                  }`}
                  aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart size={20} className={isSaved ? "fill-current" : ""} />
                </button>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-6 pt-2">
              <div className="flex items-center gap-2 text-text-muted text-xs">
                <ShieldCheck size={14} className="text-gold" />
                100% Authentic
              </div>
              <div className="flex items-center gap-2 text-text-muted text-xs">
                <BadgeCheck size={14} className="text-gold" />
                Official Brand
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-border pt-6 space-y-6">
              {/* Features */}
              <div>
                <h3 className="text-text-primary text-sm font-semibold mb-3 uppercase tracking-wider">
                  Features
                </h3>
                <ul className="space-y-2">
                  {product.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-text-secondary text-sm"
                    >
                      <Check
                        size={14}
                        className="text-gold mt-0.5 flex-shrink-0"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Specifications */}
              <div>
                <h3 className="text-text-primary text-sm font-semibold mb-3 uppercase tracking-wider">
                  Specifications
                </h3>
                <div className="space-y-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                    >
                      <span className="text-text-muted text-sm">{key}</span>
                      <span className="text-text-primary text-sm font-medium">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SKU */}
              <p className="text-text-muted text-xs">
                SKU: {product.sku}
              </p>
            </div>
          </div>
        </div>

        {/* External / Long Description */}
        {(() => {
          const displayLongDescription = 
            language === "ar" ? (product.longDescriptionAr || product.longDescription) :
            language === "ku" ? (product.longDescriptionKu || product.longDescription) :
            product.longDescription;

          if (!displayLongDescription) return null;

          return (
            <div className="mt-16 lg:mt-24 border-t border-border/50 pt-12 lg:pt-16 max-w-4xl mx-auto">
              <h2 className={`font-serif text-2xl sm:text-3xl font-bold text-text-primary mb-8 ${language === "ar" || language === "ku" ? "text-right" : "text-left"}`}>
                {language === "ar" ? "تفاصيل إضافية" : language === "ku" ? "وردەکاری زیاتر" : "More About This Product"}
              </h2>
              <div 
                className={`text-text-secondary leading-relaxed sm:text-lg space-y-6 ${language === "ar" || language === "ku" ? "text-right" : "text-left"}`}
                style={{ whiteSpace: "pre-wrap" }}
              >
                {displayLongDescription}
              </div>
            </div>
          );
        })()}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 lg:mt-28">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* WhatsApp Order Modal */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsOrderModalOpen(false)}
          />

          {/* Modal Box */}
          <div className="relative w-full max-w-md bg-bg-card rounded-2xl border border-border shadow-2xl overflow-hidden z-10 p-6 sm:p-8 transform transition-all duration-300 scale-100 opacity-100">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-text-primary mb-2 text-start">
              {t("orderWithDetails")}
            </h2>
            <p className="text-xs sm:text-sm text-text-muted mb-6 leading-relaxed text-start">
              {language === "ku" 
                ? "تکایە ناونیشان و ژمارەی مۆبایلی خۆت بنووسە بۆ ئەوەی ڕاستەوخۆ داواکارییەکەت لە ڕێگەی واتساپەوە بۆ بنێرین."
                : language === "ar"
                ? "يرجى كتابة عنوانك ورقم هاتفك لنتمكن من إرسال طلبك مباشرة عبر واتساب."
                : "Please enter your address and phone number so we can send your order directly via WhatsApp."}
            </p>

            <form onSubmit={handleOrderSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-text-secondary mb-1.5 text-start">
                  {t("fullName")}
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder={language === "ku" ? "ناوی تەواو" : language === "ar" ? "الاسم الكامل" : "e.g. John Doe"}
                  className="w-full h-12 px-4 rounded-xl border border-border bg-bg-primary text-text-primary outline-none focus:border-gold transition-colors text-sm text-start"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-text-secondary mb-1.5 text-start">
                  {t("phoneNumber")}
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. 0770 123 4567"
                  className="w-full h-12 px-4 rounded-xl border border-border bg-bg-primary text-text-primary outline-none focus:border-gold transition-colors text-sm text-start"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-text-secondary mb-1.5 text-start">
                  {t("city")}
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder={language === "ku" ? "شار / شارۆچکە" : language === "ar" ? "المدينة" : "e.g. Erbil, Baghdad"}
                  className="w-full h-12 px-4 rounded-xl border border-border bg-bg-primary text-text-primary outline-none focus:border-gold transition-colors text-sm text-start"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-text-secondary mb-1.5 text-start">
                  {t("address")}
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder={language === "ku" ? "گەڕەک، شەقام، ژمارەی خانوو..." : language === "ar" ? "الحي، الشارع، تفاصيل المنزل..." : "Neighborhood, Street, House details..."}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-bg-primary text-text-primary outline-none focus:border-gold transition-colors text-sm resize-none text-start"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOrderModalOpen(false)}
                  className="flex-1 py-3 border border-border hover:bg-bg-primary text-text-secondary font-bold uppercase tracking-wider text-xs rounded-xl transition-all"
                >
                  {t("cancel")}
                </button>
                 <button
                  type="submit"
                  className="flex-1 py-3 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold uppercase tracking-wider text-xs rounded-xl transition-all shadow-lg shadow-[#16a34a]/15 flex items-center justify-center gap-2"
                >
                  <MessageCircle size={16} />
                  {t("confirmOrder")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
