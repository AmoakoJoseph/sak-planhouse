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
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Enhanced Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Construction Plans and Blueprints"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/80 to-primary/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-transparent" />
        </div>

        {/* Floating Geometric Elements */}
        <div className="absolute inset-0 z-5 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-xl float"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-lg float" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-40 left-20 w-20 h-20 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-full blur-lg float" style={{animationDelay: '4s'}}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 container px-4 py-20">
          <div className="max-w-5xl mx-auto text-center space-y-10">
            {/* Premium Badge */}
            <div className="inline-flex items-center px-6 py-3 rounded-full glass border border-primary/30 shadow-construction">
              <Star className="w-5 h-5 text-primary mr-2" />
              <span className="text-sm font-semibold text-primary">Ghana's #1 Construction Plans Platform</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground leading-tight">
                Premium
                <span className="block gradient-text"> Construction Plans </span>
                <span className="text-4xl md:text-5xl lg:text-6xl text-muted-foreground font-normal">
                  for Your Dream Home
                </span>
              </h1>
            </div>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover professionally designed architectural plans for villas, bungalows, and townhouses. 
              Built by experts, trusted by professionals across Ghana.
            </p>

            {/* Enhanced Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
              {[
                { number: '50+', label: 'House Plans', icon: '🏠', color: 'from-primary to-primary' },
                { number: '2500+', label: 'Happy Customers', icon: '😊', color: 'from-secondary to-secondary-foreground' },
                { number: '100%', label: 'Satisfaction', icon: '⭐', color: 'from-accent to-accent-foreground' },
              ].map((stat, index) => (
                <div key={stat.label} className="group">
                  <div className={`bg-gradient-to-br ${stat.color} p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105`}>
                    <div className="text-4xl mb-2">{stat.icon}</div>
                    <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.number}</div>
                    <div className="text-sm text-white/90 font-medium">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                size="lg" 
                className="btn-primary text-lg px-10 py-4"
                asChild
              >
                <a href="/plans" className="flex items-center gap-2">
                  Browse Plans
                  <ArrowRight className="w-5 h-5" />
                </a>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="btn-outline-modern text-lg px-10 py-4"
                onClick={handleAuthClick}
              >
                Get Started Free
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-12">
              <p className="text-sm text-muted-foreground mb-6">Trusted by Ghana's leading contractors & architects</p>
              <div className="flex flex-wrap justify-center items-center gap-6">
                {[
                  { label: 'Certified', icon: Shield, color: 'text-success' },
                  { label: 'Professional', icon: Award, color: 'text-warning' },
                  { label: 'Quality', icon: Star, color: 'text-primary' },
                  { label: 'Trusted', icon: Users, color: 'text-secondary' },
                ].map((badge) => (
                  <div key={badge.label} className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50">
                    <badge.icon className={`w-4 h-4 ${badge.color}`} />
                    <span className="text-sm font-medium text-muted-foreground">{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto pt-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search for plans, architects, or locations..."
                  className="w-full pl-12 pr-4 py-4 bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-foreground placeholder:text-muted-foreground"
                />
                <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2">
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex flex-col items-center space-y-2">
            <span className="text-sm text-muted-foreground">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-bounce"></div>
            </div>
          </div>
        </div>
      </section>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
};

export default Hero;