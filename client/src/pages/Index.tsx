import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Star, 
  Download, 
  Users, 
  Building2, 
  Award,
  ArrowRight,
  CheckCircle,
  Heart,
  Mail,
  Phone,
  MapPin,
  Clock,
  Shield,
  Zap,
  Bed,
  Bath,
  Square
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import Hero from '@/components/Hero';
import PlanCategories from '@/components/PlanCategories';
import Features from '@/components/Features';

const Index = () => {
  const navigate = useNavigate();
  const [featuredPlans, setFeaturedPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetchFeaturedPlans();
  }, []);

  const fetchFeaturedPlans = async () => {
    try {
      const data = await api.getPlans({ status: 'active', featured: true });
      setFeaturedPlans(data?.slice(0, 6) || []);
    } catch (error) {
      console.error('Error fetching featured plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewsletterSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  const stats = [
    { icon: Building2, value: '500+', label: 'House Plans' },
    { icon: Users, value: '2,500+', label: 'Happy Customers' },
    { icon: Download, value: '15,000+', label: 'Downloads' },
    { icon: Award, value: '98%', label: 'Satisfaction Rate' }
  ];

  const testimonials = [
    {
      name: 'Kwame Asante',
      role: 'Property Developer',
      content: 'SAK Constructions provided excellent house plans that saved us time and money. The quality exceeded our expectations!',
      rating: 5,
      image: '/placeholder.svg'
    },
    {
      name: 'Ama Osei',
      role: 'Homeowner',
      content: 'I found my dream home plan here. The process was smooth and the support team was incredibly helpful throughout.',
      rating: 5,
      image: '/placeholder.svg'
    },
    {
      name: 'Kofi Mensah',
      role: 'Contractor',
      content: 'Professional plans that make construction smooth and efficient. Great platform for contractors like me.',
      rating: 5,
      image: '/placeholder.svg'
    }
  ];

  const recentNews = [
    {
      title: 'New Villa Collection Released',
      excerpt: 'Discover our latest luxury villa designs featuring modern amenities and sustainable building practices.',
      date: '2024-01-15',
      category: 'New Releases'
    },
    {
      title: 'Building Permit Guide 2024',
      excerpt: 'Everything you need to know about obtaining building permits in Ghana this year.',
      date: '2024-01-10',
      category: 'Guides'
    },
    {
      title: 'Sustainable Building Trends',
      excerpt: 'Explore the latest trends in eco-friendly construction and energy-efficient home design.',
      date: '2024-01-05',
      category: 'Trends'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <Hero />
      
      {/* Plan Categories */}
      <PlanCategories />
      
      {/* Features */}
      <Features />

      {/* Featured Plans Section */}
      <section className="py-20 bg-gradient-to-br from-muted/30 to-muted/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Featured Plans
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Most Popular House Plans
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our most sought-after designs, carefully crafted by leading architects
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-muted rounded-t-lg"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-3 bg-muted rounded mb-4"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPlans.map((plan) => (
                <Card key={plan.id} className="group hover:shadow-xl transition-all duration-300 cursor-pointer">
                  <div className="relative">
                    <img 
                      src={plan.image_url || '/placeholder.svg'} 
                      alt={plan.title}
                      className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                    />
                    {plan.featured && (
                      <Badge className="absolute top-4 right-4 bg-primary">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="capitalize">
                        {plan.plan_type}
                      </Badge>
                      <span className="text-2xl font-bold text-primary">
                        ₵{plan.basic_price?.toLocaleString()}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {plan.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {plan.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Bed className="w-4 h-4 mr-1" />
                          {plan.bedrooms} BR
                        </span>
                        <span className="flex items-center">
                          <Bath className="w-4 h-4 mr-1" />
                          {plan.bathrooms} BA
                        </span>
                        <span className="flex items-center">
                          <Square className="w-4 h-4 mr-1" />
                          {plan.area_sqft?.toLocaleString()} sq ft
                        </span>
                      </div>
                    </div>
                    <Button 
                      className="w-full group-hover:bg-primary transition-colors"
                      onClick={() => navigate(`/plans/${plan.id}`)}
                    >
                      View Details
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button 
              size="lg" 
              className="btn-primary"
              onClick={() => navigate('/plans')}
            >
              View All Plans
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform has helped countless families build their dream homes
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real stories from real customers who have built their dream homes with us
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-warning fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent News Section */}
      <section className="py-20 bg-gradient-to-br from-muted/30 to-muted/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Latest News & Insights
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Stay updated with the latest trends, tips, and industry insights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentNews.map((news, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="secondary" className="text-xs">
                      {news.category}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(news.date).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3 hover:text-primary transition-colors">
                    {news.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {news.excerpt}
                  </p>
                  <Button variant="ghost" className="p-0 h-auto text-primary hover:text-primary/80">
                    Read More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Stay Updated
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Get the latest house plan releases, construction tips, and exclusive offers delivered to your inbox
            </p>
            
            <form onSubmit={handleNewsletterSignup} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
                required
              />
              <Button type="submit" className="btn-primary">
                Subscribe
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
            
            <p className="text-sm text-muted-foreground mt-4">
              No spam, unsubscribe at any time. We respect your privacy.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
