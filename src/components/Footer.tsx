import { useEffect, useState } from 'react';
import { MessageCircle, Phone, Mail, MapPin, Instagram, Facebook, ShieldCheck, CreditCard, Truck, Award } from 'lucide-react';
import { BRAND } from '@/data/brand';
import { buildWhatsAppUrl, generalInquiryMessage } from '@/lib/whatsapp';
import { supabase } from '@/lib/supabase';
import type { Collection } from '@/lib/supabase';

interface FooterProps {
  onNavigate: (view: 'home' | 'shop' | 'contact' | 'admin') => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const waUrl = buildWhatsAppUrl(generalInquiryMessage());
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('collections')
        .select('*')
        .order('sort_order', { ascending: true });
      setCollections((data ?? []) as Collection[]);
    })();
  }, []);

  const quickLinks: { label: string; key: Parameters<typeof onNavigate>[0] }[] = [
    { label: 'Home', key: 'home' },
    { label: 'Shop', key: 'shop' },
    { label: 'Contact', key: 'contact' },
  ];

  return (
    <footer className="bg-ivory-200 border-t border-stone-200">
      <div className="border-b border-stone-200">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-7 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: ShieldCheck, label: 'Authentic Karigari' },
            { icon: Truck, label: 'Worldwide Shipping' },
            { icon: CreditCard, label: 'Secure Advance Booking' },
            { icon: Award, label: 'Bridal Care Scroll' },
          ].map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.label} className="flex items-center gap-3 justify-center text-center">
                <Icon size={18} className="text-champagne-600 shrink-0" />
                <span className="text-[10px] tracking-luxe uppercase text-ink-600 font-light">
                  {b.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14">
          <div className="md:col-span-5">
            <p className="font-accent text-3xl tracking-luxe text-gold-gradient">Ab Bridal</p>
            <p className="text-[9px] tracking-luxe uppercase text-ink-500/60 font-light mt-1.5">
              {BRAND.tagline}
            </p>
            <p className="mt-6 text-sm text-ink-600 font-light leading-relaxed max-w-md">
              Ab Bridal is a bridal atelier devoted to unstitched couture — hand-embroidered
              suits for Mehndi, Barat and Walima, crafted by master karigars and delivered
              worldwide. We hand you the fabric and the embroidery; your darzi gives it your
              shape. That is the honest, royal way bridal couture should be.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#25D366]/12 border border-[#25D366]/40 hover:bg-[#25D366]/22 px-4 py-2 text-[10px] tracking-luxe uppercase text-[#1f8b4c] font-light transition-colors"
              >
                <MessageCircle size={13} />
                Chat Now
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-300 text-ink-600 hover:text-champagne-700 hover:border-champagne-500 transition-colors"
              >
                <Instagram size={16} />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-300 text-ink-600 hover:text-champagne-700 hover:border-champagne-500 transition-colors"
              >
                <Facebook size={16} />
              </a>
            </div>
          </div>

          <div className="md:col-span-3">
            <p className="text-[10px] tracking-luxe uppercase text-champagne-700/80 font-light mb-5">
              Quick Links
            </p>
            <ul className="space-y-3">
              {quickLinks.map((l) => (
                <li key={l.key}>
                  <button
                    onClick={() => onNavigate(l.key)}
                    className="text-sm text-ink-600 hover:text-champagne-700 font-light transition-colors"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="text-[10px] tracking-luxe uppercase text-champagne-700/80 font-light mb-5">
              Collections
            </p>
            <ul className="space-y-3">
              {collections.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => onNavigate('shop')}
                    className="text-sm text-ink-600 hover:text-champagne-700 font-light transition-colors"
                  >
                    {c.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="text-[10px] tracking-luxe uppercase text-champagne-700/80 font-light mb-5">
              Contact
            </p>
            <ul className="space-y-4 text-sm text-ink-600 font-light">
              <li className="flex items-start gap-2.5">
                <Phone size={14} className="text-champagne-600 mt-0.5 shrink-0" />
                <a href={`tel:+${BRAND.whatsappNumber}`} className="hover:text-champagne-700 transition-colors">
                  {BRAND.phoneDisplay}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail size={14} className="text-champagne-600 mt-0.5 shrink-0" />
                <a href={`mailto:${BRAND.email}`} className="hover:text-champagne-700 transition-colors break-all">
                  {BRAND.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={14} className="text-champagne-600 mt-0.5 shrink-0" />
                <span>{BRAND.location}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-stone-200">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 justify-center">
            {['VISA', 'Mastercard', 'Bank Transfer', 'Cash on Pickup'].map((p) => (
              <span
                key={p}
                className="rounded-sm border border-stone-300 px-3 py-1.5 text-[9px] tracking-luxe uppercase text-ink-500 font-light"
              >
                {p}
              </span>
            ))}
          </div>
          <p className="text-[10px] tracking-luxe uppercase text-ink-500 font-light text-center">
            © {new Date().getFullYear()} Ab Bridal Atelier · Crafted in Lahore · Shipped Worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}
