import { useState, useRef } from 'react';
import { X, Plus, Trash2, Loader2, Save, ImagePlus, Film, Upload, Link } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Product, ProductInput } from '@/lib/supabase';
import { useCollections } from '@/lib/useCollections';

interface ProductEditorProps {
  product: Product | null;
  onSaved: () => void;
  onCancel: () => void;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

function emptyInput(): ProductInput {
  return {
    name: '',
    slug: '',
    collection: 'barat',
    collection_label: 'Barat',
    tagline: '',
    description: '',
    story: '',
    price: '',
    fabric: '',
    work: '',
    color: '',
    pieces: '',
    includes: [],
    video_url: '',
    image: '',
    gallery: [],
    palette: [],
    sort_order: 99,
  };
}

function fromProduct(p: Product): ProductInput {
  return {
    name: p.name,
    slug: p.slug,
    collection: p.collection,
    collection_label: p.collection_label,
    tagline: p.tagline,
    description: p.description,
    story: p.story ?? '',
    price: p.price,
    fabric: p.fabric ?? '',
    work: p.work ?? '',
    color: p.color ?? '',
    pieces: p.pieces ?? '',
    includes: p.includes ?? [],
    video_url: p.video_url,
    image: p.image,
    gallery: p.gallery ?? [],
    palette: p.palette ?? [],
    sort_order: p.sort_order,
  };
}

const inputClass =
  'w-full rounded-sm border border-stone-300 bg-ivory-100 px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-500/50 focus:border-champagne-500 focus:outline-none focus:ring-1 focus:ring-champagne-500/40 transition-colors';

export default function ProductEditor({ product, onSaved, onCancel }: ProductEditorProps) {
  const { collections } = useCollections();
  const [input, setInput] = useState<ProductInput>(
    product ? fromProduct(product) : emptyInput()
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [addMode, setAddMode] = useState<'upload' | 'url'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditing = !!product;

  const update = <K extends keyof ProductInput>(key: K, value: ProductInput[K]) => {
    setInput((prev) => ({ ...prev, [key]: value }));
  };

  const handleNameChange = (name: string) => {
    update('name', name);
    if (!isEditing) update('slug', slugify(name));
  };

  const handleCollectionChange = (slug: string) => {
    const col = collections.find((c) => c.slug === slug);
    update('collection', slug);
    update('collection_label', col?.label ?? slug);
  };

  const addGalleryUrl = () => {
    const url = newGalleryUrl.trim();
    if (!url) return;
    update('gallery', [...input.gallery, url]);
    if (!input.image) update('image', url);
    setNewGalleryUrl('');
  };

  const removeGalleryUrl = (idx: number) => {
    const next = input.gallery.filter((_, i) => i !== idx);
    update('gallery', next);
    if (input.image === input.gallery[idx]) {
      update('image', next[0] ?? '');
    }
  };

  const setPrimaryImage = (url: string) => update('image', url);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    const uploaded: string[] = [];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue;
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;
      const path = `products/${fileName}`;

      const { error: upErr } = await supabase.storage
        .from('product-images')
        .upload(path, file, { cacheControl: '3600', upsert: false });

      if (upErr) {
        setError(`Upload failed: ${upErr.message}`);
        continue;
      }

      const { data: pub } = supabase.storage
        .from('product-images')
        .getPublicUrl(path);

      if (pub?.publicUrl) uploaded.push(pub.publicUrl);
    }

    if (uploaded.length > 0) {
      const newGallery = [...input.gallery, ...uploaded];
      update('gallery', newGallery);
      if (!input.image) update('image', uploaded[0]);
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!input.name.trim() || !input.slug.trim()) {
      setError('Name and slug are required.');
      return;
    }
    setSaving(true);
    const payload: ProductInput = {
      ...input,
      image: input.image || input.gallery[0] || '',
      gallery: input.gallery.length ? input.gallery : input.image ? [input.image] : [],
    };

    let result;
    if (isEditing && product) {
      result = await supabase.from('products').update(payload).eq('id', product.id);
    } else {
      result = await supabase.from('products').insert(payload);
    }

    setSaving(false);
    if (result.error) {
      setError(result.error.message);
      return;
    }
    onSaved();
  };

  const handleDelete = async () => {
    if (!product) return;
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    setSaving(true);
    const { error } = await supabase.from('products').delete().eq('id', product.id);
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    onSaved();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl sm:text-3xl text-ink-900">
          {isEditing ? 'Edit Bridal Suit' : 'New Bridal Suit'}
        </h2>
        <div className="flex items-center gap-2">
          {isEditing && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full border border-wine-700/40 text-wine-700 hover:bg-wine-700/10 px-4 py-2 text-[11px] tracking-luxe uppercase font-light transition-colors"
            >
              <Trash2 size={14} />
              Delete
            </button>
          )}
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-2 rounded-full border border-stone-300 text-ink-600 hover:border-champagne-500 px-4 py-2 text-[11px] tracking-luxe uppercase font-light transition-colors"
          >
            <X size={14} />
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-ink-900 hover:bg-ink-800 disabled:opacity-60 px-5 py-2 text-ivory-100 text-[11px] tracking-luxe uppercase font-light transition-colors"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-wine-700 font-light bg-wine-900/5 border border-wine-700/20 rounded-sm px-4 py-3">
          {error}
        </p>
      )}

      {/* Details */}
      <div className="rounded-sm border border-stone-200 bg-ivory-50 p-5 sm:p-6">
        <h3 className="text-[10px] tracking-luxe uppercase text-champagne-700/80 font-light mb-4">
          Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="block text-[10px] tracking-luxe uppercase text-ink-500 font-light mb-1.5">Name</span>
            <input
              type="text"
              value={input.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Royal Barat Regalia"
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="block text-[10px] tracking-luxe uppercase text-ink-500 font-light mb-1.5">Slug (URL)</span>
            <input
              type="text"
              value={input.slug}
              onChange={(e) => update('slug', slugify(e.target.value))}
              placeholder="royal-barat-regalia"
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="block text-[10px] tracking-luxe uppercase text-ink-500 font-light mb-1.5">Collection</span>
            <select
              value={input.collection}
              onChange={(e) => handleCollectionChange(e.target.value)}
              className={inputClass}
            >
              {collections.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="block text-[10px] tracking-luxe uppercase text-ink-500 font-light mb-1.5">Price (display)</span>
            <input
              type="text"
              value={input.price}
              onChange={(e) => update('price', e.target.value)}
              placeholder="PKR 4,85,000"
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="block text-[10px] tracking-luxe uppercase text-ink-500 font-light mb-1.5">Tagline</span>
            <input
              type="text"
              value={input.tagline}
              onChange={(e) => update('tagline', e.target.value)}
              placeholder="Zardozi on wine raw silk"
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="block text-[10px] tracking-luxe uppercase text-ink-500 font-light mb-1.5">Sort order</span>
            <input
              type="number"
              value={input.sort_order}
              onChange={(e) => update('sort_order', Number(e.target.value))}
              className={inputClass}
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="block text-[10px] tracking-luxe uppercase text-ink-500 font-light mb-1.5">Short description</span>
            <textarea
              value={input.description}
              onChange={(e) => update('description', e.target.value)}
              rows={3}
              className={`${inputClass} resize-y`}
            />
          </label>
        </div>
      </div>

      {/* Photos & Video */}
      <div className="rounded-sm border border-stone-200 bg-ivory-50 p-5 sm:p-6">
        <h3 className="text-[10px] tracking-luxe uppercase text-champagne-700/80 font-light mb-4">
          Photos & Video
        </h3>

        {/* Video URL */}
        <label className="block mb-5">
          <span className="block text-[10px] tracking-luxe uppercase text-ink-500 font-light mb-1.5">
            Embroidery video URL (MP4)
          </span>
          <div className="relative">
            <Film size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500" />
            <input
              type="url"
              value={input.video_url}
              onChange={(e) => update('video_url', e.target.value)}
              placeholder="https://res.cloudinary.com/.../video.mp4"
              className={`${inputClass} pl-10`}
            />
          </div>
        </label>

        {/* Photo gallery — Upload or URL toggle */}
        <div className="block">
          <span className="block text-[10px] tracking-luxe uppercase text-ink-500 font-light mb-1.5">
            Photo gallery
          </span>

          {/* Mode toggle */}
          <div className="inline-flex rounded-full border border-stone-300 bg-ivory-100 p-0.5 mb-3">
            <button
              type="button"
              onClick={() => setAddMode('upload')}
              className={[
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] tracking-luxe uppercase font-light transition-all',
                addMode === 'upload' ? 'bg-ink-900 text-ivory-100' : 'text-ink-600 hover:text-ink-900',
              ].join(' ')}
            >
              <Upload size={11} />
              Upload
            </button>
            <button
              type="button"
              onClick={() => setAddMode('url')}
              className={[
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] tracking-luxe uppercase font-light transition-all',
                addMode === 'url' ? 'bg-ink-900 text-ivory-100' : 'text-ink-600 hover:text-ink-900',
              ].join(' ')}
            >
              <Link size={11} />
              URL
            </button>
          </div>

          {/* Upload mode */}
          {addMode === 'upload' && (
            <div className="mb-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                capture="environment"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
                id="file-upload-input"
              />
              <label
                htmlFor="file-upload-input"
                className="flex flex-col items-center justify-center gap-2 rounded-sm border-2 border-dashed border-stone-300 hover:border-champagne-500 bg-ivory-100 py-8 px-4 cursor-pointer transition-colors"
              >
                {uploading ? (
                  <>
                    <Loader2 size={24} className="animate-spin text-champagne-600" />
                    <span className="text-xs text-ink-500 font-light">Uploading…</span>
                  </>
                ) : (
                  <>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-champagne-500/15 border border-champagne-500/30">
                      <ImagePlus size={22} className="text-champagne-700" />
                    </div>
                    <span className="text-xs tracking-luxe uppercase text-ink-600 font-light">
                      Tap to upload photos
                    </span>
                    <span className="text-[10px] text-ink-500/70 font-light">
                      Multiple images · Takes photos from camera
                    </span>
                  </>
                )}
              </label>
            </div>
          )}

          {/* URL mode */}
          {addMode === 'url' && (
            <div className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <ImagePlus size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500" />
                <input
                  type="url"
                  value={newGalleryUrl}
                  onChange={(e) => setNewGalleryUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addGalleryUrl();
                    }
                  }}
                  placeholder="https://images.pexels.com/.../photo.jpeg"
                  className={`${inputClass} pl-10`}
                />
              </div>
              <button
                type="button"
                onClick={addGalleryUrl}
                className="inline-flex items-center gap-1.5 rounded-sm bg-champagne-500/15 border border-champagne-500/40 text-champagne-700 hover:bg-champagne-500/25 px-4 text-[11px] tracking-luxe uppercase font-light transition-colors"
              >
                <Plus size={14} />
                Add
              </button>
            </div>
          )}

          {input.gallery.length === 0 ? (
            <p className="text-xs text-ink-500 font-light italic">No photos added yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {input.gallery.map((url, idx) => (
                <div
                  key={idx}
                  className="relative group rounded-sm overflow-hidden border border-stone-200 aspect-square bg-stone-100"
                >
                  <img src={url} alt="" className="h-full w-full object-cover" />
                  {input.image === url && (
                    <span className="absolute top-1.5 left-1.5 rounded-full bg-ink-900 text-ivory-100 text-[8px] tracking-luxe uppercase px-2 py-0.5">
                      Primary
                    </span>
                  )}
                  <div className="absolute inset-0 bg-ink-900/0 group-hover:bg-ink-900/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    {input.image !== url && (
                      <button
                        type="button"
                        onClick={() => setPrimaryImage(url)}
                        className="rounded-full bg-ivory-100 text-ink-900 text-[9px] tracking-luxe uppercase px-2.5 py-1 font-light"
                      >
                        Set primary
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeGalleryUrl(idx)}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-wine-700 text-ivory-100"
                      aria-label="Remove photo"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <p className="text-[11px] text-ink-500 font-light mt-2">
            The first photo added becomes the primary image automatically.
          </p>
        </div>
      </div>
    </form>
  );
}
