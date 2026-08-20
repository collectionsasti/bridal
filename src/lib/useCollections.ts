import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Collection } from '@/lib/supabase';

interface UseCollectionsResult {
  collections: Collection[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
  createCollection: (label: string) => Promise<{ error: string | null }>;
  updateCollection: (id: string, label: string, sortOrder: number) => Promise<{ error: string | null }>;
  deleteCollection: (id: string) => Promise<{ error: string | null }>;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60);
}

export function useCollections(): UseCollectionsResult {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  const refresh = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .order('sort_order', { ascending: true });
      if (cancelled) return;
      if (error) {
        setError(error.message);
        setCollections([]);
      } else {
        setCollections((data ?? []) as Collection[]);
        setError(null);
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [nonce]);

  const createCollection = useCallback(async (label: string) => {
    const slug = slugify(label);
    if (!slug) return { error: 'Collection name is required.' };
    const { error } = await supabase
      .from('collections')
      .insert({ label, slug, sort_order: 99 });
    if (error) return { error: error.message };
    refresh();
    return { error: null };
  }, [refresh]);

  const updateCollection = useCallback(async (id: string, label: string, sortOrder: number) => {
    const { error } = await supabase
      .from('collections')
      .update({ label, sort_order: sortOrder })
      .eq('id', id);
    if (error) return { error: error.message };
    refresh();
    return { error: null };
  }, [refresh]);

  const deleteCollection = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('collections')
      .delete()
      .eq('id', id);
    if (error) return { error: error.message };
    refresh();
    return { error: null };
  }, [refresh]);

  return {
    collections,
    loading,
    error,
    refresh,
    createCollection,
    updateCollection,
    deleteCollection,
  };
}
