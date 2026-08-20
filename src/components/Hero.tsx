import { ArrowRight } from 'lucide-react';
import { HERO_IMAGE } from '@/data/brand';

interface HeroProps {
  onExplore: () => void;
}

export default function Hero({ onExplore }: HeroProps) {
  return (
    <section className="relative h-[92vh] min-h-[560px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={HERO_IMAGE}
          alt="Ab Bridal luxury unstitched bridal couture"
          className="h-full w-full object-cover animate-ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ivory-100/40 via-ivory-100/25 to-ivory-200" />
      </div>

      <div className="absolute inset-5 sm:inset-8 border border-ink-900/40 pointer-events-none" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <p className="animate-fade-in text-[10px] sm:text-xs tracking-luxe uppercase text-ink-900/90 font-light mb-6">
          Est. Atelier · Unstitched Bridal Couture
        </p>

        <h1 className="animate-fade-up font-display text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] leading-[0.95] text-ink-900 max-w-5xl drop-shadow-sm">
          The Royal
          <span className="block italic text-gold-gradient">Bridal Atelier</span>
        </h1>

        <p
          className="animate-fade-up mt-7 max-w-xl text-sm sm:text-base text-ink-900/90 font-light leading-relaxed"
          style={{ animationDelay: '0.15s' }}
        >
          Hand-embroidered, unstitched bridal suits for Mehndi, Barat & Walima —
          crafted by master karigars and shipped to brides worldwide.
        </p>

        <div
          className="animate-fade-up mt-10 flex flex-col sm:flex-row items-center gap-4"
          style={{ animationDelay: '0.3s' }}
        >
          <button
            onClick={onExplore}
            className="group inline-flex items-center gap-3 rounded-full bg-gold-shimmer bg-[length:200%_100%] animate-shimmer px-8 py-4 text-ivory-100 text-[12px] tracking-luxe uppercase font-medium shadow-gold transition-all hover:scale-[1.03] active:scale-100"
          >
            Shop the Collection
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-fade-in"
        style={{ animationDelay: '0.6s' }}
      >
        <span className="text-[9px] tracking-luxe uppercase text-ink-600/60">Scroll</span>
        <span className="w-px h-10 bg-gradient-to-b from-champagne-600/70 to-transparent" />
      </div>
    </section>
  );
}
