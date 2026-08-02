"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface Slide {
  id: string | number;
  image: string;
  mobileImage?: string;
  alt?: string;
  textEn?: string;
  textAr?: string;
  textKu?: string;
  textKm?: string;
  buttonLink?: string;
}

const defaultSlides: Slide[] = [
  {
    id: "1",
    image: "/hero-luxury-v3.webp",
    mobileImage: "/mobile-hero-1.png",
    alt: "Luxury Coffee Gear",
    textEn: "Curating specialty coffee tools and brewing methods based on expertise, science, and global standards.",
    textAr: "اختيار معدات وطرق تحضير القهوة بناءً على الخبرة والعلم والمعايير العالمية.",
    textKu: "هەڵبژاردنی کەرەستەی دروستکردنی قاوە و شێوازەکانی ئامادەکردنی قاوە لەسەر بنەمای ئەزموون، زانست، ستانداردە جیهانییەکان.",
    buttonLink: "/products",
  },
  {
    id: "2",
    image: "/hero-coffee-dark-new.png",
    mobileImage: "/mobile-hero-2.png",
    alt: "Precision Coffee Grinders",
    textEn: "Precision grinders engineered for flawless extraction and maximum flavor clarity.",
    textAr: "أدوات طحن القهوة المتقدمة للحصول على النكهة المثالية والاستخلاص الدقيق.",
    textKu: "ئامرازی پێشکەوتووی هاڕینی قاوە بۆ بەدەستهێنانی تامی تەواو و دروستکردنی هاوسەنگ.",
    buttonLink: "/products",
  },
  {
    id: "3",
    image: "/luxury_pour_over_setup_1783452104125.png",
    mobileImage: "/mobile-hero-3.png",
    alt: "World-Class Coffee Brands",
    textEn: "Authentic gear hand-picked from the world's finest specialty coffee brands.",
    textAr: "معدات أصيلة من أفضل العلامات التجارية العالمية للارتقاء بقهوتك اليومية.",
    textKu: "ئامرازە ڕەسەنەکانی باشترین براندەکانی جیهان بۆ بەرزکردنەوەی کوالیتی قاوەکەت.",
    buttonLink: "/products",
  },
];

export function Hero() {
  const [slides, setSlides] = useState<Slide[]>(defaultSlides);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { t, language } = useLanguage();
  const isRTL = language === "ar" || language === "ku" || language === "kmr";

  useEffect(() => {
    fetch("/api/hero-slides", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const active = data.filter((s: any) => s.isActive !== false);
          if (active.length > 0) {
            setSlides(active);
          }
        }
      })
      .catch(console.error);
  }, []);

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 40;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      isRTL ? prevSlide() : nextSlide();
    } else if (isRightSwipe) {
      isRTL ? nextSlide() : prevSlide();
    }
  };

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Auto-play timer (5.5 seconds)
  useEffect(() => {
    if (isHovered || slides.length <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5500);
    return () => clearInterval(timer);
  }, [nextSlide, isHovered, slides.length]);

  const getSlideText = (slide: Slide) => {
    if (language === "ar") return slide.textAr || slide.textEn || "";
    if (language === "kmr") return slide.textKm || slide.textKu || slide.textEn || "";
    if (language === "ku") return slide.textKu || slide.textEn || "";
    return slide.textEn || slide.textKu || slide.textAr || "";
  };

  return (
    <section 
      className="relative w-full h-screen h-[100dvh] overflow-hidden bg-black text-white group/hero"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* === BACKGROUND SLIDE IMAGES === */}
      {slides.map((slide, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              isActive
                ? "opacity-100 scale-100 z-10"
                : "opacity-0 scale-105 pointer-events-none z-0"
            }`}
          >
            {/* Desktop Image */}
            <Image
              src={slide.image}
              alt={slide.alt || getSlideText(slide) || "Diar Selection Hero Slide"}
              fill
              className={`object-cover object-center ${slide.mobileImage ? "hidden sm:block" : ""}`}
              priority={index === 0}
            />

            {/* Separate Mobile Image (If specified for mobile screen ratio) */}
            {slide.mobileImage && (
              <Image
                src={slide.mobileImage}
                alt={slide.alt || getSlideText(slide) || "Diar Selection Hero Slide Mobile"}
                fill
                className="object-cover object-center block sm:hidden"
                priority={index === 0}
              />
            )}

            {/* Dark Vignette & Gradient Overlay for Contrast */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/35 ${
              isRTL ? "lg:bg-gradient-to-l lg:from-black/90 lg:via-black/50 lg:to-transparent" : "lg:bg-gradient-to-r lg:from-black/90 lg:via-black/50 lg:to-transparent"
            }`} />
          </div>
        );
      })}

      {/* === OVERLAY CONTENT CONTAINER === */}
      <div className="relative z-20 h-full max-w-7xl mx-auto px-5 sm:px-16 lg:px-24 flex flex-col justify-end pb-16 sm:pb-24 lg:pb-0 lg:justify-center pt-24 sm:pt-28">
        <div className="max-w-xl sm:max-w-2xl lg:max-w-3xl text-start">
          
          {/* Accent Gold Line */}
          <div className="w-10 sm:w-12 h-[2px] bg-[#d49f37] mb-4 sm:mb-5 rounded-full shadow-lg shadow-[#d49f37]/40" />

          {/* Active Slide Text */}
          <div className="min-h-[100px] sm:min-h-[130px] flex flex-col justify-center mb-6 sm:mb-8">
            {slides.map((slide, index) => {
              const isActive = index === currentSlide;
              return (
                <div
                  key={slide.id}
                  className={`transition-all duration-700 ease-in-out ${
                    isActive
                      ? "opacity-100 translate-y-0 relative z-10"
                      : "opacity-0 translate-y-6 absolute pointer-events-none"
                  }`}
                >
                  <p className={`font-sans text-white/95 leading-[1.65] max-w-[580px] lg:max-w-[680px] drop-shadow-lg ${
                    isRTL ? "text-[16px] sm:text-[22px] lg:text-[26px] font-medium" : "text-[15px] sm:text-[19px] lg:text-[22px] font-normal"
                  }`}>
                    {getSlideText(slide)}
                  </p>
                </div>
              );
            })}
          </div>

          {/* CTA Button Row */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/products"
              className="group flex items-center justify-center gap-3.5 px-6 sm:px-7 py-3 sm:py-3.5 bg-gold text-bg-primary rounded-full font-bold transition-all duration-300 hover:bg-white hover:text-black shadow-xl active:scale-95"
            >
              <span className={`font-sans tracking-wide ${isRTL ? "text-[14px] sm:text-[16px]" : "text-[13px] sm:text-[15px]"}`}>
                {t("exploreCollection")}
              </span>
              <ArrowRight size={18} className={`transition-transform duration-200 group-hover:translate-x-1 ${isRTL ? "rotate-180 group-hover:-translate-x-1" : ""}`} />
            </Link>
          </div>

        </div>
      </div>

      {/* Sleek Minimalist Slide Indicators (Positioned bottom right on mobile) */}
      <div className="absolute bottom-5 right-5 sm:bottom-8 sm:right-8 lg:right-24 z-30 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/10 shadow-lg">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
              currentSlide === index
                ? "w-6 bg-[#d49f37]"
                : "w-1.5 bg-white/30 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* === FLOATING SIDE NAVIGATION ARROWS (Visible on mobile & desktop) === */}
      <button
        onClick={isRTL ? nextSlide : prevSlide}
        className={`flex absolute top-1/2 -translate-y-1/2 ${isRTL ? "right-3 sm:right-6 lg:right-8" : "left-3 sm:left-6 lg:left-8"} z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/35 backdrop-blur-md border border-white/15 text-white/90 hover:bg-gold hover:text-bg-primary hover:border-gold transition-all duration-300 items-center justify-center cursor-pointer shadow-xl active:scale-95`}
        aria-label="Previous Slide"
      >
        <ChevronLeft size={20} className="sm:w-[22px] sm:h-[22px]" />
      </button>

      <button
        onClick={isRTL ? prevSlide : nextSlide}
        className={`flex absolute top-1/2 -translate-y-1/2 ${isRTL ? "left-3 sm:left-6 lg:left-8" : "right-3 sm:right-6 lg:right-8"} z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/35 backdrop-blur-md border border-white/15 text-white/90 hover:bg-gold hover:text-bg-primary hover:border-gold transition-all duration-300 items-center justify-center cursor-pointer shadow-xl active:scale-95`}
        aria-label="Next Slide"
      >
        <ChevronRight size={20} className="sm:w-[22px] sm:h-[22px]" />
      </button>

    </section>
  );
}

