import { useCallback, useEffect, useMemo, useState } from 'react';
import AnnouncementBar from '@/components/AnnouncementBar';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import MarqueeStrip from '@/components/MarqueeStrip';
import AboutStrip from '@/components/AboutStrip';
import ShopView from '@/components/ShopView';
import ProductDetail from '@/components/ProductDetail';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import AdminPanel from '@/components/admin/AdminPanel';
import { useRevealOnScroll } from '@/lib/useReveal';
type Route =
  | { name: 'home' }
  | { name: 'shop'; collection?: string | 'all' }
  | { name: 'product'; slug: string }
  | { name: 'contact' }
  | { name: 'admin' };

type NavKey = 'home' | 'shop' | 'contact' | 'admin';

function parseRoute(): Route {
  // Check pathname first (e.g. /admin on Vercel), then fall back to hash.
  const path = window.location.pathname.replace(/^\/+/, '').trim();
  const hashRaw = window.location.hash.replace(/^#\/?/, '').trim();
  const source = path && path !== '/' ? path : hashRaw;
  if (!source) return { name: 'home' };

  const [segment, ...rest] = source.split('/');
  if (segment === 'admin') return { name: 'admin' };
  if (segment === 'contact') return { name: 'contact' };
  if (segment === 'shop') {
    const col = rest[0];
    if (col) {
      return { name: 'shop', collection: col };
    }
    return { name: 'shop', collection: 'all' };
  }
  if (segment === 'product' && rest[0]) {
    return { name: 'product', slug: decodeURIComponent(rest[0]) };
  }
  return { name: 'home' };
}

function routeToHash(route: Route): string {
  switch (route.name) {
    case 'home':
      return '#/';
    case 'shop':
      return route.collection && route.collection !== 'all'
        ? `#/shop/${route.collection}`
        : '#/shop';
    case 'product':
      return `#/product/${encodeURIComponent(route.slug)}`;
    case 'contact':
      return '#/contact';
    case 'admin':
      return '#/admin';
  }
}

export default function App() {
  const [route, setRoute] = useState<Route>(() => parseRoute());

  // Sync with hashchange (browser back/forward, manual URL entry).
  useEffect(() => {
    const onHash = () => setRoute(parseRoute());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Scroll to top on every route change.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [route]);

  useRevealOnScroll(route);

  const navigate = useCallback((next: Route) => {
    const hash = routeToHash(next);
    // Use hash routing for in-app navigation so it works on Vercel SPA.
    if (window.location.hash !== hash) {
      window.location.hash = hash;
    }
    setRoute(next);
  }, []);

  const handleNav = useCallback(
    (key: NavKey) => {
      if (key === 'home') navigate({ name: 'home' });
      else if (key === 'shop') navigate({ name: 'shop', collection: 'all' });
      else if (key === 'contact') navigate({ name: 'contact' });
      else if (key === 'admin') navigate({ name: 'admin' });
    },
    [navigate]
  );

  const openProduct = useCallback(
    (slug: string) => navigate({ name: 'product', slug }),
    [navigate]
  );

  const activeNav: string = useMemo(() => {
    if (route.name === 'admin') return 'admin';
    if (route.name === 'contact') return 'contact';
    if (route.name === 'shop') return 'shop';
    if (route.name === 'product') return 'shop';
    return 'home';
  }, [route]);

  const isAdmin = route.name === 'admin';

  return (
    <div className="min-h-screen bg-ivory-100 text-ink-800">
      {!isAdmin && <AnnouncementBar />}
      <Header onNavigate={handleNav} active={activeNav} />

      <main>
        {(() => {
          switch (route.name) {
            case 'home':
              return (
                <>
                  <Hero onExplore={() => navigate({ name: 'shop', collection: 'all' })} />
                  <MarqueeStrip />
                  <ShopView onOpenProduct={openProduct} compact />
                  <AboutStrip />
                  <Contact />
                </>
              );
            case 'shop':
              return (
                <ShopView
                  onOpenProduct={openProduct}
                  initialCollection={route.collection ?? 'all'}
                />
              );
            case 'product':
              return (
                <ProductDetail
                  slug={route.slug}
                  onBack={() => navigate({ name: 'shop', collection: 'all' })}
                  onOpenProduct={openProduct}
                />
              );
            case 'contact':
              return <Contact />;
            case 'admin':
              return <AdminPanel onExit={() => navigate({ name: 'home' })} />;
            default:
              return null;
          }
        })()}
      </main>

      {!isAdmin && <Footer onNavigate={handleNav} />}
      {!isAdmin && <FloatingWhatsApp />}
    </div>
  );
}
