import { useMemo, useState, useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import CategoryBar from '@/components/CategoryBar';
import ProductCard from '@/components/ProductCard';
import { useProducts, filterByCollection } from '@/lib/useProducts';
import { supabase } from '@/lib/supabase';
import type { Collection } from '@/lib/supabase';

interface ShopViewProps {
  onOpenProduct: (slug: string) => void;
  initialCollection?: string | 'all';
  compact?: boolean;
}

export default function ShopView({
  onOpenProduct,
  initialCollection = 'all',
  compact = false,
}: ShopViewProps) {
  const { products, loading, error } = useProducts();
  const [active, setActive] = useState<string | 'all'>(initialCollection);
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

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: products.length };
    products.forEach((p) => {
      c[p.collection] = (c[p.collection] ?? 0) + 1;
    });
    return c;
  }, [products]);

  const visible = filterByCollection(products, active);

  // Reset active if it no longer exists in collections
  useEffect(() => {
    if (active !== 'all' && collections.length > 0 && !collections.some((c) => c.slug === active)) {
      setActive('all');
    }
  }, [collections, active]);

  return (
    <section id="shop" className="bg-ivory-100">
      {!compact && (
        <div className="pt-16 sm:pt-24 text-center px-5">
          <p className="text-[10px] sm:text-xs tracking-luxe uppercase text-champagne-700/80 font-light mb-3">
            The Bridal Catalog
          </p>
          <h2 className="font-display text-4xl sm:text-5xl text-ink-900">
            Unstitched <span className="italic text-gold-gradient">Masterpieces</span>
          </h2>
          <div className="hairline w-40 mx-auto mt-6" />
        </div>
      )}

      <div className="mt-8">
        <CategoryBar
          active={active}
          onChange={setActive}
          collections={collections.map((c) => ({ key: c.slug, label: c.label }))}
          counts={counts}
        />
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-12 sm:py-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-ink-500">
            <Loader2 size={28} className="animate-spin text-champagne-600 mb-4" />
            <p className="text-xs tracking-luxe uppercase font-light">Loading the catalog…</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 text-ink-700">
            <AlertCircle size={26} className="text-wine-700 mb-4" />
            <p className="text-sm font-light mb-1">Couldn't load the catalog.</p>
            <p className="text-xs text-ink-500 font-light">{error}</p>
          </div>
        ) : visible.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-display text-2xl text-ink-800 mb-2">No suits in this collection yet</p>
            <p className="text-sm text-ink-500 font-light">Check back soon — new karigari is on the way.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {visible.map((p) => (
              <ProductCard key={p.id} product={p} onOpen={onOpenProduct} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
