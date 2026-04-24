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
  const isAboutPage = window.location.pathname === '/about';
  const isGalleryPage = window.location.pathname === '/gallery';
  const isPortfolioPage = window.location.pathname === '/portfolio';
  const isContactPage = window.location.pathname === '/contact';

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