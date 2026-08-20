import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/lib/supabase';

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('sort_order', { ascending: true });
      if (cancelled) return;
      if (error) {
        setError(error.message);
        setProducts([]);
      } else {
        setProducts((data ?? []) as Product[]);
        setError(null);
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [nonce]);

  return { products, loading, error, refresh: () => setNonce((n) => n + 1) };
}

export function filterByCollection(
  products: Product[],
  collection: string | 'all'
): Product[] {
  if (collection === 'all') return products;
  return products.filter((p) => p.collection === collection);
}
