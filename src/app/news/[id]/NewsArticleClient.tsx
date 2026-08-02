"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowLeft, Calendar, Tag, ChevronLeft, ChevronRight, Camera } from "lucide-react";
import { useState, useEffect } from "react";

export function NewsArticleClient({ article }: { article: any }) {
  const { language, dir } = useLanguage();
  const isRTL = dir === "rtl";
  const [mounted, setMounted] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const t = (en: string, ar: string, ku: string) => {
    if (language === "ar") return ar;
    if (language === "ku") return ku;
    return en;
  };

  // Gather all article images (cover + extra images)
  const extraList = Array.isArray(article.images)
    ? article.images
    : typeof article.images === "string"
    ? (() => {
        try {
          const parsed = JSON.parse(article.images);
          return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
          return [];
        }
      })()
    : [];

  const allImages: string[] = [article.image, ...extraList].filter(Boolean);

  const getField = (field: "tag" | "title" | "excerpt") => {
    let val = "";
    if (language === "ar") {
      val = article[`${field}Ar`]?.trim() || "";
    } else if (language === "kmr") {
      val = (article as any)[`${field}Km`]?.trim() || article[`${field}Ku`]?.trim() || "";
    } else if (language === "ku") {
      val = article[`${field}Ku`]?.trim() || "";
    }
    
    if (!val) {
      val = article[field]?.trim() || "";
    }

    return val;
  };

  const backText = t("Back to News", "العودة إلى الأخبار", "گەڕانەوە بۆ هەواڵەکان");

  // Format date safely
  const formattedDate = mounted
    ? new Date(article.createdAt).toLocaleDateString(
        language === "ar" ? "ar-IQ" : language === "ku" ? "ckb-IQ" : "en-US",
        { year: 'numeric', month: 'long', day: 'numeric' }
      )
    : "";

  const textBody = getField("excerpt");

  return (
    <div className="w-full bg-[#F8F7F5] dark:bg-bg-primary text-text-primary transition-colors duration-300 min-h-screen pt-28 lg:pt-36 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link 
          href="/news" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#4A3D2E] dark:text-gray-300 hover:text-gold transition-colors duration-200 mb-8 sm:mb-12"
        >
          <ArrowLeft size={16} className={isRTL ? "rotate-180" : ""} />
          {backText}
        </Link>
        
        {/* Article Header */}
        <div className="mb-10 text-center sm:text-start">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mb-6">
            {getField("tag") && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-gold uppercase tracking-widest bg-gold/10 px-3 py-1 rounded-full border border-gold/20">
                <Tag size={14} />
                {getField("tag")}
              </span>
            )}
            <span className="flex items-center gap-1.5 text-[#4A3D2E] dark:text-gray-400 text-sm font-medium">
              <Calendar size={14} />
              <span suppressHydrationWarning>{formattedDate}</span>
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1E1611] dark:text-white font-bold tracking-tight leading-tight">
            {getField("title") || "News & Analysis"}
          </h1>
        </div>

        {/* Article Image / Multi-Photo Gallery */}
        <div className="mb-12">
          <div className="relative w-full aspect-[16/9] rounded-[16px] sm:rounded-[24px] overflow-hidden shadow-md border border-border/10 group">
            <Image
              src={allImages[activeImageIndex] || article.image}
              alt={getField("title") || "Article Image"}
              fill
              className="object-cover transition-all duration-500"
              priority
            />

            {/* Multi-Photo Navigation Overlay */}
            {allImages.length > 1 && (
              <>
                {/* Photo Badge Count */}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/10 z-10">
                  <Camera size={14} className="text-gold" />
                  <span>{activeImageIndex + 1} / {allImages.length}</span>
                </div>

                {/* Left/Right Buttons */}
                <button
                  type="button"
                  onClick={() => setActiveImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-90 hover:scale-110 active:scale-95 border border-white/10 z-10"
                  aria-label="Previous photo"
                >
                  <ChevronLeft size={22} className={isRTL ? "rotate-180" : ""} />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-90 hover:scale-110 active:scale-95 border border-white/10 z-10"
                  aria-label="Next photo"
                >
                  <ChevronRight size={22} className={isRTL ? "rotate-180" : ""} />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Strip for Multi-Photo Articles */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-2 scrollbar-none justify-center">
              {allImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-300 ${
                    idx === activeImageIndex
                      ? "border-gold ring-2 ring-gold/40 scale-105 shadow-md"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={imgUrl} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Article Content */}
        <div className="max-w-3xl mx-auto">
          <div className="space-y-6">
            {textBody.split("\n").map((paragraph, idx) => {
              const trimmed = paragraph.trim();
              if (!trimmed) return null;
              
              const isSubtitle = trimmed.length < 70 && (trimmed.endsWith('?') || trimmed.endsWith(':') || trimmed === "What Is Espresso?");
              
              if (isSubtitle) {
                return (
                  <h3 key={idx} className="font-serif text-xl sm:text-2xl mt-8 mb-4 font-bold text-[#1E1611] dark:text-[#d49f37]">
                    {trimmed}
                  </h3>
                );
              }

              return (
                <p key={idx} className="font-sans text-[#251B12] dark:text-gray-200 text-base sm:text-lg leading-relaxed font-normal">
                  {trimmed}
                </p>
              );
            })}
          </div>

          {/* Article Multi-Photo Grid Section */}
          {allImages.length > 1 && (
            <div className="mt-16 pt-12 border-t border-border/10">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1E1611] dark:text-white mb-6 flex items-center gap-2">
                <Camera size={20} className="text-gold" />
                <span>{t("Article Gallery", "معرض صور المقال", "پێشانگای وێنەکانی وتارەکە")}</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {allImages.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setActiveImageIndex(idx);
                      window.scrollTo({ top: 250, behavior: "smooth" });
                    }}
                    className="relative aspect-square rounded-2xl overflow-hidden border border-border/10 cursor-pointer group shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <Image
                      src={imgUrl}
                      alt={`Gallery Photo ${idx + 1}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <span className="text-white text-xs font-semibold px-3 py-1 bg-black/60 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                        {t("View", "عرض", "بینین")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
