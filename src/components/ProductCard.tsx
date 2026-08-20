import { Play, ArrowUpRight, MessageCircle } from 'lucide-react';
import { collectionIcon } from '@/data/brand';
import type { Product } from '@/lib/supabase';
import { buildWhatsAppUrl, productInquiryMessage } from '@/lib/whatsapp';

interface ProductCardProps {
  product: Product;
  onOpen: (slug: string) => void;
}

export default function ProductCard({ product, onOpen }: ProductCardProps) {
  const Icon = collectionIcon(product.collection);
  const waUrl = buildWhatsAppUrl(
    productInquiryMessage({
      name: product.name,
      collectionLabel: product.collection_label,
      price: product.price,
    })
  );

  return (
    <article className="group relative bg-ivory-50 rounded-sm overflow-hidden border border-stone-200 hover:border-champagne-400/60 transition-colors shadow-soft hover:shadow-lux flex flex-col">
      {/* Image */}
      <button
        onClick={() => onOpen(product.slug)}
        className="relative block w-full overflow-hidden aspect-[4/5] bg-stone-100"
        aria-label={`View ${product.name}`}
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/40 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />

        {/* Film badge */}
        {product.video_url && (
          <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-ivory-100/90 backdrop-blur-sm border border-champagne-400/40 px-2.5 py-1">
            <Play size={10} className="text-champagne-700" fill="currentColor" />
            <span className="text-[9px] tracking-luxe uppercase text-ink-700 font-light">Film</span>
          </div>
        )}

        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 text-[10px] tracking-luxe uppercase text-ivory-100 bg-ink-900/40 backdrop-blur-sm rounded-full px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-all">
          View
          <ArrowUpRight size={12} />
        </span>
      </button>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <Icon size={13} className="text-champagne-600" />
          <span className="text-[9px] tracking-luxe uppercase text-champagne-700/80 font-light">
            {product.collection_label}
          </span>
        </div>

        <button onClick={() => onOpen(product.slug)} className="text-left">
          <h3 className="font-display text-2xl text-ink-900 leading-tight hover:text-champagne-700 transition-colors">
            {product.name}
          </h3>
        </button>
        {product.tagline && (
          <p className="font-display italic text-base text-champagne-700/80 mt-1">{product.tagline}</p>
        )}

        <p className="mt-3 text-[13px] text-ink-600 font-light leading-relaxed line-clamp-2">
          {product.description}
        </p>

        <div className="mt-auto pt-5 flex items-center justify-between gap-3">
          <span className="font-display text-xl text-gold-gradient">{product.price || '—'}</span>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366]/12 border border-[#25D366]/40 hover:bg-[#25D366]/22 px-3 py-1.5 text-[10px] tracking-luxe uppercase text-[#1f8b4c] font-light transition-colors"
          >
            <MessageCircle size={12} />
            Inquire
          </a>
        </div>
      </div>
    </article>
  );
}
