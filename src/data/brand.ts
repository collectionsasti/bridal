import { Crown, Flower2, Gem, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const BRAND = {
  name: 'Ab Bridal',
  phoneDisplay: '0324 4040700',
  whatsappNumber: '923244040700',
  tagline: 'Unstitched Luxury Bridal Couture',
  email: 'atelier@abbridal.com',
  location: 'Lahore Atelier • Worldwide Shipping',
};

const FALLBACK_ICONS: Record<string, LucideIcon> = {
  mehndi: Flower2,
  barat: Crown,
  walima: Gem,
};

export function collectionIcon(key: string): LucideIcon {
  return FALLBACK_ICONS[key] ?? Sparkles;
}

export const HERO_IMAGE =
  'https://images.pexels.com/photos/11076482/pexels-photo-11076482.jpeg?auto=compress&cs=tinysrgb&h=1400&w=1900';

export const ABOUT_IMAGE =
  'https://images.pexels.com/photos/30575396/pexels-photo-30575396.jpeg?auto=compress&cs=tinysrgb&h=1100&w=900';

export const TESTIMONIAL_IMAGE =
  'https://images.pexels.com/photos/30167017/pexels-photo-30167017.jpeg?auto=compress&cs=tinysrgb&h=900&w=1400';
