"use client";

import { X, Minus, Plus, ShoppingCart, ArrowRight, MessageCircle, CreditCard } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { getWhatsAppCartUrl, getWhatsAppCartWithDetailsUrl } from "@/lib/whatsapp";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { formatPrice } from "@/lib/price";

export function CartDrawer() {
  const { isCartOpen, closeCart, cart, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const { language, t } = useLanguage();
  const isRTL = language === "ar" || language === "ku";

  const [paymentMethod, setPaymentMethod] = useState<"whatsapp" | "online">("whatsapp");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [modalError, setModalError] = useState("");

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");

  // Prevent background scrolling when drawer or modal is open
  useEffect(() => {
    if (isCartOpen || isOrderModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen, isOrderModalOpen]);

  const handleCheckoutClick = () => {
    setModalError("");
    setIsOrderModalOpen(true);
  };

  const handleWhatsAppOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !city || !address) {
      setModalError(t("fillAllFields"));
      return;
    }
    const url = getWhatsAppCartWithDetailsUrl(
      cart,
      cartTotal,
      { fullName, phone, city, address },
      language
    );
    window.open(url, "_blank", "noopener,noreferrer");
    clearCart();
    setIsOrderModalOpen(false);
    closeCart();
  };

  const triggerOnlineCheckout = async () => {
    setModalError("");

    if (!fullName || !phone || !city || !address) {
      setModalError(t("fillAllFields"));
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/checkout/wayl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          customerDetails: {
            fullName: fullName,
            phone: phone,
            city: city,
            address: address
          }
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create payment link");
      }

      if (data.url) {
        clearCart();
        setIsOrderModalOpen(false);
        closeCart();
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err: any) {
      console.error(err);
      setModalError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
            className="p-2 text-text-muted hover:text-text-primary transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-bg-card border border-border flex items-center justify-center text-text-muted">
                <ShoppingCart size={28} />
              </div>
              <p className="text-text-secondary text-sm">Your cart is empty.</p>
              <button
                onClick={closeCart}
                className="text-xs uppercase tracking-widest font-bold text-gold hover:underline"
              >
                Go Shop Products
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const displayTitle = 
                language === "ar" ? (item.nameAr || item.name) :
                language === "kmr" ? ((item as any).nameKm || item.nameKu || item.name) :
                language === "ku" ? (item.nameKu || item.name) :
                item.name;

              return (
                <div key={item.id} className="flex gap-4 group">
                  <Link href={`/products/${item.slug}`} onClick={closeCart} className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-bg-card border border-border group-hover:border-gold/50 transition-colors">
                    <Image
                      src={item.image ? (item.image.startsWith('http') || item.image.startsWith('/') ? item.image : `/${item.image}`) : "/placeholder.jpg"}
                      alt={displayTitle || item.name || "Product image"}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </Link>

                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <Link href={`/products/${item.slug}`} onClick={closeCart} className="text-text-primary font-medium text-sm leading-snug line-clamp-2 hover:text-gold transition-colors">
                        {displayTitle}
                      </Link>
                      <p className="text-xs text-text-muted mt-1 uppercase tracking-wider">
                        {item.brand}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-border rounded-lg bg-bg-card">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 px-2.5 text-text-muted hover:text-text-primary transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-bold text-text-primary px-1 w-6 text-center font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 px-2.5 text-text-muted hover:text-text-primary transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-xs text-red-500/80 hover:text-red-500 font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Checkout Summary */}
        {cart.length > 0 && (
          <div className="border-t border-border p-6 bg-bg-card">
            {/* Payment Method Selector */}
            <div className="mb-6">
              <label className="block text-xs uppercase tracking-wider font-bold text-text-secondary mb-3">
                Select Checkout Option
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPaymentMethod("whatsapp")}
                  className={`py-3 px-4 rounded-xl border font-bold uppercase tracking-wider text-xs transition-all flex flex-col items-center justify-center gap-1.5 ${
                    paymentMethod === "whatsapp"
                      ? "border-[#128C7E] bg-[#128C7E]/10 text-white"
                      : "border-border bg-bg-primary text-text-muted hover:border-border-light hover:text-text-secondary"
                  }`}
                >
                  WhatsApp Checkout
                </button>
                <button
                  onClick={() => setPaymentMethod("online")}
                  className={`py-3 px-4 rounded-xl border font-bold uppercase tracking-wider text-xs transition-all flex flex-col items-center justify-center gap-1.5 ${
                    paymentMethod === "online"
                      ? "border-[#d49f37] bg-[#d49f37]/10 text-white"
                      : "border-border bg-bg-primary text-text-muted hover:border-border-light hover:text-text-secondary"
                  }`}
                >
                  Pay Online (Wayl)
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-text-muted font-medium">Subtotal</span>
              <span className="text-2xl font-bold text-text-primary">
                {formatPrice(cartTotal, language)}
              </span>
            </div>
            
            {paymentMethod === "whatsapp" ? (
              <p className="text-xs text-text-muted mb-6">
                {language === "ku" ? "بارستە و باج لە کاتی چەکاوت لە ڕێگەی واتساپ دیاری دەکرێت." : language === "ar" ? "يتم احتساب الشحن والضرائب عند الدفع عبر واتساب." : "Shipping and taxes calculated at checkout via WhatsApp."}
              </p>
            ) : (
              <div className="flex flex-col gap-3 mb-6">
                <input 
                  type="text" 
                  placeholder={language === "ku" ? "ناوی تەواو" : language === "ar" ? "الاسم الكامل" : "Full Name"}
                  value={fullName} onChange={(e) => setFullName(e.target.value)}
                  className="bg-bg-primary border border-border rounded-lg px-4 py-3 text-sm text-text-primary focus:border-gold outline-none w-full"
                />
                <input 
                  type="text" 
                  placeholder={language === "ku" ? "ژمارەی مۆبایل" : language === "ar" ? "رقم الهاتف" : "Phone Number"}
                  value={phone} onChange={(e) => setPhone(e.target.value)}
                  className="bg-bg-primary border border-border rounded-lg px-4 py-3 text-sm text-text-primary focus:border-gold outline-none w-full"
                />
                <div className="flex gap-3">
                  <input 
                    type="text" 
                    placeholder={language === "ku" ? "شار" : language === "ar" ? "المدينة" : "City"}
                    value={city} onChange={(e) => setCity(e.target.value)}
                    className="bg-bg-primary border border-border rounded-lg px-4 py-3 text-sm text-text-primary focus:border-gold outline-none w-1/2"
                  />
                  <input 
                    type="text" 
                    placeholder={language === "ku" ? "ناونیشان" : language === "ar" ? "العنوان" : "Address"}
                    value={address} onChange={(e) => setAddress(e.target.value)}
                    className="bg-bg-primary border border-border rounded-lg px-4 py-3 text-sm text-text-primary focus:border-gold outline-none w-1/2"
                  />
                </div>
              </div>
            )}

            {paymentMethod === "whatsapp" ? (
              <button
                onClick={handleCheckoutClick}
                className="w-full flex items-center justify-center gap-3 py-4 bg-[#128C7E] hover:bg-[#075E54] text-white rounded-xl font-bold uppercase tracking-widest text-sm transition-all duration-300 shadow-xl shadow-[#128C7E]/20"
              >
                <MessageCircle size={20} className="text-white" />
                {t("orderWithDetails")}
              </button>
            ) : (
              <button
                onClick={handleCheckoutClick}
                disabled={submitting}
                className="w-full flex items-center justify-center gap-3 py-4 bg-[#d49f37] hover:bg-[#B8965E] text-white rounded-xl font-bold uppercase tracking-widest text-sm transition-all duration-300 shadow-xl shadow-[#d49f37]/20 disabled:opacity-50"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <CreditCard size={20} className="text-white" />
                )}
                {submitting ? "Processing..." : "Pay Online (Wayl)"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Delivery Info Modal Popup for Cart (1 or more items) */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => !submitting && setIsOrderModalOpen(false)}
          />

          {/* Modal Box */}
          <div className="relative w-full max-w-md bg-bg-card rounded-2xl border border-border shadow-2xl overflow-hidden z-10 p-6 sm:p-8 transform transition-all duration-300 scale-100 opacity-100">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-text-primary mb-2 text-start">
              {paymentMethod === "online" ? "Pay Online (Wayl)" : t("orderWithDetails")}
            </h2>
            <p className="text-xs sm:text-sm text-text-muted mb-6 leading-relaxed text-start">
              {paymentMethod === "online"
                ? (language === "ku"
                    ? "تکایە ناونیشان و ژمارەی مۆبایلی خۆت بنووسە پێش ئەوەی پارەکە بدەیت."
                    : language === "ar"
                    ? "يرجى كتابة عنوانك ورقم هاتفك قبل الدفع."
                    : "Please enter your address and phone number before paying.")
                : t("orderModalDesc")}
            </p>

            {modalError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl mb-4 text-start">
                {modalError}
              </div>
            )}

            <form onSubmit={paymentMethod === "online" ? (e) => { e.preventDefault(); triggerOnlineCheckout(); } : handleWhatsAppOrderSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-text-secondary mb-1.5 text-start">
                  {t("fullName")}
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
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
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
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
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
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
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={language === "ku" ? "گەڕەک، شەقام، ژمارەی خانوو..." : language === "ar" ? "الحي، الشارع، تفاصيل المنزل..." : "Neighborhood, Street, House details..."}
                  className="w-full p-4 rounded-xl border border-border bg-bg-primary text-text-primary outline-none focus:border-gold transition-colors text-sm text-start resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`flex-1 h-12 ${paymentMethod === "online" ? "bg-[#d49f37] hover:bg-[#B8965E]" : "bg-[#128C7E] hover:bg-[#075E54]"} text-white rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50`}
                >
                  {submitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : paymentMethod === "online" ? (
                    <CreditCard size={18} />
                  ) : (
                    <MessageCircle size={18} />
                  )}
                  <span>{submitting ? "Processing..." : paymentMethod === "online" ? "Pay Online (Wayl)" : t("confirmOrder")}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsOrderModalOpen(false)}
                  className="px-6 h-12 bg-transparent border border-border hover:border-text-muted text-text-primary rounded-xl font-medium text-sm transition-colors"
                >
                  {t("cancel")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
