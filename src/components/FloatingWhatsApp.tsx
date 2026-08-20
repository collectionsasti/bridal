import { useEffect, useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { BRAND } from '@/data/brand';
import { buildWhatsAppUrl, generalInquiryMessage } from '@/lib/whatsapp';

export default function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);
  const waUrl = buildWhatsAppUrl(generalInquiryMessage());

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setHintOpen(true), 1500);
    const t2 = setTimeout(() => setHintOpen(false), 9000);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, [visible]);

  return (
    <div
      className={[
        'fixed bottom-5 right-5 z-50 flex items-end gap-3 transition-all duration-500',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none',
      ].join(' ')}
    >
      {hintOpen && (
        <div className="relative mb-1 max-w-[220px] rounded-lg bg-ivory-50 border border-stone-300 px-4 py-3 shadow-lux">
          <button
            onClick={() => setHintOpen(false)}
            className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-ivory-100 border border-stone-300 text-ink-600"
            aria-label="Dismiss"
          >
            <X size={11} />
          </button>
          <p className="text-[11px] text-ink-700 font-light leading-snug">
            Brides inquire on WhatsApp — we reply within the day.
          </p>
        </div>
      )}

      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lux animate-pulse-ring hover:scale-105 transition-transform"
        aria-label={`Chat with ${BRAND.name} on WhatsApp`}
      >
        <MessageCircle size={26} />
      </a>
    </div>
  );
}
