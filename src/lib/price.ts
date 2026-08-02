export function formatPrice(price: number, language: string): string {
  // Format price with thousands separator and no decimals
  const formatted = Math.round(price).toLocaleString("en-US");
  if (language === "ar" || language === "ku") {
    return `${formatted} د.ع`;
  }
  return `${formatted} IQD`;
}
