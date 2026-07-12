"use client";

import { useLanguage } from "@/context/LanguageContext";
import type { Language } from "@/context/LanguageContext";

// Hack to get the keys of translations
type TranslationKey = keyof ReturnType<typeof useLanguage>["t"] extends (k: infer K) => string ? K : string;

export function TranslatedText({ tKey }: { tKey: any }) {
  const { t } = useLanguage();
  return <>{t(tKey)}</>;
}
