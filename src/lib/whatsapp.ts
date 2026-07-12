import type { CartItem } from "@/context/CartContext";

const WHATSAPP_NUMBER = "9647721557666"; // Replace with actual WhatsApp business number

export interface WhatsAppOrderParams {
  name: string;
  slug: string;
  sku: string;
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
- Product: ${product.name}
🔗 Link: https://diarselection.com/products/${product.slug}

Please confirm my order. Thank you!`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function getWhatsAppCartUrl(items: CartItem[], total: number): string {
  let message = `Hello Diar Selection, I would like to order the following items:\n\n`;

  items.forEach((item, index) => {
    message += `${index + 1}. ${item.quantity}x ${item.name} - $${item.price.toFixed(2)}${item.quantity > 1 ? ` ($${(item.price * item.quantity).toFixed(2)})` : ''}\n`;
    message += `Link: https://diarselection.com/products/${item.slug}\n\n`;
  });

  message += `Total: $${total.toFixed(2)}\n\n`;
  message += `Please confirm my order and let me know the shipping details.`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function getWhatsAppChatUrl(): string {
  return `https://wa.me/${WHATSAPP_NUMBER}`;
}
