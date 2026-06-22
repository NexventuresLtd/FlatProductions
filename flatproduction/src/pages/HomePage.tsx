import React from 'react';
import Hero from '../components/Hero';
import Gallery from '../components/Gallery';
import About from '../components/About';
import Services from '../components/Services';
import Clients from '../components/Clients';
import Team from '../components/Team';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <About />
      <Services />
      <Clients />
      <Team />
      <Footer />
    </div>
  );
};

export default HomePage;