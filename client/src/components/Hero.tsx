import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import heroImage from '@/assets/hero-construction.jpg';
import AuthModal from './AuthModal';

const Hero = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleAuthClick = () => {
    setAuthModalOpen(true);
  };

  return (
    <>
      <section className="relative h-[78vh] md:h-[86vh] w-full overflow-hidden">
        {/* Background image */}
        <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&h=1080&fit=crop" alt="SAK hero" className="absolute inset-0 w-full h-full object-cover" />
        {/* Overlay */}
        <div className="absolute inset-0 bg-orange-600/80" />

        {/* Content */}
        <div className="relative z-10 h-full max-w-5xl mx-auto px-4 flex flex-col items-center justify-center text-center text-white">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Smart Modular Designs for
            <br />
            <span className="mt-2 inline-block">Smart Plots</span>
          </h1>
          <p className="mt-4 max-w-3xl text-base md:text-lg text-white/90">
            Discover premium building plans for homeowners and developers. From cozy cottages to luxury villas,
            we have the perfect design for your project.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
            <Button size="lg" className="px-6 py-6 rounded-xl bg-white text-orange-700 hover:bg-white/90" asChild>
              <a href="/plans" className="inline-flex items-center gap-2">
                Browse Plans
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="px-6 py-6 rounded-xl bg-transparent text-white border-white/70 hover:bg-white/10" onClick={handleAuthClick}>
              Learn More
            </Button>
          </div>
        </div>
      </section>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
};

export default Hero;