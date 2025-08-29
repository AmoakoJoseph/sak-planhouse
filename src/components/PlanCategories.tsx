import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Bed, Bath, Square, Star } from 'lucide-react';
import villaImage from '@/assets/villa-plan.jpg';
import bungalowImage from '@/assets/bungalow-plan.jpg';
import townhouseImage from '@/assets/townhouse-plan.jpg';

const PlanCategories = () => {
  const categories = [
    {
      title: 'Luxury Villas',
      description: 'Spacious multi-story homes with premium features',
      image: villaImage,
      plans: 150,
      startingPrice: '₵2,500',
      features: ['4-6 Bedrooms', '3-5 Bathrooms', '2500-4000 sq ft'],
      popular: true,
    },
    {
      title: 'Modern Bungalows',
      description: 'Single-story comfort with contemporary design',
      image: bungalowImage,
      plans: 180,
      startingPrice: '₵1,800',
      features: ['2-4 Bedrooms', '2-3 Bathrooms', '1200-2500 sq ft'],
      popular: false,
    },
    {
      title: 'Stylish Townhouses',
      description: 'Multi-level urban living solutions',
      image: townhouseImage,
      plans: 120,
      startingPrice: '₵2,200',
      features: ['3-4 Bedrooms', '2-4 Bathrooms', '1800-3000 sq ft'],
      popular: false,
    },
  ];

  const features = [
    {
      icon: Bed,
      title: 'Flexible Layouts',
      description: 'From cozy 2-bedroom homes to spacious 6-bedroom estates',
    },
    {
      icon: Bath,
      title: 'Modern Amenities',
      description: 'Contemporary bathrooms, kitchens, and living spaces',
    },
    {
      icon: Square,
      title: 'Various Sizes',
      description: 'Plans ranging from 1,200 to 4,000+ square feet',
    },
    {
      icon: Star,
      title: 'Premium Quality',
      description: 'Professionally designed by licensed architects',
    },
  ];

  return (
    <section id="browse" className="py-20 bg-gradient-to-b from-background to-construction-gray-light">
      <div className="container px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="secondary" className="mb-4">
            Popular Categories
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Choose Your Perfect
            <span className="bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent"> Home Design</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Explore our extensive collection of professionally designed house plans, 
            each crafted to meet modern living standards and local building requirements.
          </p>
        </div>

        {/* Plan Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {categories.map((category) => (
            <Card key={category.title} className="group hover:shadow-construction transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border-0 bg-gradient-card">
              {category.popular && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-primary text-primary-foreground">
                    <Star className="h-3 w-3 mr-1" />
                    Popular
                  </Badge>
                </div>
              )}
              
              <div className="relative h-48 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="text-sm font-medium">{category.plans} Plans Available</div>
                  <div className="text-xs opacity-90">Starting from {category.startingPrice}</div>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-xl">{category.title}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {category.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-2">
                    {category.features.map((feature) => (
                      <div key={feature} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                    Browse {category.title}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-construction-orange-light rounded-2xl flex items-center justify-center">
                <feature.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlanCategories;