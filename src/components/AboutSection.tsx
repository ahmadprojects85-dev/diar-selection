"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, CheckCircle, Handshake, Heart, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function AboutSection() {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar' || language === 'ku';

  const values = [
    {
      icon: ShoppingBag,
      title: t("aboutVal1Title"),
      description: t("aboutVal1Desc"),
    },
    {
      icon: CheckCircle,
      title: t("aboutVal2Title"),
      description: t("aboutVal2Desc"),
    },
    {
      icon: Handshake,
      title: t("aboutVal3Title"),
      description: t("aboutVal3Desc"),
    },
    {
      icon: Heart,
      title: t("aboutVal4Title"),
      description: t("aboutVal4Desc"),
    },
  ];

  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-bg-secondary relative overflow-hidden" id="about">
      {/* Decorative Organic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-50 mix-blend-multiply dark:mix-blend-screen">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-gold/10 rounded-full blur-[80px] sm:blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-gold/10 rounded-full blur-[60px] sm:blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 sm:gap-16 lg:gap-24">
          
          {/* Left Column (45%) — Editorial Typography & Story */}
          <div className="lg:w-[45%] flex flex-col justify-center">
            {/* Small Label */}
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <span className="text-gold text-[9px] sm:text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.3em] font-bold">
                {t("aboutSubtitle")}
              </span>
              <div className="w-6 sm:w-8 h-[2px] sm:h-[1px] bg-gold sm:bg-gold/50 rounded-full sm:rounded-none" />
            </div>

            {/* Headline */}
            <h2 className="font-serif text-text-primary text-[36px] sm:text-5xl md:text-6xl lg:text-[72px] leading-[1.1] mb-5 sm:mb-6">
              <span className="block font-bold">{t("aboutTitle1")}</span>
              <span className="block font-bold">{t("aboutTitle2")}</span>
              <span 
                className="block text-gold mt-1 sm:mt-2 tracking-normal" 
                style={{ fontFamily: 'var(--font-script), cursive', fontSize: '1.4em', lineHeight: '0.8', transform: 'rotate(-2deg)' }}
              >
                {t("aboutTitle3")}
              </span>
            </h2>

            {/* Body Paragraphs */}
            <div className="space-y-4 sm:space-y-6 text-text-secondary text-[14px] sm:text-[15px] leading-[1.7] sm:leading-[1.8] mb-8 sm:mb-12 max-w-md">
              <p>
                {t("aboutP1")}
              </p>
              <p>
                {t("aboutP2")}
              </p>
              <p>
                {t("aboutP3")}
              </p>
            </div>

            {/* Bottom Call to Action Box */}
            <div className="bg-bg-elevated p-5 sm:p-6 rounded-2xl border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 sm:gap-6 hover:border-gold/30 transition-colors duration-500">
              <div className="flex flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-gold/30 flex items-center justify-center bg-bg-primary shrink-0 text-gold">
                  <Heart size={18} className="sm:w-5 sm:h-5" />
                </div>
                <p className="text-[12px] sm:text-[13px] text-text-primary font-medium leading-snug flex-1">
                  {t("aboutJoin")}
                </p>
              </div>
              <Link 
                href="/products" 
                className="w-full sm:w-auto shrink-0 bg-text-primary text-bg-primary px-6 py-3.5 sm:py-3 rounded-xl sm:rounded-full text-[11px] sm:text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-gold active:bg-gold transition-colors duration-300 flex items-center justify-center gap-2"
              >
                {t("exploreProducts")} <ArrowRight size={14} className={isRTL ? "rotate-180" : ""} />
              </Link>
            </div>
          </div>

          {/* Right Column (55%) — Lifestyle Image & Cards */}
          <div className="lg:w-[55%] flex flex-col gap-5 sm:gap-6">
            {/* Organic Image Block */}
            <div className="w-full h-[280px] sm:h-[360px] lg:h-[420px] relative overflow-hidden rounded-tl-[60px] rounded-br-[60px] sm:rounded-tl-[120px] sm:rounded-tr-[24px] sm:rounded-bl-[24px] sm:rounded-br-[120px] shadow-xl sm:shadow-2xl shadow-black/5">
              <Image 
                src="/luxury_pour_over_setup_1783452104125.png" 
                alt="Luxury coffee pour over setup" 
                fill 
                className="object-cover object-center hover:scale-105 transition-transform duration-1000 ease-out"
              />
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {values.map((value, idx) => {
                const Icon = value.icon;
                return (
                  <div 
                    key={idx}
                    className="bg-bg-card p-5 sm:p-8 rounded-2xl sm:rounded-[24px] border border-border/50 hover:border-gold/30 hover:shadow-xl shadow-black/5 transition-all duration-500 sm:hover:-translate-y-1 group flex flex-row sm:flex-col items-start gap-4 sm:gap-0"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-full border border-gold/30 flex items-center justify-center text-gold sm:mb-5 group-hover:bg-gold/10 transition-colors duration-500">
                      <Icon size={18} className="sm:w-[22px] sm:h-[22px]" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="font-serif text-[15px] sm:text-lg font-bold text-text-primary mb-1 sm:mb-3 group-hover:text-gold transition-colors duration-300">
                        {value.title}
                      </h3>
                      <p className="text-[12px] sm:text-[13px] leading-[1.6] sm:leading-[1.7] text-text-secondary">
                        {value.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
