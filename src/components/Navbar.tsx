"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Menu,
  X,
  Globe,
  Heart,
  ShoppingCart,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { SearchModal } from "./SearchModal";
import { Logo } from "./Logo";
import { useLanguage } from "@/context/LanguageContext";
import { useWishlist } from "@/context/WishlistContext";
import { useTheme } from "@/context/ThemeContext";
import { useCart } from "@/context/CartContext";
import { CartDrawer } from "./CartDrawer";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const { wishlistCount } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  const { cartCount, openCart } = useCart();

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/products", label: t("products") },
    { href: "/#brewing-guide", label: t("brewing_guide") },
    { href: "/#about", label: t("about") },
    { href: "/#contact", label: t("contact") },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileOpen]);

  const isDark = theme === "dark";

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? isDark
              ? "bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10"
              : "bg-[#18130F]/95 backdrop-blur-md border-b border-[#B8AD9A]/20"
            : isDark
            ? "bg-[#0a0a0a]"
            : "bg-[#18130F]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <Logo className={`w-auto h-12 sm:h-14 transition-transform group-hover:scale-105 ${isDark ? "brightness-0 invert" : "brightness-0 invert"}`} />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => {
                const isHashLink = link.href.startsWith("/#");
                const isActive = pathname === link.href || (pathname === "/" && link.href === "/"); // Note: hash links are harder to track via pathname
                const baseClass = "relative py-2 text-sm tracking-widest uppercase transition-colors duration-300 group-hover:text-gold";
                const activeClass = isActive 
                  ? "text-gold" 
                  : isDark ? "text-white/85 hover:text-white" : "text-[#EBE5DB]/85 hover:text-white";
                
                // Animated underline effect
                const underlineClass = "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-gold after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left";
                
                const combinedClass = `${baseClass} ${activeClass} ${underlineClass} ${isActive ? "after:scale-x-100" : ""}`;
                
                return isHashLink ? (
                  <a key={link.href} href={link.href} className={combinedClass}>
                    {link.label}
                  </a>
                ) : (
                  <Link key={link.href} href={link.href} className={combinedClass}>
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Language Switcher */}
              <div className="relative">
                <button
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className={`p-2 transition-colors flex items-center gap-1 ${isDark ? "text-white/80 hover:text-gold" : "text-[#EBE5DB]/80 hover:text-gold"}`}
                  aria-label="Change Language"
                >
                  <Globe size={20} />
                  <span className="text-[10px] uppercase tracking-widest hidden sm:inline-block">
                    {language.toUpperCase()}
                  </span>
                </button>
                
                {isLangMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-32 bg-bg-secondary border border-gold/10 rounded-lg shadow-xl overflow-hidden py-1 z-50">
                    <button
                      onClick={() => { setLanguage("en"); setIsLangMenuOpen(false); }}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gold/5 ${language === "en" ? "text-gold" : "text-text-primary"}`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => { setLanguage("ar"); setIsLangMenuOpen(false); }}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gold/5 ${language === "ar" ? "text-gold" : "text-text-primary"}`}
                    >
                      العربية
                    </button>
                    <button
                      onClick={() => { setLanguage("ku"); setIsLangMenuOpen(false); }}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gold/5 ${language === "ku" ? "text-gold" : "text-text-primary"}`}
                    >
                      کوردی
                    </button>
                  </div>
                )}
              </div>



              <button
                onClick={() => setSearchOpen(true)}
                className={`p-2 transition-colors hidden sm:block ${isDark ? "text-white/80 hover:text-gold" : "text-[#EBE5DB]/80 hover:text-gold"}`}
                aria-label="Search products"
              >
                <Search size={20} />
              </button>

              <Link
                href="/wishlist"
                className={`p-2 transition-colors relative ${isDark ? "text-white/80 hover:text-gold" : "text-[#EBE5DB]/80 hover:text-gold"}`}
                aria-label="Wishlist"
              >
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-bg-primary">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Button */}
              <button
                onClick={openCart}
                className={`p-2 transition-colors relative ${isDark ? "text-white/80 hover:text-gold" : "text-[#EBE5DB]/80 hover:text-gold"}`}
                aria-label="Cart"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-bg-primary">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`lg:hidden p-2 transition-colors ${isDark ? "text-white/80 hover:text-gold" : "text-[#EBE5DB]/80 hover:text-gold"}`}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden fixed inset-0 top-16 backdrop-blur-lg transition-all duration-300 ${
            mobileOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          } ${isDark ? "bg-[#0a0a0a]/98" : "bg-[#18130F]/98"}`}
        >
          <div className="flex flex-col items-center justify-center gap-8 pt-20">
            {navLinks.map((link) => {
              const isHashLink = link.href.startsWith("/#");
              const className = `transition-colors text-xl tracking-wide font-light ${isDark ? "text-white/90 hover:text-gold" : "text-[#EBE5DB]/90 hover:text-gold"}`;
              
              return isHashLink ? (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={className}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={className}
                >
                  {link.label}
                </Link>
              );
            })}
            
            {/* Theme and Wishlist inside mobile menu */}
            <div className="flex items-center gap-6 mt-4">
              
              <button
                onClick={() => {
                  setMobileOpen(false);
                  setSearchOpen(true);
                }}
                className={`flex items-center gap-2 text-lg ${isDark ? "text-white/80" : "text-[#EBE5DB]/80"}`}
              >
                <Search size={24} />
                <span>Search</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer />
    </>
  );
}
