export function getCategoryDisplayName(cat: any, language: string): string {
  if (!cat) return "";

  // 1. Check database fields if set
  if (language === "ar" && cat.nameAr) return cat.nameAr;
  if (language === "kmr" && (cat.nameKm || cat.nameKu)) return cat.nameKm || cat.nameKu;
  if (language === "ku" && cat.nameKu) return cat.nameKu;

  // 2. Dictionary fallback for standard coffee categories
  const key = (cat.slug || cat.name || "").toLowerCase().trim();
  const dict: Record<string, { ar: string; ku: string; km: string }> = {
    grinders: { ar: "طواحين", ku: "ئاراوەکان", km: "Hêڕer" },
    scales: { ar: "موازين", ku: "تەرازووەکان", km: "Terezî" },
    kettles: { ar: "أباريق", ku: "کتری", km: "Ketri" },
    brewers: { ar: "أدوات التحضير", ku: "ئامێرەکانی دروستکردن", km: "Amûrên çêkirinê" },
    filters: { ar: "فلاتر", ku: "فلتەرەکان", km: "Fîlter" },
    accessories: { ar: "إكسسوارات", ku: "ئاکسسوارات", km: "Aksesoar" },
    "coffee makers": { ar: "أجهزة القهوة", ku: "ئامێرەکانی دروستکردن", km: "Amûrên çêkirinê" },
  };

  if (dict[key]) {
    if (language === "ar") return dict[key].ar;
    if (language === "kmr") return dict[key].km;
    if (language === "ku") return dict[key].ku;
  }

  return cat.name;
}
