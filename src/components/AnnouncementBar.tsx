import { Sparkles, Truck, MessageCircle } from 'lucide-react';

const ITEMS = [
  { icon: Sparkles, text: 'Worldwide Shipping Available' },
  { icon: MessageCircle, text: 'Custom Bridal Consultations Open' },
  { icon: Truck, text: 'Book via WhatsApp' },
  { icon: Sparkles, text: 'Hand-Crafted Unstitched Couture' },
];

export default function AnnouncementBar() {
  const loop = [...ITEMS, ...ITEMS];
  return (
    <div className="bg-ink-900 text-ivory-100 overflow-hidden">
      <div className="relative flex whitespace-nowrap animate-marquee py-2.5">
        {loop.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2.5 px-8 text-[11px] sm:text-xs tracking-luxe uppercase font-light"
          >
            <span className="text-champagne-300">✦</span>
            {item.text}
            <span className="text-champagne-500/60 ml-3">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
