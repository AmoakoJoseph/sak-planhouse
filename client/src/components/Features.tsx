import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Shield, Clock, Users, Palette, FileText } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Download,
      title: 'Instant Downloads',
      description: 'Get immediate access to your purchased plans in multiple formats including PDF, DWG, and CAD files.',
      highlight: 'Immediate Access',
    },
    {
      icon: Shield,
      title: 'Quality Guaranteed',
      description: 'All plans are designed by licensed architects and comply with local building codes and regulations.',
      highlight: 'Licensed Architects',
    },
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Browse and purchase plans anytime, anywhere. Our platform is always available when you need it.',
      highlight: 'Always Open',
    },
    {
      icon: Users,
      title: 'Expert Support',
      description: 'Get professional assistance from our team of architects and construction experts.',
      highlight: 'Professional Help',
    },
    {
      icon: Palette,
      title: 'Customization Options',
      description: 'Most plans can be modified to suit your specific needs and preferences.',
      highlight: 'Flexible Designs',
    },
    {
      icon: FileText,
      title: 'Complete Documentation',
      description: 'Detailed floor plans, elevations, sections, and construction details included.',
      highlight: 'Full Package',
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="secondary" className="mb-4">
            Why Choose Us
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Professional
                            <span className="bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent"> Construction Solutions</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            We provide comprehensive architectural services that make building your dream home 
            simple, affordable, and stress-free.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              className="group hover:shadow-construction transition-all duration-300 transform hover:-translate-y-1 border-0 bg-gradient-card"
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-construction-orange-light rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                
                <Badge variant="outline" className="w-fit mx-auto mb-2 text-xs">
                  {feature.highlight}
                </Badge>
                
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="text-center">
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 bg-primary rounded-full border-2 border-background flex items-center justify-center text-xs text-primary-foreground font-semibold">
                  {i}
                </div>
              ))}
            </div>
            <span>Join 2000+ satisfied customers who trust our plans</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;