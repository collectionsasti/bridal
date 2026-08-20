import { Scissors, Gem, Crown, Globe2 } from 'lucide-react';
import { ABOUT_IMAGE } from '@/data/brand';

const PILLARS = [
  {
    icon: Scissors,
    title: 'Unstitched, Always',
    body: 'Every suit ships as fabric — so your darzi cuts it to your exact silhouette and length.',
  },
  {
    icon: Gem,
    title: 'Karigar Handwork',
    body: 'Zardozi, dabka, kamdani and pearlwork placed by hand, never machine-embroidered.',
  },
  {
    icon: Crown,
    title: 'Bridal Atelier',
    body: 'A small batch of suits each season — we never mass-produce a bridal masterpiece.',
  },
  {
    icon: Globe2,
    title: 'Worldwide Shipping',
    body: 'Door-to-door courier to brides across the globe, fully insured and tracked.',
  },
];

export default function AboutStrip() {
  return (
    <section className="relative py-20 sm:py-28 bg-ivory-200 overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 reveal">
            <div className="relative">
              <div className="overflow-hidden rounded-sm aspect-[4/5] shadow-soft">
                <img
                  src={ABOUT_IMAGE}
                  alt="Ab Bridal atelier — close-up of bridal lace fitting"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute inset-3 border border-ink-900/40 pointer-events-none" />
              <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-ivory-50 border border-stone-200 rounded-sm px-6 py-5 shadow-lux">
                <p className="font-display text-4xl text-gold-gradient leading-none">14+</p>
                <p className="text-[10px] tracking-luxe uppercase text-ink-600 font-light mt-1.5">
                  Years of Bridal Karigari
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 reveal" style={{ transitionDelay: '120ms' }}>
            <p className="text-[10px] sm:text-xs tracking-luxe uppercase text-champagne-700/80 font-light mb-4">
              The Ab Bridal Atelier
            </p>
            <h2 className="font-display text-4xl sm:text-5xl text-ink-900 leading-tight mb-6">
              Couture that begins
              <span className="block italic text-gold-gradient">with the karigar's hand</span>
            </h2>
            <p className="text-sm sm:text-base text-ink-600 font-light leading-relaxed mb-9">
              Ab Bridal was founded on a single belief — that an unstitched suit is the most
              honest form of bridal couture. We hand you the fabric, the embroidery and the
              dupatta; your darzi gives it your shape. Every motif is couched by a karigar who
              has spent decades mastering zardozi, kamdani and pearlwork.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              {PILLARS.map((p) => {
                const Icon = p.icon;
                return (
                  <div key={p.title} className="flex gap-4">
                    <Icon size={22} className="text-champagne-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm tracking-wide text-ink-900 font-medium mb-1.5">
                        {p.title}
                      </h3>
                      <p className="text-[13px] text-ink-600 font-light leading-relaxed">
                        {p.body}
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
