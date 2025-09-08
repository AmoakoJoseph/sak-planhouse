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
  Square,
  FileText,
  CreditCard
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import Hero from '@/components/Hero';
import PlanCard from '@/components/PlanCard';
// Removed PlanCategories per request
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
      const data = await api.getPlans({ status: 'active' });
      // Filter featured plans on the client side and take first 6
      const featured = data?.filter(plan => plan.featured).slice(0, 6) || [];
      setFeaturedPlans(featured);
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
      
      
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Plans
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
                <PlanCard 
                  key={plan.id} 
                  plan={plan} 
                  showFavorites={false}
                />
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

      {/* How It Works Section (comes after Featured Plans) */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get your building plans in four simple steps. Our streamlined process makes it easy
              to find and purchase the perfect design.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-500/10 flex items-center justify-center">
                <FileText className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="font-semibold mb-2">Browse Plans</h3>
              <p className="text-sm text-muted-foreground">
                Explore our extensive collection of building plans designed for various needs and preferences.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-500/10 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="font-semibold mb-2">Choose Tier</h3>
              <p className="text-sm text-muted-foreground">
                Select from Basic, Standard, or Premium packages based on your project requirements.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-500/10 flex items-center justify-center">
                <CreditCard className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="font-semibold mb-2">Pay Securely</h3>
              <p className="text-sm text-muted-foreground">
                Complete your purchase with our secure payment system and instant confirmation.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-500/10 flex items-center justify-center">
                <Download className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="font-semibold mb-2">Receive Files</h3>
              <p className="text-sm text-muted-foreground">
                Download your plans immediately and start building your dream home.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features */}
      <Features />

      {/* Featured Plans Section (duplicate removed by moving above) */}
      {/* section removed */}

      {/* Statistics Section - removed per request */}

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
                    <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
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

      {/* How It Works Section moved above */}

      {/* Newsletter Section */}
      <section className="py-20 bg-orange-500/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
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
