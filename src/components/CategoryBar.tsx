interface CategoryTab {
  key: string;
  label: string;
}

interface CategoryBarProps {
  active: string | 'all';
  onChange: (c: string | 'all') => void;
  collections: CategoryTab[];
  counts?: Partial<Record<string, number>>;
}

export default function CategoryBar({ active, onChange, collections, counts }: CategoryBarProps) {
  const tabs: CategoryTab[] = [{ key: 'all', label: 'All' }, ...collections];

  return (
    <div className="sticky top-[64px] md:top-[88px] z-30 bg-ivory-100/85 backdrop-blur-md border-y border-stone-200">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto py-3 no-scrollbar">
          {tabs.map((tab) => {
            const isActive = active === tab.key;
            const count = counts?.[tab.key];
            return (
              <button
                key={tab.key}
                onClick={() => onChange(tab.key)}
                className={[
                  'inline-flex items-center gap-2 rounded-full px-4 sm:px-5 py-2 text-[11px] sm:text-xs tracking-luxe uppercase font-light whitespace-nowrap transition-all border',
                  isActive
                    ? 'bg-ivory-100 text-ink-900 border-ivory-100'
                    : 'bg-transparent text-ink-600 border-stone-300 hover:border-champagne-500 hover:text-champagne-700',
                ].join(' ')}
              >
                {tab.label}
                {typeof count === 'number' && (
                  <span
                    className={[
                      'inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full text-[9px] px-1',
                      isActive ? 'bg-ink-900/20 text-ink-900' : 'bg-stone-200 text-ink-600',
                    ].join(' ')}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
