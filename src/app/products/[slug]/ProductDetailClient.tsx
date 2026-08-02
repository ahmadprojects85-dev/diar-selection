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
  CreditCard,
  Sparkles,
} from "lucide-react";
import type { StoreProduct } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { getWhatsAppOrderUrl, getWhatsAppOrderWithDetailsUrl } from "@/lib/whatsapp";
import { formatPrice } from "@/lib/price";

const WhatsAppIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

const VisaIcon = ({ className = "w-7 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="36" height="24" rx="3" fill="#1434CB"/>
    <path d="M14.65 16.5H12.35L13.8 8.5H16.1L14.65 16.5ZM21.9 8.65C21.45 8.45 20.75 8.3 19.9 8.3C17.65 8.3 16.05 9.45 16.05 11.1C16.05 12.35 17.15 13.05 18.05 13.5C18.95 13.95 19.25 14.25 19.25 14.65C19.25 15.25 18.55 15.5 17.85 15.5C16.9 15.5 16.3 15.35 15.65 15.05L15.35 14.9L15 17.1C15.65 17.4 16.65 17.6 17.7 17.6C20.15 17.6 21.7 16.4 21.7 14.65C21.7 13.1 20.7 12.25 19.4 11.65C18.65 11.25 18.25 10.95 18.25 10.55C18.25 10.15 18.7 9.8 19.65 9.8C20.35 9.8 20.9 9.95 21.4 10.15L21.9 8.65ZM27.8 8.5H25.95C25.35 8.5 24.9 8.65 24.65 9.25L21.1 16.5H23.5L24 15.1H26.9L27.2 16.5H29.3L27.8 8.5ZM24.65 13.3L25.65 10.5L26.25 13.3H24.65ZM11.6 8.5L9.35 14L9.1 12.7C8.65 11.2 7.2 9.55 5.65 8.75L7.75 16.5H10.15L13.85 8.5H11.6Z" fill="white"/>
  </svg>
);

const MastercardIcon = ({ className = "w-7 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="36" height="24" rx="3" fill="#000000"/>
    <circle cx="13.5" cy="12" r="7.5" fill="#EB001B"/>
    <circle cx="22.5" cy="12" r="7.5" fill="#F79E1B"/>
    <path d="M18 6.6A7.47 7.47 0 0 0 15.3 12c0 2.2 1 4.2 2.7 5.4a7.47 7.47 0 0 0 2.7-5.4c0-2.2-1-4.2-2.7-5.4Z" fill="#FF5F00"/>
  </svg>
);

interface Props {
  product: StoreProduct;
  relatedProducts: StoreProduct[];
}

export function ProductDetailClient({ product, relatedProducts }: Props) {
  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(
    product.colors && product.colors.length > 0 ? 0 : -1
  );
  const selectedColor = selectedColorIndex >= 0 && product.colors ? product.colors[selectedColorIndex] : undefined;

  const [selectedImage, setSelectedImage] = useState(0);
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { t, language } = useLanguage();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [checkoutMethod, setCheckoutMethod] = useState<"whatsapp" | "online">("whatsapp");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    city: "",
    address: "",
  });

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const url = getWhatsAppOrderWithDetailsUrl({ ...product, selectedColor }, formData);
    window.open(url, "_blank", "noopener,noreferrer");
    setIsOrderModalOpen(false);
    setFormData({ fullName: "", phone: "", city: "", address: "" });
  };

  const triggerDirectOnlineCheckout = async () => {
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout/wayl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ 
            ...product, 
            quantity: 1, 
            selectedColor: selectedColor 
          }],
          customerDetails: {
            fullName: formData.fullName,
            phone: formData.phone,
            city: formData.city,
            address: formData.address
          }
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create payment link");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
    addToCart(product, 1, selectedColor);
  };

  // Combine main thumbnail image and gallery images, removing duplicates, and ensure absolute path
  let allImages = [product.image, ...product.images]
    .filter(Boolean)
    .filter((v, i, a) => a.indexOf(v) === i)
    .map(img => img.startsWith('http') || img.startsWith('/') ? img : `/${img}`);
    
  if (selectedColor && selectedColor.image) {
    const colorImg = selectedColor.image.startsWith('http') || selectedColor.image.startsWith('/') ? selectedColor.image : `/${selectedColor.image}`;
    if (!allImages.includes(colorImg)) {
      allImages.unshift(colorImg);
    }
  }

  return (
    <div className="pt-24 lg:pt-32 pb-20">
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
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-text-muted text-sm uppercase tracking-wider font-semibold">
                {product.brand}
              </span>
              {Boolean((product as any).isNew && (!product.createdAt || (Date.now() - new Date(product.createdAt).getTime() <= 7 * 24 * 60 * 60 * 1000))) && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#10b981] text-white rounded-full text-xs font-black uppercase tracking-wider shadow-sm shadow-[#10b981]/30">
                  <Sparkles size={13} />
                  {t("newArrival")}
                </span>
              )}
              {product.officialProduct && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gold/10 border border-gold/20 rounded-full text-gold text-[10px] font-medium">
                  <BadgeCheck size={12} />
                  Official Product
                </span>
              )}
            </div>

            {/* Name */}
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-text-primary leading-tight">
              {language === "ar"
                ? (product.nameAr || product.name)
                : language === "kmr"
                ? ((product as any).nameKm || product.nameKu || product.name)
                : language === "ku"
                ? (product.nameKu || product.name)
                : product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-4">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold" style={{ color: 'black' }}>
                  {formatPrice(product.price, language)}
                </span>
                {product.originalPrice && (
                  <span className="text-text-muted line-through text-lg">
                    {formatPrice(product.originalPrice, language)}
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
              {language === "ar"
                ? (product.descriptionAr || product.description)
                : language === "kmr"
                ? ((product as any).descriptionKm || product.descriptionKu || product.description)
                : language === "ku"
                ? (product.descriptionKu || product.description)
                : product.description}
            </p>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-text-primary">
                  Color: <span className="text-text-muted capitalize">{selectedColor?.name}</span>
                </h3>
                <div className="flex gap-3">
                  {product.colors.map((color, index) => (
                    <button
                      key={color.id || index}
                      onClick={() => {
                        setSelectedColorIndex(index);
                        const img = color.image.startsWith('http') || color.image.startsWith('/') ? color.image : `/${color.image}`;
                        const idx = allImages.indexOf(img);
                        setSelectedImage(idx >= 0 ? idx : 0);
                      }}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColorIndex === index 
                          ? "border-gold scale-110 shadow-lg shadow-gold/20" 
                          : "border-border hover:scale-110 hover:border-gold/50"
                      }`}
                      style={{ backgroundColor: color.colorCode }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-4">


              {/* Option 1: WhatsApp Order with Delivery Info (Form modal popup) — WhatsApp green */}
              <button
                onClick={() => {
                  setCheckoutMethod("whatsapp");
                  setIsOrderModalOpen(true);
                }}
                className="w-full h-[54px] sm:h-[58px] flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold uppercase tracking-widest rounded-full transition-all duration-300 text-xs sm:text-sm shadow-lg shadow-[#25D366]/20 hover:shadow-xl hover:shadow-[#25D366]/30 transform hover:-translate-y-0.5"
              >
                <WhatsAppIcon className="w-5 h-5 text-white fill-current shrink-0" />
                {t("orderWithDetails")}
              </button>

              {/* Option 2: Pay Online (Card / Zain Cash) — White button with Visa & Mastercard logos */}
              {product.inStock && (
                <button
                  onClick={() => {
                    setCheckoutMethod("online");
                    setIsOrderModalOpen(true);
                  }}
                  disabled={submitting}
                  className="w-full h-[54px] sm:h-[58px] flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-black font-bold uppercase tracking-widest rounded-full transition-all duration-300 text-xs sm:text-sm shadow-md border border-gray-300 dark:border-gray-200 transform hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {submitting ? (
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <VisaIcon className="w-7 h-5 rounded shadow-sm" />
                      <MastercardIcon className="w-7 h-5 rounded shadow-sm" />
                    </div>
                  )}
                  <span>{submitting ? "Processing..." : t("payOnlineCard")}</span>
                </button>
              )}

              {/* Option 3: Standard E-Commerce (Add to Cart & Wishlist) — Solid Black */}
              <div className="flex items-center gap-3">
                {product.inStock ? (
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 h-[54px] sm:h-[58px] flex items-center justify-center gap-3 bg-black hover:bg-[#1a1a1a] text-white font-bold uppercase tracking-widest rounded-full transition-all duration-300 text-xs sm:text-sm shadow-lg shadow-black/10 transform hover:-translate-y-0.5"
                  >
                    <ShoppingCart size={20} className="text-white" />
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
            language === "kmr" ? ((product as any).longDescriptionKm || product.longDescriptionKu || product.longDescription) :
            language === "ku" ? (product.longDescriptionKu || product.longDescription) :
            product.longDescription;

          if (!displayLongDescription) return null;

          return (
            <div className="mt-16 lg:mt-24 border-t border-border/50 pt-12 lg:pt-16 max-w-4xl mx-auto">
              <h2 className={`font-serif text-2xl sm:text-3xl font-bold text-text-primary mb-8 ${language === "ar" || language === "ku" || language === "kmr" ? "text-right" : "text-left"}`}>
                {language === "ar" ? "تفاصيل إضافية" : language === "ku" || language === "kmr" ? "وردەکاری زیاتر" : "More About This Product"}
              </h2>
              <div 
                className={`text-text-secondary leading-relaxed sm:text-lg space-y-6 ${language === "ar" || language === "ku" || language === "kmr" ? "text-right" : "text-left"}`}
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
              {t("youMayAlsoLike")}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* WhatsApp or Online Order Modal */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => !submitting && setIsOrderModalOpen(false)}
          />

          {/* Modal Box */}
          <div className="relative w-full max-w-md bg-bg-card rounded-2xl border border-border shadow-2xl overflow-hidden z-10 p-6 sm:p-8 transform transition-all duration-300 scale-100 opacity-100">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-text-primary mb-2 text-start">
              {checkoutMethod === "online" ? "Pay Online (Wayl)" : t("orderWithDetails")}
            </h2>
            <p className="text-xs sm:text-sm text-text-muted mb-6 leading-relaxed text-start">
              {checkoutMethod === "online"
                ? (language === "ku"
                    ? "تکایە ناونیشان و ژمارەی مۆبایلی خۆت بنووسە پێش ئەوەی پارەکە بدەیت."
                    : language === "ar"
                    ? "يرجى كتابة عنوانك ورقم هاتفك قبل الدفع."
                    : "Please enter your address and phone number before paying.")
                : t("orderModalDesc")}
            </p>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl mb-4 text-start">
                {error}
              </div>
            )}

            <form onSubmit={checkoutMethod === "online" ? (e) => { e.preventDefault(); triggerDirectOnlineCheckout(); } : handleOrderSubmit} className="space-y-4">
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
                  placeholder={language === "ku" ? "شار / شارۆچکە" : language === "ar" ? "المدينة" : "e.g. Slemani, Baghdad"}
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
                  disabled={submitting}
                  onClick={() => setIsOrderModalOpen(false)}
                  className="flex-1 py-3 border border-border hover:bg-bg-primary text-text-secondary font-bold uppercase tracking-wider text-xs rounded-xl transition-all disabled:opacity-50"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`flex-1 py-3 text-white font-bold uppercase tracking-wider text-xs rounded-xl transition-all flex items-center justify-center gap-2 ${
                    checkoutMethod === "online"
                      ? "bg-[#d49f37] hover:bg-[#B8965E] shadow-lg shadow-[#d49f37]/15"
                      : "bg-[#16a34a] hover:bg-[#15803d] shadow-lg shadow-[#16a34a]/15"
                  }`}
                >
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : checkoutMethod === "online" ? (
                    <CreditCard size={16} />
                  ) : (
                    <MessageCircle size={16} />
                  )}
                  {submitting ? "Processing..." : checkoutMethod === "online" ? "Pay Now" : t("confirmOrder")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
