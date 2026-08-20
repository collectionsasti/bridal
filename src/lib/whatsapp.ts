import { BRAND } from '@/data/brand';

export function buildWhatsAppUrl(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${BRAND.whatsappNumber}?text=${encoded}`;
}

interface InquiryProduct {
  name: string;
  collectionLabel: string;
  price: string;
}

export function productInquiryMessage(product: InquiryProduct): string {
  return [
    `Assalam-o-Alaikum Ab Bridal Atelier,`,
    ``,
    `I would like to inquire about / order the following bridal suit:`,
    ``,
    `• Bridal Suit: ${product.name}`,
    `• Collection: ${product.collectionLabel}`,
    `• Indicative Price: ${product.price}`,
    ``,
    `Could you please share availability, customisation options, lead time and worldwide shipping details?`,
    ``,
    `Thank you.`,
  ].join('\n');
}

export function generalInquiryMessage(topic = 'a custom bridal consultation'): string {
  return [
    `Assalam-o-Alaikum Ab Bridal Atelier,`,
    ``,
    `I would like to book ${topic}.`,
    `Please share your available consultation slots and collection details.`,
    ``,
    `Thank you.`,
  ].join('\n');
}
