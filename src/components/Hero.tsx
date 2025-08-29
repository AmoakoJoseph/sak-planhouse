import { Button } from '@/components/ui/button';
import { Search, Play, ArrowRight } from 'lucide-react';
import heroImage from '@/assets/hero-construction.jpg';

const Hero = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Construction Plans and Blueprints"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-construction-orange-light border border-primary/20">
            <span className="text-sm font-medium text-primary">Ghana's #1 Construction Plans Platform</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
            Premium
            <span className="bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent"> Construction Plans </span>
            for Your Dream Home
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover professionally designed architectural plans for villas, bungalows, and townhouses. 
            Built by experts, trusted by professionals.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 py-6">
            {[
              { number: '500+', label: 'House Plans' },
              { number: '2000+', label: 'Happy Customers' },
              { number: '100%', label: 'Satisfaction' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="hero" size="lg" className="min-w-[200px]" asChild>
              <a href="/plans">
                <Search className="h-5 w-5" />
                Browse Plans
                <ArrowRight className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="outline" size="lg" className="min-w-[200px]">
              <Play className="h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="pt-8">
            <p className="text-sm text-muted-foreground mb-4">Trusted by Ghana's leading contractors</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {/* Trust badges would go here */}
              <div className="h-8 w-24 bg-muted rounded flex items-center justify-center text-xs font-medium">
                Certified
              </div>
              <div className="h-8 w-24 bg-muted rounded flex items-center justify-center text-xs font-medium">
                Professional
              </div>
              <div className="h-8 w-24 bg-muted rounded flex items-center justify-center text-xs font-medium">
                Quality
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl animate-pulse" />
    </section>
  );
};

export default Hero;