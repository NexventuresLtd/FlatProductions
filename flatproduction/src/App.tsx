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
import ContactPage from './components/contactpage';

const App: React.FC = () => {
  const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
  const isAboutPage = currentPath === '/about';
  const isGalleryPage = currentPath === '/gallery';
  const isPortfolioPage = currentPath === '/portfolio';
  const isContactPage = currentPath === '/contact';

  if (isAboutPage) {
    return <AboutPage />;
  }

  if (isGalleryPage) {
    return <GalleryPage />;
  }

  if (isPortfolioPage) {
    return <PortfolioPage />;
  }

  if (isContactPage) {
    return <ContactPage />;
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