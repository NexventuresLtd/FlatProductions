import React from 'react';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import GalleryPage from './pages/GalleryPage';
import PortfolioPage from './pages/PortfolioPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

const AdminBar: React.FC = () => {
  const authed = sessionStorage.getItem('flat_admin_auth') === '1';
  if (!authed) return null;
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
      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 28px rgba(0,0,0,0.45)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = ''; (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.35)'; }}
    >
      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
      Dashboard
    </a>
  );
};

const App: React.FC = () => {
  const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
  const isAdminRoute = currentPath === '/admin' || currentPath === '/login';

  if (currentPath === '/about') return <><AboutPage /><AdminBar /></>;
  if (currentPath === '/gallery') return <><GalleryPage /><AdminBar /></>;
  if (currentPath === '/portfolio') return <><PortfolioPage /><AdminBar /></>;
  if (currentPath === '/services') return <><ServicesPage /><AdminBar /></>;
  if (currentPath === '/contact') return <><ContactPage /><AdminBar /></>;
  if (currentPath === '/login') return <AdminLogin />;

  if (currentPath === '/admin') {
    const authed = sessionStorage.getItem('flat_admin_auth') === '1';
    if (!authed) {
      window.location.pathname = '/login';
      return null;
    }
    return <AdminDashboard />;
  }

  return <><HomePage />{!isAdminRoute && <AdminBar />}</>;
};

export default App;