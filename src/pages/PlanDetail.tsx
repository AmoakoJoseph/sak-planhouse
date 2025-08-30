import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Star, 
  Bed, 
  Bath, 
  Square, 
  Download, 
  Share2, 
  Heart,
  CheckCircle,
  Ruler,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import villaImage from '@/assets/villa-plan.jpg';
import bungalowImage from '@/assets/bungalow-plan.jpg';
import townhouseImage from '@/assets/townhouse-plan.jpg';

const PlanDetail = () => {
  const [selectedTier, setSelectedTier] = useState('standard');
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const { id } = useParams();
  const navigate = useNavigate();

  // All plans data - this should match the data from Plans.tsx
  const allPlans = [
    {
    id: 1,
    title: 'Luxury Villa Paradise',
    type: 'Villa',
    bedrooms: 5,
    bathrooms: 4,
    area: 3200,
    lotSize: '75x120 ft',
    stories: 2,
    garage: 2,
    rating: 4.9,
    reviews: 47,
    downloads: 234,
    architect: 'Samuel Kwame Architecture',
    description: 'This stunning luxury villa combines contemporary African design with modern amenities. Featuring an open-concept layout, high ceilings, and expansive windows that flood the interior with natural light. The design incorporates sustainable materials and energy-efficient systems.',
    features: [
      'Open-concept living and dining',
      'Master suite with walk-in closet',
      'Gourmet kitchen with island',
      'Covered outdoor patio',
      'Two-car garage',
      'Home office/study',
      'Guest bedroom suite',
      'Laundry room',
      'Storage areas',
      'Energy-efficient design'
    ],
    tiers: {
      basic: {
        price: 2500,
        name: 'Basic Package',
        description: 'Essential plans to get started',
        includes: [
          'Floor plans (PDF)',
          'Basic elevations',
          'Plot plan',
          'Material list'
        ]
      },
      standard: {
        price: 3200,
        name: 'Standard Package',
        description: 'Complete construction package',
        includes: [
          'Everything in Basic',
          'Detailed elevations',
          'Cross sections',
          'Construction details',
          'Electrical layout',
          'Plumbing layout',
          'CAD files (DWG)'
        ]
      },
      premium: {
        price: 4500,
        name: 'Premium Package',
        description: 'Professional complete package',
        includes: [
          'Everything in Standard',
          '3D renderings',
          'Interior layouts',
          'Landscape design',
          'Structural details',
          'HVAC layout',
          'Permit-ready drawings',
          '1 revision included'
        ]
      }
    },
    images: [villaImage, villaImage, villaImage, villaImage],
      image: villaImage,
      featured: true,
    },
    {
      id: 2,
      title: 'Executive Villa Estate',
      type: 'Villa',
      bedrooms: 6,
      bathrooms: 5,
      area: 4100,
      lotSize: '85x140 ft',
      stories: 2,
      garage: 3,
      rating: 4.9,
      reviews: 52,
      downloads: 298,
      architect: 'Samuel Kwame Architecture',
      description: 'An executive villa designed for luxury living with premium finishes and spacious rooms. Features include a grand entrance, formal dining room, and extensive outdoor living spaces.',
      features: [
        'Grand entrance with double-height foyer',
        'Formal living and dining rooms',
        'Master suite with spa bathroom',
        'Gourmet kitchen with butler\'s pantry',
        'Three-car garage',
        'Home theater',
        'Wine cellar',
        'Outdoor kitchen and pool',
        'Smart home technology',
        'Security system'
      ],
      tiers: {
        basic: { price: 3200, name: 'Basic Package', description: 'Essential plans to get started', includes: ['Floor plans (PDF)', 'Basic elevations', 'Plot plan', 'Material list'] },
        standard: { price: 4100, name: 'Standard Package', description: 'Complete construction package', includes: ['Everything in Basic', 'Detailed elevations', 'Cross sections', 'Construction details', 'Electrical layout', 'Plumbing layout', 'CAD files (DWG)'] },
        premium: { price: 5500, name: 'Premium Package', description: 'Professional complete package', includes: ['Everything in Standard', '3D renderings', 'Interior layouts', 'Landscape design', 'Structural details', 'HVAC layout', 'Permit-ready drawings', '1 revision included'] }
      },
      images: [villaImage, villaImage, villaImage, villaImage],
      image: villaImage,
      featured: false,
    },
    {
      id: 7,
      title: 'Modern Family Bungalow',
      type: 'Bungalow',
      bedrooms: 3,
      bathrooms: 2,
      area: 1800,
      lotSize: '60x80 ft',
      stories: 1,
      garage: 1,
      rating: 4.7,
      reviews: 34,
      downloads: 156,
      architect: 'Ama Osei Architecture',
      description: 'A modern family bungalow designed for comfort and functionality. Perfect for growing families with open living spaces and practical layouts.',
      features: [
        'Open-concept living area',
        'Modern kitchen with breakfast nook',
        'Three comfortable bedrooms',
        'Two full bathrooms',
        'Single-car garage',
        'Covered front porch',
        'Backyard patio',
        'Laundry room',
        'Storage spaces',
        'Energy-efficient windows'
      ],
      tiers: {
        basic: { price: 1800, name: 'Basic Package', description: 'Essential plans to get started', includes: ['Floor plans (PDF)', 'Basic elevations', 'Plot plan', 'Material list'] },
        standard: { price: 2300, name: 'Standard Package', description: 'Complete construction package', includes: ['Everything in Basic', 'Detailed elevations', 'Cross sections', 'Construction details', 'Electrical layout', 'Plumbing layout', 'CAD files (DWG)'] },
        premium: { price: 3100, name: 'Premium Package', description: 'Professional complete package', includes: ['Everything in Standard', '3D renderings', 'Interior layouts', 'Landscape design', 'Structural details', 'HVAC layout', 'Permit-ready drawings', '1 revision included'] }
      },
      images: [bungalowImage, bungalowImage, bungalowImage, bungalowImage],
      image: bungalowImage,
      featured: false,
    },
    {
      id: 13,
      title: 'Contemporary Townhouse',
      type: 'Townhouse',
      bedrooms: 4,
      bathrooms: 3,
      area: 2400,
      lotSize: '25x100 ft',
      stories: 3,
      garage: 1,
      rating: 4.8,
      reviews: 41,
      downloads: 189,
      architect: 'Kwame Asante Architecture',
      description: 'A contemporary townhouse designed for urban living with modern aesthetics and efficient use of space. Perfect for professionals and small families.',
      features: [
        'Three-story design',
        'Open-concept main floor',
        'Four bedrooms with ensuite',
        'Modern kitchen with island',
        'Single-car garage',
        'Private balcony',
        'Rooftop terrace',
        'Smart home features',
        'Energy-efficient design',
        'Modern finishes throughout'
      ],
      tiers: {
        basic: { price: 2200, name: 'Basic Package', description: 'Essential plans to get started', includes: ['Floor plans (PDF)', 'Basic elevations', 'Plot plan', 'Material list'] },
        standard: { price: 2800, name: 'Standard Package', description: 'Complete construction package', includes: ['Everything in Basic', 'Detailed elevations', 'Cross sections', 'Construction details', 'Electrical layout', 'Plumbing layout', 'CAD files (DWG)'] },
        premium: { price: 3800, name: 'Premium Package', description: 'Professional complete package', includes: ['Everything in Standard', '3D renderings', 'Interior layouts', 'Landscape design', 'Structural details', 'HVAC layout', 'Permit-ready drawings', '1 revision included'] }
      },
      images: [townhouseImage, townhouseImage, townhouseImage, townhouseImage],
      image: townhouseImage,
      featured: true,
    }
  ];

  useEffect(() => {
    if (id) {
      const foundPlan = allPlans.find(p => p.id === parseInt(id));
      if (foundPlan) {
        setPlan(foundPlan);
      } else {
        // Plan not found, redirect to plans page
        navigate('/plans');
      }
      setLoading(false);
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading plan details...</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Plan Not Found</h1>
          <p className="text-muted-foreground mb-6">The plan you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/plans">Back to Plans</Link>
          </Button>
        </div>
      </div>
    );
  }

  const similarPlans = allPlans
    .filter(p => p.id !== plan.id && p.type === plan.type)
    .slice(0, 3);

  const handleCheckout = () => {
    // You can customize this to integrate with your payment system
    // For now, we'll show an alert and could redirect to a checkout page
    const selectedPackage = plan.tiers[selectedTier as keyof typeof plan.tiers];
    const checkoutData = {
      planId: plan.id,
      planTitle: plan.title,
      package: selectedTier,
      packageName: selectedPackage.name,
      price: selectedPackage.price,
      architect: plan.architect
    };
    
    // Store checkout data in localStorage for the checkout page
    localStorage.setItem('checkoutData', JSON.stringify(checkoutData));
    
    // Navigate to checkout page (you'll need to create this)
    navigate('/checkout');
    
    // Alternative: Show a modal or alert for now
    // alert(`Proceeding to checkout for ${plan.title} - ${selectedPackage.name} (₵${selectedPackage.price})`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-construction-gray-light">
      {/* Header */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/plans">
                  <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Plans
            </Link>
              </Button>
              <Badge variant="secondary">{plan.type}</Badge>
              {plan.featured && (
                <Badge className="bg-primary text-primary-foreground">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
      </div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Plan Image */}
            <div className="space-y-4">
              <div className="relative h-96 rounded-2xl overflow-hidden">
                <img
                    src={plan.image}
                  alt={plan.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button variant="secondary" size="sm">
                      <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="secondary" size="sm">
                      <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
                {/* Additional Images */}
              <div className="grid grid-cols-4 gap-2">
                  {plan.images.slice(1).map((image: string, index: number) => (
                    <div key={index} className="h-20 rounded-lg overflow-hidden">
                    <img
                      src={image}
                      alt={`${plan.title} view ${index + 2}`}
                        className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

              {/* Plan Info */}
            <div className="space-y-6">
              <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {plan.title}
                </h1>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {plan.description}
                </p>
              </div>

                {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-card rounded-lg">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <Bed className="h-5 w-5 text-primary" />
                      <span className="text-2xl font-bold">{plan.bedrooms}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Bedrooms</div>
                  </div>
                  <div className="text-center p-4 bg-card rounded-lg">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <Bath className="h-5 w-5 text-primary" />
                      <span className="text-2xl font-bold">{plan.bathrooms}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Bathrooms</div>
                  </div>
                  <div className="text-center p-4 bg-card rounded-lg">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <Square className="h-5 w-5 text-primary" />
                      <span className="text-2xl font-bold">{plan.area}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Sq Ft</div>
                  </div>
                  <div className="text-center p-4 bg-card rounded-lg">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <Star className="h-5 w-5 text-primary fill-current" />
                      <span className="text-2xl font-bold">{plan.rating}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Rating</div>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                    <span>Lot Size: {plan.lotSize}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>Stories: {plan.stories}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4 text-muted-foreground" />
                    <span>{plan.downloads} downloads</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    <span>{plan.reviews} reviews</span>
                  </div>
              </div>

                {/* Architect */}
                <div className="p-4 bg-card rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Designed by</div>
                  <div className="font-semibold">{plan.architect}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plan Details */}
      <section className="py-16">
        <div className="container px-4">
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="overview" className="space-y-8">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="similar">Similar Plans</TabsTrigger>
                </TabsList>
                
              <TabsContent value="overview" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Plan Description</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {plan.description}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Key Specifications</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Area:</span>
                        <span className="font-medium">{plan.area} sq ft</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Lot Size:</span>
                        <span className="font-medium">{plan.lotSize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Stories:</span>
                        <span className="font-medium">{plan.stories}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Garage:</span>
                        <span className="font-medium">{plan.garage} car{plan.garage > 1 ? 's' : ''}</span>
                      </div>
                    </div>
                      </div>
                    </div>
              </TabsContent>

              <TabsContent value="features" className="space-y-6">
                <h3 className="text-xl font-semibold">Plan Features</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {plan.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                  </div>
                </TabsContent>

              <TabsContent value="pricing" className="space-y-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Choose Your Package</h3>
                    <p className="text-muted-foreground">
                      Select the package that best suits your needs. All packages include professional architectural plans.
                    </p>
          </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    {Object.entries(plan.tiers).map(([key, tier]: [string, any]) => (
                      <Card key={key} className={`relative ${selectedTier === key ? 'ring-2 ring-primary' : ''}`}>
                        {selectedTier === key && (
                          <div className="absolute -top-2 -right-2">
                            <Badge className="bg-primary text-primary-foreground">
                              Selected
                            </Badge>
                          </div>
                        )}
              <CardHeader>
                          <CardTitle className="text-lg">{tier.name}</CardTitle>
                          <CardDescription>{tier.description}</CardDescription>
                          <div className="text-2xl font-bold text-primary">₵{tier.price}</div>
              </CardHeader>
                        <CardContent>
                          <ul className="space-y-2 mb-6">
                            {tier.includes.map((item: string, index: number) => (
                              <li key={index} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                          <Button 
                            className="w-full" 
                            variant={selectedTier === key ? 'default' : 'outline'}
                      onClick={() => setSelectedTier(key)}
                    >
                            {selectedTier === key ? 'Selected' : 'Select Package'}
                          </Button>
                        </CardContent>
                      </Card>
                  ))}
                </div>

                <Separator />

                <div className="space-y-4">
                     <div className="flex items-center justify-between text-lg font-semibold">
                       <span>Total:</span>
                       <span className="text-primary">₵{plan.tiers[selectedTier as keyof typeof plan.tiers].price}</span>
                  </div>
                  
                     <Button className="w-full" size="lg" onClick={handleCheckout}>
                       Proceed to Checkout - ₵{plan.tiers[selectedTier as keyof typeof plan.tiers].price}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="similar" className="space-y-6">
                <h3 className="text-xl font-semibold">Similar {plan.type} Plans</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {similarPlans.map((similarPlan) => (
                    <Card key={similarPlan.id} className="group hover:shadow-construction transition-all duration-300">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={similarPlan.image}
                          alt={similarPlan.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <CardHeader>
                        <CardTitle className="text-lg">{similarPlan.title}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Bed className="h-4 w-4" />
                            {similarPlan.bedrooms}
                          </div>
                          <div className="flex items-center gap-1">
                            <Bath className="h-4 w-4" />
                            {similarPlan.bathrooms}
                          </div>
                          <div className="flex items-center gap-1">
                            <Square className="h-4 w-4" />
                            {similarPlan.area} sq ft
                    </div>
                  </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold text-primary">
                            ₵{similarPlan.tiers.basic.price}
                          </span>
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/plans/${similarPlan.id}`}>View Details</Link>
                          </Button>
                </div>
              </CardContent>
            </Card>
                  ))}
          </div>
              </TabsContent>
            </Tabs>
        </div>
      </div>
      </section>
    </div>
  );
};

export default PlanDetail;