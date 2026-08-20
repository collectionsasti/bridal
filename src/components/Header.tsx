import { useEffect, useState } from 'react';
import { Menu, X, MessageCircle } from 'lucide-react';
import { BRAND } from '@/data/brand';
import { buildWhatsAppUrl, generalInquiryMessage } from '@/lib/whatsapp';

interface HeaderProps {
  onNavigate: (view: 'home' | 'shop' | 'contact' | 'admin') => void;
  active: string;
}

const NAV = [
  { key: 'home', label: 'Home' },
  { key: 'shop', label: 'Shop' },
  { key: 'contact', label: 'Contact' },
] as const;

export default function Header({ onNavigate, active }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (key: typeof NAV[number]['key']) => {
    onNavigate(key);
    setMenuOpen(false);
  };

  const waUrl = buildWhatsAppUrl(generalInquiryMessage());

  return (
    <header
      className={[
        'sticky top-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-ivory-100/90 backdrop-blur-xl border-b border-stone-200 shadow-soft'
          : 'bg-ivory-100/60 backdrop-blur-md border-b border-transparent',
      ].join(' ')}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex items-center justify-between h-20 md:h-24 py-3">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="lg:hidden text-ink-800 hover:text-champagne-600 transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <nav className="hidden lg:flex items-center gap-9 flex-1">
            {NAV.map((item) => (
              <button
                key={item.key}
                onClick={() => handleNav(item.key)}
                className={[
                  'relative text-[12px] tracking-luxe uppercase font-light transition-colors py-1',
                  active === item.key
                    ? 'text-champagne-600'
                    : 'text-ink-700 hover:text-champagne-600',
                ].join(' ')}
              >
                {item.label}
                <span
                  className={[
                    'absolute left-0 right-0 -bottom-0.5 h-px bg-champagne-500 transition-transform duration-300 origin-left',
                    active === item.key ? 'scale-x-100' : 'scale-x-0',
                  ].join(' ')}
                />
              </button>
            ))}
          </nav>

          <button
            onClick={() => handleNav('home')}
            className="flex flex-col items-center justify-center group select-none"
            aria-label={BRAND.name}
          >
            <span className="font-accent text-2xl sm:text-3xl md:text-4xl tracking-luxe text-gold-gradient leading-none">
              {BRAND.name}
            </span>
            <span className="mt-1 text-[8px] sm:text-[9px] tracking-luxe uppercase text-ink-500/60 font-light">
              {BRAND.tagline}
            </span>
          </button>

          <div className="hidden lg:flex items-center gap-7 flex-1 justify-end">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-champagne-500/50 bg-champagne-500/10 hover:bg-champagne-500/20 px-4 py-2 text-[11px] tracking-luxe uppercase font-light text-champagne-700 transition-all hover:border-champagne-500"
            >
              <MessageCircle size={14} />
              WhatsApp
            </a>
          </div>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="lg:hidden text-champagne-600 hover:text-champagne-700 transition-colors"
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle size={22} />
          </a>
        </div>
      </div>

      <div
        className={[
          'lg:hidden overflow-hidden transition-all duration-400 bg-ivory-100/95 backdrop-blur-xl border-b border-stone-200',
          menuOpen ? 'max-h-72 opacity-100' : 'max-h-0 opacity-0',
        ].join(' ')}
      >
        <nav className="flex flex-col px-8 py-4">
          {NAV.map((item) => (
            <button
              key={item.key}
              onClick={() => handleNav(item.key)}
              className={[
                'text-left py-3.5 text-sm tracking-luxe uppercase font-light border-b border-stone-200 last:border-0 transition-colors',
                active === item.key ? 'text-champagne-600' : 'text-ink-700 hover:text-champagne-600',
              ].join(' ')}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
