import React, { useEffect } from 'react';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import GalleryPage from './pages/GalleryPage';
import PortfolioPage from './pages/PortfolioPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { apiPost, AUTH_TOKEN_KEY } from './lib/apiClient';

const AUTH_KEY = AUTH_TOKEN_KEY;
const AUTH_CHANNEL = 'flat_auth_sync';

/* Decodes a JWT's payload without verifying the signature — good enough for
   a client-side "is this token still fresh" check; the server re-verifies
   the signature on every request regardless. */
function decodeJwtExp(token: string): number | null {
  try {
    const payload = token.split('.')[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const parsed = JSON.parse(json) as { exp?: number };
    return typeof parsed.exp === 'number' ? parsed.exp : null;
  } catch {
    return null;
  }
}

/* ── Session helpers ─────────────────────────────────────────────── */
export function isAdminAuthed(): boolean {
  // Self-heal: a brand-new tab has no sessionStorage entry yet (that only
  // gets copied in by the syncAuthToTab() useEffect, which runs *after*
  // this synchronous check on first render) — so fall back to inheriting
  // straight from localStorage here rather than bouncing to /login first.
  let tok = sessionStorage.getItem(AUTH_KEY);
  if (!tok) {
    const lsTok = localStorage.getItem(AUTH_KEY);
    if (lsTok) {
      sessionStorage.setItem(AUTH_KEY, lsTok);
      tok = lsTok;
    }
  }
  if (!tok || tok !== localStorage.getItem(AUTH_KEY)) return false;
  const exp = decodeJwtExp(tok);
  if (exp !== null && Date.now() >= exp * 1000) return false;
  return true;
}

/* Copy the shared localStorage token into this tab's sessionStorage.
   Called on mount so every new tab inherits the current auth state. */
export function syncAuthToTab(): void {
  const lsTok = localStorage.getItem(AUTH_KEY);
  if (lsTok) {
    sessionStorage.setItem(AUTH_KEY, lsTok);
  } else {
    sessionStorage.removeItem(AUTH_KEY);
  }
}

/* Broadcast-channel singleton — used for same-browser cross-tab signalling */
let _authChannel: BroadcastChannel | null = null;
function getAuthChannel(): BroadcastChannel | null {
  if (typeof BroadcastChannel === 'undefined') return null;
  if (!_authChannel) _authChannel = new BroadcastChannel(AUTH_CHANNEL);
  return _authChannel;
}

export function broadcastLogout(): void {
  localStorage.removeItem(AUTH_KEY);
  sessionStorage.removeItem(AUTH_KEY);
  getAuthChannel()?.postMessage({ type: 'logout' });
}

/* ── Visit counter (incremented on every public page load) ───────── */
function trackVisit() {
  const n = parseInt(localStorage.getItem('flat_visit_count') || '0', 10) + 1;
  localStorage.setItem('flat_visit_count', String(n));
  apiPost('/api/visits').catch(() => { /* best-effort; local fallback above already recorded */ });
}

/* ── Floating admin bar shown on public pages when logged in ─────── */
const AdminBar: React.FC = () => {
  if (!isAdminAuthed()) return null;
  return (
    <a
      href="/admin"
      style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: '#111', color: '#fff', padding: '10px 18px',
        borderRadius: 100, fontSize: 13, fontWeight: 700,
        textDecoration: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
        transition: 'all 0.2s', fontFamily: 'inherit',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 28px rgba(0,0,0,0.45)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLAnchorElement).style.transform = '';
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.35)';
      }}
    >
      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
        <rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/>
        <rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>
      </svg>
      Dashboard
    </a>
  );
};

const App: React.FC = () => {
  const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
  const isAdminRoute = currentPath === '/admin' || currentPath === '/login';

  useEffect(() => {
    if (!isAdminRoute) trackVisit();
  }, [isAdminRoute]);

  /* On mount: inherit auth state from any already-logged-in tab */
  useEffect(() => {
    syncAuthToTab();
  }, []);

  /* Cross-tab auth sync: keep all tabs in the same browser consistent */
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== AUTH_KEY) return;
      if (!e.newValue) {
        // Token removed in another tab → log out this tab too
        sessionStorage.removeItem(AUTH_KEY);
        if (window.location.pathname === '/admin') {
          window.location.pathname = '/login';
        }
      } else {
        // Token set/updated in another tab → sync to this tab
        sessionStorage.setItem(AUTH_KEY, e.newValue);
      }
    };

    const channel = getAuthChannel();
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'logout') {
        sessionStorage.removeItem(AUTH_KEY);
        if (window.location.pathname === '/admin') {
          window.location.pathname = '/login';
        }
      }
    };

    window.addEventListener('storage', handleStorage);
    channel?.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      channel?.removeEventListener('message', handleMessage);
    };
  }, []);

  /* bfcache fix: when browser restores page from back/forward cache,
     React state may be stale. Force a reload so localStorage is re-read. */
  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) window.location.reload();
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  if (currentPath === '/about')     return <><AboutPage /><AdminBar /></>;
  if (currentPath === '/gallery')   return <><GalleryPage /><AdminBar /></>;
  if (currentPath === '/portfolio') return <><PortfolioPage /><AdminBar /></>;
  if (currentPath === '/services')  return <><ServicesPage /><AdminBar /></>;
  if (currentPath === '/contact')   return <><ContactPage /><AdminBar /></>;
  if (currentPath === '/login') {
    if (isAdminAuthed()) {
      window.location.pathname = '/admin';
      return null;
    }
    return <AdminLogin />;
  }

  if (currentPath === '/admin') {
    if (!isAdminAuthed()) {
      window.location.pathname = '/login';
      return null;
    }
    return <AdminDashboard />;
  }

  return <><HomePage />{!isAdminRoute && <AdminBar />}</>;
};

export default App;
