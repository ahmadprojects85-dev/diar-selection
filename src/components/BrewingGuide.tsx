"use client";

import { ArrowRight, Play } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

interface BrewingMethod {
  id: string;
  name: string;
  nameAr?: string;
  nameKu?: string;
  tagline?: string;
  taglineAr?: string;
  taglineKu?: string;
  description?: string;
  descriptionAr?: string;
  descriptionKu?: string;
  image?: string;
  time?: string;
}

const defaultMethods: BrewingMethod[] = [
  {
    id: "espresso",
    name: "Espresso",
    nameAr: "إسبريسو",
    nameKu: "ئێسپرێسۆ",
    tagline: "Rich, bold, and concentrated.",
    taglineAr: "غني وجريء ومركّز.",
    taglineKu: "دەوڵەمەند، بەهێز و چڕ.",
    description: "Espresso is brewed by forcing a small amount of nearly boiling water under pressure through finely ground coffee beans. It yields a thick, syrupy coffee with a rich crema on top, perfect for milk-based drinks.",
    descriptionAr: "يتم تحضير الإسبريسو عن طريق دفع كمية صغيرة من الماء شبه المغلي تحت الضغط عبر حبوب البن المطحونة بنعومة. ينتج قهوة كثيفة بطبقة كريما غنية في الأعلى، مثالية للمشروبات المبنية على الحليب.",
    descriptionKu: "ئێسپرێسۆ بە ناردنی ڕێژەیەکی کەمی ئاوی نزیکی کوڵاو بەژێر پەستان بەنێو دانەکانی قاوەی ناریندا ئامادەدەکرێت. قاوەیەکی ئەستوور و شیرینکاری لەگەڵ تەبەقەی کریمای دەوڵەمەند لەسەرەوە بەرهەمدەهێنێت، تەواوە بۆ خواردنەوەکانی شیرپێخراو.",
    image: "https://www.youtube.com/shorts/hG1mAHDoH7I",
    time: "0:30",
  },
  {
    id: "pourover",
    name: "Pour Over",
    nameAr: "بور أوفر",
    nameKu: "پۆر ئۆڤەر",
    tagline: "Clean, balanced, and nuanced flavors.",
    taglineAr: "نكهات نظيفة ومتوازنة ومتعددة.",
    taglineKu: "تامی پاک، هاوسەنگ و جیاواز.",
    description: "The pour over method provides ultimate control over water flow and temperature. By manually pouring water over the grounds, you can extract delicate floral and fruity notes that might be lost in other brewing methods.",
    descriptionAr: "طريقة البور أوفر توفر تحكماً مطلقاً في تدفق الماء ودرجة الحرارة. من خلال صب الماء يدوياً على البن المطحون، يمكنك استخلاص النكهات الزهرية والفاكهية الدقيقة التي قد تضيع في طرق التحضير الأخرى.",
    descriptionKu: "ڕێگەی پۆر ئۆڤەر کۆنترۆڵی تەواو بەسەر ڕێژەی ئاو و پلەی گەرمیدا دەدات. بە ڕشتنی ئاو بە دەستی بەسەر قاوە هاڕاوەکەدا، دەتوانیت تامە گوڵدار و میوەییە نازوکەکان بکێشیتەوە کە لە ڕێگەکانی تری ئامادەکردندا لەدەست بدرێن.",
    image: "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=1200&q=80",
    time: "3:00",
  },
  {
    id: "frenchpress",
    name: "French Press",
    nameAr: "فرنش بريس",
    nameKu: "فرێنچ پرێس",
    tagline: "Full-bodied and smooth.",
    taglineAr: "قوام كامل وسلس.",
    taglineKu: "تامی تەواو و نەرم.",
    description: "The French Press is a classic immersion brewer that steeps coffee grounds in hot water before plunging. This method retains the coffee's natural oils, resulting in a rich, full-bodied cup with a heavy mouthfeel.",
    descriptionAr: "الفرنش بريس هو جهاز تحضير كلاسيكي يغمر البن المطحون في الماء الساخن قبل الضغط. هذه الطريقة تحتفظ بالزيوت الطبيعية للقهوة، مما ينتج كوباً غنياً بقوام كامل.",
    descriptionKu: "فرێنچ پرێس ئامرازێکی کلاسیکییە کە قاوەی هاڕاو لە ئاوی گەرمدا دەخاتەوە پێش پەستاندان. ئەم ڕێگایە ڕۆنە سروشتییەکانی قاوە دەپارێزێت و قاوەیەکی دەوڵەمەند و تامی تەواو بەرهەمدەهێنێت.",
    image: "https://images.unsplash.com/photo-1544243614-2794eb84e3ce?w=1200&q=80",
    time: "4:00",
  },
  {
    id: "aeropress",
    name: "AeroPress",
    nameAr: "أيروبريس",
    nameKu: "ئایرۆپرێس",
    tagline: "Clean, versatile, and fast.",
    taglineAr: "نظيف ومتعدد الاستخدامات وسريع.",
    taglineKu: "پاک، فرەکارە و خێرا.",
    description: "The AeroPress utilizes gentle air pressure to create a smooth, rich coffee with lower acidity and no bitterness. Its versatility allows you to brew anything from espresso-style shots to clean filter coffee.",
    descriptionAr: "يستخدم الأيروبريس ضغط الهواء اللطيف لإنتاج قهوة ناعمة وغنية بحموضة أقل وبدون مرارة. تنوعه يتيح لك تحضير أي شيء من شوتات بأسلوب الإسبريسو إلى قهوة فلتر نظيفة.",
    descriptionKu: "ئایرۆپرێس پەستانی هەوای نەرم بەکاردەهێنێت بۆ دروستکردنی قاوەیەکی نەرم و دەوڵەمەند بە ئاسیدی کەمتر و بێ تاڵی. فرەکارەییەکەی ڕێگەت پێدەدات هەموو شتێک لە شۆتی ئێسپرێسۆوە تا قاوەی فلتەری پاک ئامادە بکەیت.",
    image: "https://images.unsplash.com/photo-1627883296062-822e1b106208?w=1200&q=80",
    time: "1:30",
  },
];

export function BrewingGuide() {
  const [methods, setMethods] = useState<BrewingMethod[]>(defaultMethods);
  const [activeId, setActiveId] = useState<string>("espresso");
  const { t, language } = useLanguage();
  const isRTL = language === "ar" || language === "ku";

  useEffect(() => {
    fetch("/api/brewing-methods", { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          // Merge API data with default translations as fallback
          const merged = data.map((apiMethod: BrewingMethod) => {
            const defaultMatch = defaultMethods.find(
              (d) => d.name.toLowerCase() === apiMethod.name.toLowerCase()
            );
            if (defaultMatch) {
              return {
                ...defaultMatch,
                ...apiMethod,
                nameAr: apiMethod.nameAr || defaultMatch.nameAr,
                nameKu: apiMethod.nameKu || defaultMatch.nameKu,
                taglineAr: apiMethod.taglineAr || defaultMatch.taglineAr,
                taglineKu: apiMethod.taglineKu || defaultMatch.taglineKu,
                descriptionAr: apiMethod.descriptionAr || defaultMatch.descriptionAr,
                descriptionKu: apiMethod.descriptionKu || defaultMatch.descriptionKu,
              };
            }
            return apiMethod;
          });
          setMethods(merged);
          setActiveId(merged[0].id);
        }
      })
      .catch(() => {
        // Keep defaults on error
      });
  }, []);

  const activeMethod = methods.find((m) => m.id === activeId) || methods[0];

  const getTranslatedText = (method: BrewingMethod, field: "name" | "tagline" | "description") => {
    if (language === "ar") return method[`${field}Ar`] || method[field];
    if (language === "ku") return method[`${field}Ku`] || method[field];
    return method[field];
  };

  return (
    <section className="py-14 lg:py-28 bg-bg-primary" id="brewing-guide">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 lg:mb-20">
          <p className="text-gold text-[9px] sm:text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.3em] font-medium mb-3 sm:mb-4">
            {t("brewing_guide")}
          </p>
          <h2 className="font-serif text-[28px] sm:text-4xl lg:text-5xl font-bold text-text-primary">
            {t("typesOfCoffee")}
          </h2>
        </div>

        {/* Mobile: Video first | Desktop: Text first */}
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-8 lg:gap-16 lg:items-center">

          {/* Text Content */}
          <div className="min-h-[auto] lg:min-h-[250px] flex flex-col justify-center">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary mb-3 sm:mb-6 leading-tight transition-all duration-300">
              {getTranslatedText(activeMethod, "name")}
            </h3>
            <p className="text-text-secondary text-[14px] sm:text-lg leading-[1.7] sm:leading-relaxed mb-6 sm:mb-8 max-w-md transition-all duration-300">
              {getTranslatedText(activeMethod, "description")}
            </p>
            <Link
              href={`/products?category=${encodeURIComponent('Coffee Makers')}`}
              className="inline-flex items-center justify-between lg:justify-start w-full lg:w-auto gap-3 px-6 sm:px-8 py-3.5 sm:py-3 border border-gold/40 hover:border-gold text-gold hover:bg-gold/5 transition-all duration-300 text-xs font-semibold uppercase tracking-widest rounded-xl lg:rounded-none"
            >
              <span>{t("shopTools")}</span>
              <ArrowRight size={16} className={isRTL ? "rotate-180" : ""} />
            </Link>
          </div>

          {/* Right — Video + Methods */}
          <div className="space-y-4 sm:space-y-6">

            {/* Brewing Methods List (Scrollable on mobile) */}
            <div className="flex flex-row flex-nowrap lg:grid lg:grid-cols-2 gap-3 sm:gap-4 overflow-x-auto lg:overflow-visible scrollbar-hide pb-2 lg:pb-0 px-1 sm:px-0"
              style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {methods.map((method) => {
                const isActive = method.id === activeId;
                return (
                  <div
                    key={method.id}
                    onClick={() => setActiveId(method.id)}
                    className={`shrink-0 w-[140px] lg:w-auto p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl border transition-all duration-300 cursor-pointer ${isActive
                        ? "bg-bg-elevated border-gold shadow-sm"
                        : "bg-bg-card border-border hover:border-border-light hover:bg-bg-elevated"
                      }`}
                  >
                    <h4
                      className={`text-[13px] sm:text-base lg:text-lg font-semibold lg:mb-1.5 transition-colors whitespace-nowrap lg:whitespace-normal ${isActive ? "text-gold" : "text-text-primary"
                        }`}
                    >
                      {getTranslatedText(method, "name")}
                    </h4>
                    <p className="text-text-muted text-[11px] sm:text-xs lg:text-sm leading-relaxed hidden lg:block">
                      {getTranslatedText(method, "tagline")}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Video Placeholder */}
            <div className="relative aspect-[16/10] sm:aspect-video rounded-2xl sm:rounded-3xl overflow-hidden bg-bg-card border border-border group transition-all duration-500">
              {(activeMethod.image?.includes('youtube.com') || activeMethod.image?.includes('youtu.be')) ? (
                <iframe 
                  className="absolute inset-0 w-full h-full"
                  src={activeMethod.image.replace('/shorts/', '/embed/').replace('watch?v=', 'embed/').split('&')[0]} 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              ) : activeMethod.image?.match(/\.(mp4|webm|ogg)$/i) ? (
                <video
                  src={activeMethod.image}
                  className="absolute inset-0 w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-500 cursor-pointer"
                  style={{
                    backgroundImage: `url('${activeMethod.image || ""}')`,
                  }}
                />
              )}
              
              {!(activeMethod.image?.includes('youtube.com') || activeMethod.image?.includes('youtu.be')) && (
                <>
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors pointer-events-none" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <Play size={20} className="text-white ml-1 sm:size-24" fill="white" />
                    </div>
                  </div>
                  {/* Video progress bar placeholder */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/60 to-transparent pointer-events-none">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Play size={12} className="text-white sm:w-3.5 sm:h-3.5" />
                      <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                        <div className="h-full w-[15%] bg-gold rounded-full" />
                      </div>
                      <span className="text-white/80 text-[9px] sm:text-[10px] font-medium tracking-wider">0:15 / {activeMethod.time}</span>
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
