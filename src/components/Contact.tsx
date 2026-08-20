import { MessageCircle, Phone, MapPin, Clock, Mail } from 'lucide-react';
import { BRAND } from '@/data/brand';
import { buildWhatsAppUrl, generalInquiryMessage } from '@/lib/whatsapp';

export default function Contact() {
  const waUrl = buildWhatsAppUrl(generalInquiryMessage());

  const tiles = [
    {
      icon: Phone,
      label: 'Call the Atelier',
      value: BRAND.phoneDisplay,
      href: `tel:+${BRAND.whatsappNumber}`,
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp Business',
      value: `+${BRAND.whatsappNumber}`,
      href: waUrl,
    },
    {
      icon: Mail,
      label: 'Email',
      value: BRAND.email,
      href: `mailto:${BRAND.email}`,
    },
    {
      icon: MapPin,
      label: 'Atelier',
      value: BRAND.location,
    },
  ];

  return (
    <section id="contact" className="relative py-20 sm:py-28 bg-ivory-200">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="reveal text-center mb-12">
          <p className="text-[10px] sm:text-xs tracking-luxe uppercase text-champagne-700/80 font-light mb-4">
            Bridal Consultations Open
          </p>
          <h2 className="font-display text-4xl sm:text-5xl text-ink-900">
            Begin Your <span className="italic text-gold-gradient">Bridal Story</span>
          </h2>
          <div className="hairline w-40 mx-auto mt-6" />
          <p className="mt-6 max-w-2xl mx-auto text-sm sm:text-base text-ink-600 font-light leading-relaxed">
            Book a one-on-one bridal consultation, request a made-to-order suit, or ask
            about worldwide shipping — we reply on WhatsApp within the day.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 reveal">
          {tiles.map((t) => {
            const Icon = t.icon;
            const inner = (
              <div className="group flex items-center gap-5 rounded-sm border border-stone-200 bg-ivory-50 hover:border-champagne-400/60 px-6 py-6 transition-all">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-champagne-500/40 text-champagne-600 group-hover:bg-champagne-500/10 transition-colors">
                  <Icon size={20} />
                </span>
                <div>
                  <p className="text-[10px] tracking-luxe uppercase text-champagne-700/70 font-light mb-1">
                    {t.label}
                  </p>
                  <p className="font-display text-xl text-ink-900">{t.value}</p>
                </div>
              </div>
            );
            return t.href ? (
              <a
                key={t.label}
                href={t.href}
                target={t.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
              >
                {inner}
              </a>
            ) : (
              <div key={t.label}>{inner}</div>
            );
          })}
        </div>

        <div className="reveal mt-9 flex items-center justify-center gap-3 text-ink-600 font-light text-sm">
          <Clock size={16} className="text-champagne-600" />
          <span>Atelier hours · Mon–Sat · 11:00 AM – 8:00 PM PKT</span>
        </div>

        <div className="reveal mt-10 text-center">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-full bg-[#25D366] hover:bg-[#1fb855] px-9 py-5 text-white text-[12px] tracking-luxe uppercase font-semibold shadow-soft transition-all hover:scale-[1.02] animate-pulse-ring"
          >
            <MessageCircle size={18} />
            Book Your Consultation on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
