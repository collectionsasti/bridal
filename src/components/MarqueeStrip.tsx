const WORDS = [
  'Zardozi',
  'Kamdani',
  'Dabka',
  'Gota Patti',
  'Pearlwork',
  'Shisha Mirror',
  'Naqshi',
  'Kora',
  'Raw Silk',
  'Organza',
  'Tissue',
];

export default function MarqueeStrip() {
  const loop = [...WORDS, ...WORDS];
  return (
    <div className="bg-ivory-200 border-y border-stone-200 overflow-hidden py-4">
      <div className="flex whitespace-nowrap animate-marquee">
        {loop.map((w, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-6 px-8 font-display italic text-2xl sm:text-3xl text-ink-700/40"
          >
            {w}
            <span className="text-champagne-600/50 text-xs not-italic">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
