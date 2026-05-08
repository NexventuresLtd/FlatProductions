import React from 'react';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import About from './components/About';
import Services from './components/Services';
import Clients from './components/Clients';
import Team from './components/Team';
import Footer from './components/Footer';
import AboutPage from './components/aboutpage';
import GalleryPage from './components/gallerypage';
import PortfolioPage from './components/portfoliopage';
import ServicesPage from './components/servicespage';
import ContactPage from './components/contactpage';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

const App: React.FC = () => {
  const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
  const isAboutPage = currentPath === '/about';
  const isGalleryPage = currentPath === '/gallery';
  const isPortfolioPage = currentPath === '/portfolio';
  const isServicesPage = currentPath === '/services';
  const isContactPage = currentPath === '/contact';
  const isLoginPage = currentPath === '/login';
  const isAdminPage = currentPath === '/admin';

  if (isAboutPage) {
    return <AboutPage />;
  }

  if (isGalleryPage) {
    return <GalleryPage />;
  }

  if (isPortfolioPage) {
    return <PortfolioPage />;
  }

  if (isServicesPage) {
    return <ServicesPage />;
  }

  if (isContactPage) {
    return <ContactPage />;
  }

  if (isLoginPage) {
    return <AdminLogin />;
  }

  if (isAdminPage) {
    const authed = sessionStorage.getItem('flat_admin_auth') === '1';
    if (!authed) {
      window.location.pathname = '/login';
      return null;
    }
    return <AdminDashboard />;
  }

  return (
    <div className="app">
      <Hero />
      <Gallery />
      <About />
      <Services />
      <Clients />
      <Team />
      <Footer />
    </div>
  );
};

export default App;