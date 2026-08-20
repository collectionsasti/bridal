import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Play,
  Image as ImageIcon,
  ShoppingCart,
  MessageCircle,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/lib/supabase';
import { collectionIcon } from '@/data/brand';
import { buildWhatsAppUrl, productInquiryMessage } from '@/lib/whatsapp';

interface ProductDetailProps {
  slug: string;
  onBack: () => void;
  onOpenProduct: (slug: string) => void;
}

type MediaMode = 'photo' | 'video';

export default function ProductDetail({ slug, onBack, onOpenProduct }: ProductDetailProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);

  const [mode, setMode] = useState<MediaMode>('photo');
  const [activePhoto, setActivePhoto] = useState(0);
  const [videoPlaying, setVideoPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setProduct(null);
    setAddedToCart(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    (async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
      if (cancelled) return;
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      if (!data) {
        setError('Bridal suit not found.');
        setLoading(false);
        return;
      }
      const p = data as Product;
      setProduct(p);
      const { data: rel } = await supabase
        .from('products')
        .select('*')
        .neq('id', p.id)
        .order('sort_order', { ascending: true })
        .limit(2);
      if (!cancelled) setRelated((rel ?? []) as Product[]);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [slug]);

  useEffect(() => {
    setMode('photo');
    setActivePhoto(0);
    setVideoPlaying(true);
  }, [product?.id]);

  const toggleVideoPlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      void v.play();
      setVideoPlaying(true);
    } else {
      v.pause();
      setVideoPlaying(false);
    }
  };

  const switchMode = (next: MediaMode) => {
    setMode(next);
    if (next === 'video') {
      setVideoPlaying(true);
      requestAnimationFrame(() => {
        videoRef.current?.play().catch(() => setVideoPlaying(false));
      });
    } else {
      videoRef.current?.pause();
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-ink-500">
        <Loader2 size={28} className="animate-spin text-champagne-600 mb-4" />
        <p className="text-xs tracking-luxe uppercase font-light">Loading bridal suit…</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <AlertCircle size={28} className="text-wine-700 mb-4" />
        <p className="font-display text-3xl text-ink-800 mb-4">{error ?? 'Bridal suit not found'}</p>
        <button
          onClick={onBack}
          className="text-[11px] tracking-luxe uppercase text-champagne-700 hover:text-champagne-600"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  const Icon = collectionIcon(product.collection);
  const waUrl = buildWhatsAppUrl(
    productInquiryMessage({
      name: product.name,
      collectionLabel: product.collection_label,
      price: product.price,
    })
  );
  const gallery = product.gallery?.length ? product.gallery : [product.image];

  return (
    <div className="bg-ivory-100">
      <div className="border-b border-stone-200 bg-ivory-100/80 backdrop-blur-sm sticky top-[64px] md:top-[88px] z-30">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-[11px] tracking-luxe uppercase text-ink-600 hover:text-champagne-700 transition-colors"
          >
            <ArrowLeft size={15} />
            Back to Shop
          </button>
          <span className="text-[10px] tracking-luxe uppercase text-ink-500/60 hidden sm:block">
            {product.collection_label} / {product.name}
          </span>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-5 sm:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          {/* Media */}
          <div className="lg:sticky lg:top-36 lg:self-start">
            <div className="relative overflow-hidden rounded-sm bg-stone-100 aspect-[4/5] shadow-soft">
              <div
                className={[
                  'absolute inset-0 transition-opacity duration-500',
                  mode === 'photo' ? 'opacity-100' : 'opacity-0 pointer-events-none',
                ].join(' ')}
              >
                <img
                  src={gallery[activePhoto]}
                  alt={`${product.name} view ${activePhoto + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>

              <div
                className={[
                  'absolute inset-0 bg-ivory-100 transition-opacity duration-500',
                  mode === 'video' ? 'opacity-100' : 'opacity-0 pointer-events-none',
                ].join(' ')}
              >
                <video
                  ref={videoRef}
                  src={product.video_url}
                  className="h-full w-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  onPlay={() => setVideoPlaying(true)}
                  onPause={() => setVideoPlaying(false)}
                />
                {!videoPlaying && mode === 'video' && (
                  <button
                    onClick={toggleVideoPlay}
                    className="absolute inset-0 flex items-center justify-center bg-ivory-100/40"
                    aria-label="Play embroidery film"
                  >
                    <span className="flex h-16 w-16 items-center justify-center rounded-full border border-champagne-400/60 bg-ivory-100/15 backdrop-blur-sm">
                      <Play size={22} className="text-ink-900 ml-1" fill="currentColor" />
                    </span>
                  </button>
                )}
              </div>

              <div className="absolute top-3 right-3 flex gap-1.5 rounded-full bg-ivory-100/85 backdrop-blur-md border border-stone-300 p-1">
                <button
                  onClick={() => switchMode('photo')}
                  className={[
                    'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] tracking-luxe uppercase transition-all',
                    mode === 'photo'
                      ? 'bg-ivory-100 text-ink-900'
                      : 'text-ink-600 hover:text-ink-900',
                  ].join(' ')}
                >
                  <ImageIcon size={11} />
                  Photos
                </button>
                {product.video_url && (
                  <button
                    onClick={() => switchMode('video')}
                    className={[
                      'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] tracking-luxe uppercase transition-all',
                      mode === 'video'
                        ? 'bg-ivory-100 text-ink-900'
                        : 'text-ink-600 hover:text-ink-900',
                    ].join(' ')}
                  >
                    <Play size={11} fill="currentColor" />
                    Film
                  </button>
                )}
              </div>

              {mode === 'video' && (
                <div className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-ivory-100/70 backdrop-blur-md border border-champagne-400/30 px-3 py-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[10px] tracking-luxe uppercase text-ink-900/85">
                    Close-up Embroidery Film
                  </span>
                </div>
              )}
            </div>

            <div className="mt-4 grid grid-cols-4 gap-3">
              {gallery.map((g, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setActivePhoto(i);
                    switchMode('photo');
                  }}
                  className={[
                    'relative aspect-square overflow-hidden rounded-sm border transition-all bg-stone-100',
                    mode === 'photo' && activePhoto === i
                      ? 'border-champagne-500 ring-1 ring-champagne-500/40'
                      : 'border-stone-300 opacity-70 hover:opacity-100',
                  ].join(' ')}
                >
                  <img src={g} alt="" className="h-full w-full object-cover" loading="lazy" />
                </button>
              ))}
              {product.video_url && (
                <button
                  onClick={() => switchMode('video')}
                  className={[
                    'relative aspect-square overflow-hidden rounded-sm border flex items-center justify-center bg-ivory-100 transition-all',
                    mode === 'video'
                      ? 'border-champagne-500 ring-1 ring-champagne-500/40'
                      : 'border-stone-300 opacity-70 hover:opacity-100',
                  ].join(' ')}
                >
                  <Play size={16} className="text-champagne-300" fill="currentColor" />
                </button>
              )}
            </div>
          </div>

          {/* Info */}
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <Icon size={18} className="text-champagne-600" />
              <span className="text-[10px] tracking-luxe uppercase text-champagne-700/80 font-light">
                {product.collection_label} Collection
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-ink-900 leading-tight mb-3">
              {product.name}
            </h1>
            {product.tagline && (
              <p className="font-display italic text-xl text-champagne-700/80 mb-7">{product.tagline}</p>
            )}

            <div className="hairline w-full mb-7" />

            <div className="flex items-baseline gap-4 mb-8">
              <span className="font-display text-3xl text-gold-gradient">{product.price || '—'}</span>
              <span className="text-xs tracking-luxe uppercase text-ink-500 font-light">
                Indicative · Made to Order
              </span>
            </div>

            {product.description && (
              <p className="text-sm sm:text-base text-ink-700 font-light leading-relaxed mb-8">
                {product.description}
              </p>
            )}

            {/* Action buttons: Add to Cart + Order Now */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                className={[
                  'inline-flex items-center justify-center gap-3 rounded-full px-8 py-4 text-[12px] tracking-luxe uppercase font-semibold shadow-soft transition-all hover:scale-[1.02]',
                  addedToCart
                    ? 'bg-green-600 text-white'
                    : 'bg-ivory-100 hover:bg-ivory-200 text-ink-900',
                ].join(' ')}
              >
                <ShoppingCart size={18} />
                {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
              </button>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-[#25D366] hover:bg-[#1fb855] px-8 py-4 text-white text-[12px] tracking-luxe uppercase font-semibold shadow-soft transition-all hover:scale-[1.02]"
              >
                <MessageCircle size={18} />
                Order Now
              </a>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-20 sm:mt-28">
            <div className="flex items-end justify-between mb-8">
              <h3 className="font-display text-2xl sm:text-3xl text-ink-900">
                Also in the <span className="italic text-gold-gradient">Atelier</span>
              </h3>
              <button
                onClick={onBack}
                className="text-[11px] tracking-luxe uppercase text-champagne-700 hover:text-champagne-600 transition-colors"
              >
                View all
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {related.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onOpenProduct(p.slug)}
                  className="group relative overflow-hidden rounded-sm aspect-[16/11] text-left bg-stone-100"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1.4s] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ivory-100/85 via-ivory-100/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <span className="text-[10px] tracking-luxe uppercase text-champagne-300/90">
                      {p.collection_label}
                    </span>
                    <h4 className="font-display text-2xl text-ink-900">{p.name}</h4>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
