"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Award, Truck, Lock } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function Hero() {
  const { t, language } = useLanguage();
  const isRTL = language === "ar" || language === "ku";

  return (
    <div className="w-full bg-[#F5F5F5] pt-16 lg:pt-24 pb-0 px-0">
      
      {/* 
        CLEAN SEAMLESS HERO SECTION
        Spans 100% width edge-to-edge.
      */}
      <section className="relative w-full max-w-none flex flex-col lg:flex-row items-stretch min-h-[70vh] pb-4 lg:pb-8">
        
        {/* === LEFT COLUMN: TEXT CONTENT === */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-start text-start ps-6 pe-6 sm:ps-10 sm:pe-10 lg:ps-16 xl:ps-20 lg:pe-12 pt-6 pb-6 lg:py-12 z-20">
          
          {/* Badge (Hidden on mobile as requested) */}
          <div className="hidden lg:inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#B8AD9A] mb-4 lg:mb-5 bg-transparent animate-fade-up-luxury">
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#B08D57]">
              <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="text-[9px] lg:text-[11px] font-bold uppercase tracking-[0.15em] text-[#7A6E5E]">
              {t("premiumCoffeeEquipment")}
            </span>
          </div>

          {/* Headline */}
          <h1 className={`font-serif text-[42px] sm:text-[56px] lg:text-[68px] xl:text-[80px] text-[#251B12] font-semibold tracking-tight mb-3 lg:mb-4 animate-fade-up-luxury stagger-1 ${isRTL ? "font-arabic leading-[1.3] lg:leading-[1.2]" : "leading-[1.05] lg:leading-[0.95]"}`}>
            {t("heroTitlePart1")}
            {t("heroTitlePart2") && <><br />{t("heroTitlePart2")}</>}
            {t("heroTitlePart3") && <><br /><em className={`font-serif italic text-[#B08D57] ${isRTL ? "block mt-2" : ""}`}>{t("heroTitlePart3")}</em></>}
            {t("heroTitlePart4") && <><br />{t("heroTitlePart4")}</>}
          </h1>

          {/* Subtitle */}
          <p className={`font-sans text-[#4A3D2E] leading-relaxed mb-5 lg:mb-7 max-w-[420px] animate-fade-up-luxury stagger-2 ${isRTL ? "text-[15px] sm:text-[17px] lg:text-[19px] font-medium" : "text-[15px] sm:text-[16px] lg:text-[17px]"}`}>
            {t("heroSubtitle")}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-start gap-4 lg:gap-6 w-full animate-fade-up-luxury stagger-3">
            {/* Primary Button */}
            <Link
              href="/products"
              className="group flex items-center justify-center gap-4 px-6 lg:px-8 h-[48px] lg:h-[56px] w-auto bg-[#251B12] text-white rounded-full transition-all duration-200 ease-out hover:bg-[#382c20] shadow-xl shadow-[#251B12]/10"
            >
              <span className={`font-sans tracking-wide ${isRTL ? "text-[15px] sm:text-[16px] font-semibold" : "text-[14px] sm:text-[15px] font-medium"}`}>{t("exploreCollection")}</span>
              <ArrowRight size={16} className={`transition-transform duration-200 ease-out group-hover:translate-x-1 ${isRTL ? "rotate-180" : ""}`} />
            </Link>

            {/* Secondary Text Link (Visible on both mobile & desktop under the button as in the mockup) */}
            <Link
              href="/#brewing-guide"
              className={`flex items-center text-[#4A3D2E] hover:text-[#B08D57] font-sans transition-colors duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[1px] after:bg-[#B8AD9A] hover:after:bg-[#B08D57] after:transition-colors after:duration-200 ${isRTL ? "text-[15px] font-bold" : "text-[14px] font-medium"}`}
            >
              {t("brewing_guide")}
            </Link>
          </div>
        </div>

        {/* === RIGHT COLUMN: EDITORIAL PRODUCT IMAGE === */}
        {/* Full-bleed on mobile (no padding, no rounded corners), padded & rounded on desktop */}
        <div className="w-full lg:w-1/2 p-0 lg:p-8 flex items-stretch z-10 animate-fade-up-luxury stagger-2">
          <div className="relative w-full h-[35vh] sm:h-[40vh] lg:h-auto min-h-[350px] rounded-none lg:rounded-[24px] overflow-hidden shadow-none lg:shadow-sm">
            <Image
              src="/hero-luxury-v3.webp"
              alt="Luxury Coffee Ritual: Matte Black Kettle, Ceramic Dripper, Glass Server, Coffee Beans"
              fill
              className="object-cover object-center scale-100"
              priority
            />
          </div>
        </div>

      </section>

      {/* 
        === FEATURE BAR === 
        Sits below the hero section on a solid light background
      */}
      <div className="w-full bg-[#F5F5F5] border-t border-[#B8AD9A]/30 relative z-30">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 lg:px-16 xl:px-24 py-6 lg:py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 divide-transparent lg:divide-x lg:divide-[#B8AD9A]/30">
            
            {/* Feature 1 */}
            <div className="flex flex-col lg:flex-row items-center lg:items-start text-center lg:text-left gap-3 lg:gap-4 lg:pr-8 animate-fade-up-luxury stagger-4">
              <div className="shrink-0">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#B08D57" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="7" />
                  <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
                </svg>
              </div>
              <div>
                <h3 className="text-[#251B12] font-semibold text-[13px] lg:text-[14px] mb-1">Premium Quality</h3>
                <p className="text-[#7A6E5E] text-[11px] lg:text-[12px] leading-snug max-w-[140px] lg:max-w-none">Carefully selected high-end equipment</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col lg:flex-row items-center lg:items-start text-center lg:text-left gap-3 lg:gap-4 lg:px-8 animate-fade-up-luxury stagger-4">
              <div className="shrink-0">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#B08D57" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
                  <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
                  <line x1="6" y1="2" x2="6" y2="4" />
                  <line x1="10" y1="2" x2="10" y2="4" />
                  <line x1="14" y1="2" x2="14" y2="4" />
                </svg>
              </div>
              <div>
                <h3 className="text-[#251B12] font-semibold text-[13px] lg:text-[14px] mb-1">Better Coffee</h3>
                <p className="text-[#7A6E5E] text-[11px] lg:text-[12px] leading-snug max-w-[140px] lg:max-w-none">Tools that elevate every brew</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col lg:flex-row items-center lg:items-start text-center lg:text-left gap-3 lg:gap-4 lg:px-8 animate-fade-up-luxury stagger-4">
              <div className="shrink-0">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#B08D57" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="15" height="13" rx="2" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              </div>
              <div>
                <h3 className="text-[#251B12] font-semibold text-[13px] lg:text-[14px] mb-1">Fast Delivery</h3>
                <p className="text-[#7A6E5E] text-[11px] lg:text-[12px] leading-snug max-w-[140px] lg:max-w-none">Quick & secure shipping across Iraq</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col lg:flex-row items-center lg:items-start text-center lg:text-left gap-3 lg:gap-4 lg:pl-8 animate-fade-up-luxury stagger-4">
              <div className="shrink-0">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#B08D57" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <circle cx="12" cy="11" r="1.5" />
                  <path d="M12 12.5V15" />
                </svg>
              </div>
              <div>
                <h3 className="text-[#251B12] font-semibold text-[13px] lg:text-[14px] mb-1">Secure Payment</h3>
                <p className="text-[#7A6E5E] text-[11px] lg:text-[12px] leading-snug max-w-[140px] lg:max-w-none">100% safe & trusted checkout</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
