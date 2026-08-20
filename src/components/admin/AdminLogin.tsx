import { useState } from 'react';
import { Lock, Mail, Loader2, ArrowLeft, MessageCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { BRAND } from '@/data/brand';
import { buildWhatsAppUrl, generalInquiryMessage } from '@/lib/whatsapp';

interface AdminLoginProps {
  onBack: () => void;
  onSuccess: () => void;
}

export default function AdminLogin({ onBack, onSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    onSuccess();
  };

  const waUrl = buildWhatsAppUrl(generalInquiryMessage('help accessing my admin panel'));

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-5 py-16 bg-ivory-100">
      <div className="w-full max-w-md">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-[11px] tracking-luxe uppercase text-ink-500 hover:text-champagne-700 transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          Back to store
        </button>

        <div className="bg-ivory-50 border border-stone-200 rounded-sm shadow-soft p-8 sm:p-10">
          <div className="flex flex-col items-center text-center mb-8">
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-champagne-500/40 text-champagne-600 mb-4">
              <Lock size={22} />
            </span>
            <h1 className="font-display text-3xl text-ink-900">Admin Panel</h1>
            <p className="text-[10px] tracking-luxe uppercase text-ink-500 font-light mt-2">
              {BRAND.name} · Bridal Catalog Manager
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] tracking-luxe uppercase text-champagne-700/80 font-light mb-2">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@abbridal.com"
                  className="w-full rounded-sm border border-stone-300 bg-ivory-100 pl-10 pr-4 py-3 text-sm text-ink-900 placeholder:text-ink-500/50 focus:border-champagne-500 focus:outline-none focus:ring-1 focus:ring-champagne-500/40 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] tracking-luxe uppercase text-champagne-700/80 font-light mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-sm border border-stone-300 bg-ivory-100 pl-10 pr-4 py-3 text-sm text-ink-900 placeholder:text-ink-500/50 focus:border-champagne-500 focus:outline-none focus:ring-1 focus:ring-champagne-500/40 transition-colors"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-wine-700 font-light bg-wine-900/5 border border-wine-700/20 rounded-sm px-4 py-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-ivory-100 hover:bg-ivory-200 disabled:opacity-60 px-6 py-3.5 text-ink-900 text-[11px] tracking-luxe uppercase font-light transition-colors"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={15} />}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="mt-7 pt-6 border-t border-stone-200 text-center">
            <p className="text-xs text-ink-500 font-light mb-3">
              Admin access is set up in your Supabase project under Authentication → Users.
            </p>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[10px] tracking-luxe uppercase text-[#1f8b4c] hover:text-[#176b3a] font-light transition-colors"
            >
              <MessageCircle size={13} />
              Need help? WhatsApp us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
