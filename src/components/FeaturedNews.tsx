"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { 
  ArrowRight, 
  Sparkles,
  Camera
} from "lucide-react";

export interface DynamicNewsArticle {
  id: string;
  tag: string;
  tagAr: string | null;
  tagKu: string | null;
  title: string;
  titleAr: string | null;
  titleKu: string | null;
  excerpt: string;
  excerptAr: string | null;
  excerptKu: string | null;
  image: string;
  images?: string | string[] | null;
  isFeatured: boolean;
  sortOrder: number;
}

function Instagram({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function getPhotoCount(item: DynamicNewsArticle) {
  if (!item.images) return 1;
  try {
    const parsed = typeof item.images === "string" ? JSON.parse(item.images) : item.images;
    if (Array.isArray(parsed) && parsed.length > 0) return 1 + parsed.length;
  } catch (e) {}
  return 1;
}

export function FeaturedNews({ initialNews }: { initialNews?: DynamicNewsArticle[] }) {
  const { language, dir } = useLanguage();
  const isRTL = dir === "rtl";
  const [news, setNews] = useState<DynamicNewsArticle[]>(initialNews || []);

  useEffect(() => {
    if (!initialNews) {
      fetch("/api/news")
        .then(res => res.json())
        .then(data => setNews(Array.isArray(data) ? data : []))
        .catch(console.error);
    }
  }, [initialNews]);

  const t = (en: string, ar: string, ku: string) => {
    if (language === "ar") return ar;
    if (language === "ku") return ku;
    return en;
  };

  const getField = (article: DynamicNewsArticle, field: "tag" | "title" | "excerpt") => {
    if (language === "ar") {
      const arField = article[`${field}Ar` as keyof DynamicNewsArticle];
      if (arField) return arField as string;
    }
    if (language === "kmr") {
      const kmField = (article as any)[`${field}Km`];
      if (kmField) return kmField as string;
      const kuField = article[`${field}Ku` as keyof DynamicNewsArticle];
      if (kuField) return kuField as string;
    }
    if (language === "ku") {
      const kuField = article[`${field}Ku` as keyof DynamicNewsArticle];
      if (kuField) return kuField as string;
    }
    return article[field] as string;
  };

  const sectionLabel = t("Diar Journal & Insights", "مجلة ورؤى ديار", "گۆڤار و زانیارییەکانی دیار");
  const sectionTitle = t("Coffee News & Information", "أخبار ومعلومات القهوة", "هەواڵ و زانیارییەکانی قاوە");
  const sectionSubtitle = t(
    "Explore the latest insights, brewing science, and stories from the global specialty coffee community.",
    "استكشف أحدث الرؤى وعلم التحضير والقصص من مجتمع القهوة المختصة العالمي.",
    "نوێترین زانیاری، زانستی دەمکردن، و چیرۆکەکانی کۆمەڵگەی قاوەی تایبەت لە جیهاندا بدۆزەرەوە."
  );
  const readAnalysisText = t("READ FULL ANALYSIS", "اقرأ التحليل الكامل", "خوێندنەوەی شیکاری تەواو");
  const readMoreText = t("Read Article", "اقرأ المقال", "خوێندنەوەی بابەتەکە");
  const aboutTitleText = t("About Diar Selection", "حول ديار سيلكشن", "دەربارەی دیار سێلێکشن");
  const aboutText = t(
    "Diar Selection is the premium destination for authentic specialty coffee equipment. We carefully curate the world's finest tools to elevate your daily coffee ritual.",
    "ديار سيلكشن هي الوجهة الممتازة لمعدات القهوة المختصة الأصلية. نحن ننظم بعناية أرقى الأدوات في العالم للارتقاء بطقوس القهوة اليومية.",
    "دیار سێلێکشن شوێنی نایاب و سەرەکییە بۆ کەرەستە و پێداویستییەکانی قاوەی تایبەت. ئێمە بە وردی باشترین ئامرازەکانی جیهان هەڵدەبژێرین بۆ بەرزکردنەوەی کوالیتی قاوەکەت."
  );
  const connectTitleText = t("CONNECT", "تواصل", "پەیوەندی");
  const visitTitleText = t("VISIT US", "زيارتنا", "سەردانمان بکەن");
  const locationText = t("Slemani, Kurdistan Iraq", "السليمانية، كوردستان العراق", "سلێمانی، کوردستان عێراق");
  const whatsappText = t("WhatsApp Chat", "محادثة واتساب", "چاتی واتساپ");

  if (news.length === 0) return null;

  // Separate featured and regular articles
  const featuredArticle = news.find(a => a.isFeatured);
  const regularArticles = news.filter(a => !a.isFeatured || a.id !== featuredArticle?.id);

  return (
    <section id="news-section" className="py-16 sm:py-24 bg-[#F8F7F5] dark:bg-bg-primary text-text-primary transition-colors duration-300 relative border-t border-border/15">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Section Header */}
        <div className="mb-12 max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-gold text-[9px] sm:text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.3em] font-bold">
              {sectionLabel}
            </span>
            <div className="h-[1px] w-8 sm:w-12 bg-gold/50" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1E1611] dark:text-text-primary font-bold tracking-tight mb-4">
            {sectionTitle}
          </h2>
          <p className="font-sans text-text-secondary text-sm sm:text-base max-w-2xl leading-relaxed">
            {sectionSubtitle}
          </p>
        </div>

        {/* Full Width News Layout */}
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            
            {/* Featured article (full width across grid) */}
            {featuredArticle && (
              <Link 
                key={featuredArticle.id} 
                href={`/news/${featuredArticle.id}`}
                className="col-span-1 md:col-span-2 lg:col-span-3 bg-white dark:bg-[#141414] rounded-[16px] overflow-hidden border border-[#E5E0D8] dark:border-white/10 shadow-sm flex flex-col transition-all duration-300 hover:shadow-md hover:border-gold/40 cursor-pointer group/card"
              >
                <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden">
                  <Image
                    src={featuredArticle.image}
                    alt={getField(featuredArticle, "title")}
                    fill
                    className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                    priority
                  />
                  <span className="absolute bottom-4 left-4 bg-gold text-[#1E1611] text-xs font-semibold px-3 py-1.5 rounded-full shadow-md z-10">
                    {getField(featuredArticle, "tag")}
                  </span>
                  {getPhotoCount(featuredArticle) > 1 && (
                    <span className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md z-10 flex items-center gap-1.5 border border-white/10">
                      <Camera size={14} className="text-gold" />
                      <span>{getPhotoCount(featuredArticle)} Photos</span>
                    </span>
                  )}
                </div>
                
                <div className="p-6 sm:p-8 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="font-serif text-2xl sm:text-3xl text-[#251B12] dark:text-white font-bold tracking-tight mb-3 hover:text-gold transition-colors duration-200">
                      {getField(featuredArticle, "title")}
                    </h3>
                    <p className="font-sans text-[#5C4D3C] dark:text-gray-300 text-sm sm:text-base leading-relaxed mb-6 line-clamp-4">
                      {getField(featuredArticle, "excerpt")}
                    </p>
                  </div>
                  
                  <div className="flex items-center">
                    <span 
                      className="flex items-center gap-3 px-6 h-12 bg-[#251B12] dark:bg-gold text-white dark:text-[#1E1611] group-hover/card:bg-gold group-hover/card:text-[#1E1611] rounded-full text-xs font-semibold tracking-wider transition-all duration-300"
                    >
                      <span>{readAnalysisText}</span>
                      <ArrowRight size={14} className={`transition-transform duration-200 group-hover/card:translate-x-1 ${isRTL ? "rotate-180 group-hover/card:-translate-x-1" : ""}`} />
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {/* Regular grid cards */}
            {regularArticles.map((article) => (
              <Link 
                key={article.id} 
                href={`/news/${article.id}`}
                className="bg-white dark:bg-[#141414] rounded-[16px] overflow-hidden border border-[#E5E0D8] dark:border-white/10 shadow-sm flex flex-col transition-all duration-300 hover:shadow-md hover:border-gold/40 cursor-pointer group/card"
              >
                <div className="relative w-full aspect-[4/3] overflow-hidden">
                  <Image
                    src={article.image}
                    alt={getField(article, "title")}
                    fill
                    className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                  />
                  <span className="absolute bottom-4 left-4 bg-gold text-[#1E1611] text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-md z-10">
                    {getField(article, "tag")}
                  </span>
                  {getPhotoCount(article) > 1 && (
                    <span className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-md z-10 flex items-center gap-1 border border-white/10">
                      <Camera size={12} className="text-gold" />
                      <span>{getPhotoCount(article)} Photos</span>
                    </span>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="font-serif text-lg sm:text-xl text-[#251B12] dark:text-white font-bold tracking-tight mb-2 hover:text-gold transition-colors duration-200 line-clamp-2">
                      {getField(article, "title")}
                    </h3>
                    <p className="font-sans text-[#5C4D3C] dark:text-gray-300 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3">
                      {getField(article, "excerpt")}
                    </p>
                  </div>

                  <div className="flex items-center mt-2">
                    <span
                      className="flex items-center gap-1.5 text-xs font-bold text-[#251B12] dark:text-gold group-hover/card:text-gold transition-colors duration-200"
                    >
                      <span>{readMoreText}</span>
                      <ArrowRight size={12} className={`transition-transform duration-200 group-hover/card:translate-x-1 ${isRTL ? "rotate-180 group-hover/card:-translate-x-1" : ""}`} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}

          </div>
        </div>

      </div>
    </section>
  );
}
