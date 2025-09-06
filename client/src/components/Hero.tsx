import { Button } from '@/components/ui/button';
import { Search, Play, ArrowRight, Star, Shield, Award, Users } from 'lucide-react';
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
      <main className="py-16">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">

          {/* Left Content */}
          <div>
            {/* Premium Badge */}
            <span className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-orange-50 text-slate-700 ring-1 ring-slate-200">
              Premium • Professional • Trusted
            </span>

            {/* Main Heading */}
            <h1 className="mt-4 text-4xl md:text-5xl font-extrabold leading-tight text-slate-900">
              Building spaces that last. Delivering projects that perform.
            </h1>

            {/* Subheading */}
            <p className="mt-4 text-slate-600 max-w-xl">
              From concept design to handover, SAK PlanHouse provides architecture, construction, and project management services with uncompromising quality and transparency.
            </p>

            {/* CTA Buttons */}
            <div className="mt-6 flex gap-3">
              <Button 
                size="lg" 
                className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold bg-orange-600 text-white hover:bg-orange-700"
                asChild
              >
                <a href="/plans">
                  View Plans
                </a>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold bg-white text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50"
                onClick={handleAuthClick}
              >
                Get Started Free
              </Button>
            </div>

            {/* Trust Indicators */}
            <ul className="mt-6 grid grid-cols-2 gap-3 text-sm text-slate-600 max-w-md">
              <li className="flex items-center gap-2">Transparent fees</li>
              <li className="flex items-center gap-2">On-time delivery</li>
              <li className="flex items-center gap-2">Professional quality</li>
              <li className="flex items-center gap-2">End-to-end service</li>
            </ul>

          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="aspect-[4/3] w-full rounded-3xl bg-gradient-to-br from-orange-600 to-amber-500 shadow-2xl overflow-hidden">
              <img
                src={heroImage}
                alt="Construction Plans and Blueprints"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-40 h-40 rounded-2xl bg-white shadow-xl grid place-items-center border border-slate-100">
              <div className="text-slate-500 text-center text-xs px-3">
                Smart Modular plans
              </div>
            </div>
          </div>
        </div>
      </main>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
};

export default Hero;