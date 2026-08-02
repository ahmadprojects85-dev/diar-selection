import type { CartItem } from "@/context/CartContext";

const WHATSAPP_NUMBER = "9647721557666"; // Replace with actual WhatsApp business number

export interface WhatsAppOrderParams {
  name: string;
  slug: string;
  sku: string;
  selectedColor?: { name: string; colorCode: string; image: string };
}

export function getWhatsAppOrderUrl(product: WhatsAppOrderParams): string {
  const message = `Hello,
I am interested in:

Product: ${product.name}
Link: https://diarselection.com/products/${product.slug}

Can you provide availability and details?`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export interface OrderDetails {
  fullName: string;
  phone: string;
  city: string;
  address: string;
}

export function getWhatsAppOrderWithDetailsUrl(
  product: WhatsAppOrderParams, 
  details: OrderDetails
): string {
  const message = `Hello Diar Selection, I would like to place an order with the following details:

👤 Customer Name: ${details.fullName}
📞 Phone Number: ${details.phone}
📍 City/Region: ${details.city}
🏠 Detailed Address: ${details.address}

🛒 Order Item:
- Product: ${product.name}${product.selectedColor ? ` (Color: ${product.selectedColor.name})` : ''}
🔗 Link: https://diarselection.com/products/${product.slug}

Please confirm my order. Thank you!`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

import { formatPrice } from "./price";

export function getWhatsAppCartUrl(items: CartItem[], total: number, language: string = "en"): string {
  let message = `Hello Diar Selection, I would like to order the following items:\n\n`;

  items.forEach((item, index) => {
    const colorStr = item.selectedColor ? ` (Color: ${item.selectedColor.name})` : '';
    message += `${index + 1}. ${item.quantity}x ${item.name}${colorStr} - ${formatPrice(item.price, language)}${item.quantity > 1 ? ` (${formatPrice(item.price * item.quantity, language)})` : ''}\n`;
    message += `Link: https://diarselection.com/products/${item.slug}\n\n`;
  });

  message += `Total: ${formatPrice(total, language)}\n\n`;
  message += `Please confirm my order and let me know the shipping details.`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function getWhatsAppCartWithDetailsUrl(
  items: CartItem[],
  total: number,
  details: OrderDetails,
  language: string = "ku"
): string {
  const isKurdish = language === "ku" || language === "kmr";
  const isArabic = language === "ar";

  let message = isKurdish 
    ? `سڵاو دیار سێلێکشن، دەمەوێت ئەم داواکارییە تۆمار بکەم لەگەڵ زانیارییەکانی گەیاندن:\n\n`
    : isArabic
    ? `مرحباً ديار سيلكشن، أرغب بتأكيد الطلب التالي مع معلومات التوصيل:\n\n`
    : `Hello Diar Selection, I would like to place an order with the following details:\n\n`;

  message += `👤 ${isKurdish ? 'ناوی کڕیار' : isArabic ? 'اسم العميل' : 'Customer Name'}: ${details.fullName}\n`;
  message += `📞 ${isKurdish ? 'ژمارەی مۆبایل' : isArabic ? 'رقم الهاتف' : 'Phone Number'}: ${details.phone}\n`;
  message += `📍 ${isKurdish ? 'شار / ناوچە' : isArabic ? 'المدينة' : 'City/Region'}: ${details.city}\n`;
  message += `🏠 ${isKurdish ? 'ناونیشانی تەواو' : isArabic ? 'العنوان التفصيلي' : 'Detailed Address'}: ${details.address}\n\n`;

  message += `🛒 ${isKurdish ? 'بەرهەمەکان' : isArabic ? 'المنتجات' : 'Ordered Items'}:\n`;
  items.forEach((item, index) => {
    const colorStr = item.selectedColor ? ` (${item.selectedColor.name})` : '';
    const itemName = isArabic ? (item.nameAr || item.name) : isKurdish ? (item.nameKu || item.name) : item.name;
    message += `${index + 1}. ${item.quantity}x ${itemName}${colorStr} - ${formatPrice(item.price * item.quantity, language)}\n`;
    message += `   🔗 https://diarselection.com/products/${item.slug}\n`;
  });

  message += `\n💰 ${isKurdish ? 'کۆی گشتی' : isArabic ? 'المجموع الكلي' : 'Total Amount'}: ${formatPrice(total, language)}\n\n`;
  message += isKurdish 
    ? `تکایە داواکارییەکەم پشتڕاست بکەنەوە. سوپاس!`
    : isArabic
    ? `يرجى تأكيد الطلب. شكراً لكم!`
    : `Please confirm my order. Thank you!`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function getWhatsAppChatUrl(): string {
  return `https://wa.me/${WHATSAPP_NUMBER}`;
}
