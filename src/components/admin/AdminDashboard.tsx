import { useState } from 'react';
import { Plus, Pencil, LogOut, Loader2, ArrowLeft, Film, ImageIcon } from 'lucide-react';
import { useProducts } from '@/lib/useProducts';
import { useAdminAuth } from '@/lib/useAdminAuth';
import type { Product } from '@/lib/supabase';
import ProductEditor from '@/components/admin/ProductEditor';
import CollectionManager from '@/components/admin/CollectionManager';

interface AdminDashboardProps {
  onExit: () => void;
}

export default function AdminDashboard({ onExit }: AdminDashboardProps) {
  const { products, loading, error, refresh } = useProducts();
  const { signOut } = useAdminAuth();
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    onExit();
  };

  if (creating || editing) {
    return (
      <div className="bg-ivory-100 min-h-[calc(100vh-160px)]">
        <div className="mx-auto max-w-4xl px-5 sm:px-8 py-10">
          <ProductEditor
            product={editing}
            onSaved={() => {
              setEditing(null);
              setCreating(false);
              refresh();
            }}
            onCancel={() => {
              setEditing(null);
              setCreating(false);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-ivory-100 min-h-[calc(100vh-160px)]">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-10">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl text-ink-900">Bridal Catalog</h1>
            <p className="text-[10px] tracking-luxe uppercase text-ink-500 font-light mt-1">
              {products.length} suit{products.length === 1 ? '' : 's'} in the atelier
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onExit}
              className="inline-flex items-center gap-2 rounded-full border border-stone-300 text-ink-600 hover:border-champagne-500 px-4 py-2 text-[11px] tracking-luxe uppercase font-light transition-colors"
            >
              <ArrowLeft size={14} />
              View store
            </button>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 rounded-full border border-stone-300 text-ink-600 hover:border-wine-700/50 hover:text-wine-700 px-4 py-2 text-[11px] tracking-luxe uppercase font-light transition-colors"
            >
              <LogOut size={14} />
              Sign out
            </button>
            <button
              onClick={() => setCreating(true)}
              className="inline-flex items-center gap-2 rounded-full bg-ivory-100 hover:bg-ivory-200 text-ink-900 px-5 py-2 text-[11px] tracking-luxe uppercase font-light transition-colors"
            >
              <Plus size={14} />
              New suit
            </button>
          </div>
        </div>

        {/* Collection Manager */}
        <CollectionManager />

        {/* Products */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-ink-500">
            <Loader2 size={26} className="animate-spin text-champagne-600 mb-4" />
            <p className="text-xs tracking-luxe uppercase font-light">Loading catalog…</p>
          </div>
        ) : error ? (
          <div className="rounded-sm border border-wine-700/30 bg-wine-900/5 px-5 py-4 text-sm text-wine-700 font-light">
            {error}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-display text-2xl text-ink-800 mb-2">No suits yet</p>
            <p className="text-sm text-ink-500 font-light mb-6">
              Add your first bridal suit to populate the store.
            </p>
            <button
              onClick={() => setCreating(true)}
              className="inline-flex items-center gap-2 rounded-full bg-ivory-100 hover:bg-ivory-200 text-ink-900 px-5 py-2.5 text-[11px] tracking-luxe uppercase font-light transition-colors"
            >
              <Plus size={14} />
              Add a suit
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((p) => (
              <div
                key={p.id}
                className="group rounded-sm border border-stone-200 bg-ivory-50 overflow-hidden hover:border-champagne-400/60 transition-colors shadow-soft"
              >
                <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-ink-500/40">
                      <ImageIcon size={28} />
                    </div>
                  )}
                  <div className="absolute top-2 left-2 inline-flex items-center gap-1.5 rounded-full bg-ivory-100/90 backdrop-blur-sm border border-stone-300 px-2.5 py-1">
                    <span className="text-[9px] tracking-luxe uppercase text-ink-700 font-light">
                      {p.collection_label}
                    </span>
                  </div>
                  {p.video_url && (
                    <div className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-ivory-100/70 backdrop-blur-sm px-2 py-1">
                      <Film size={10} className="text-champagne-300" fill="currentColor" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-display text-xl text-ink-900 leading-tight">{p.name}</h3>
                  <p className="text-[11px] text-ink-500 font-light mt-1">
                    {p.price || 'No price set'}
                  </p>
                  <div className="mt-3 flex items-center gap-3 text-[10px] text-ink-500 font-light">
                    <span>{p.gallery?.length ?? 0} photos</span>
                    <span>·</span>
                    <span>order {p.sort_order}</span>
                  </div>
                  <button
                    onClick={() => setEditing(p)}
                    className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-full border border-stone-300 hover:border-champagne-500 hover:text-champagne-700 text-ink-700 px-4 py-2 text-[11px] tracking-luxe uppercase font-light transition-colors"
                  >
                    <Pencil size={13} />
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
