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
import { useState } from 'react';
import { Link } from 'react-router-dom';
import villaImage from '@/assets/villa-plan.jpg';

const PlanDetail = () => {
  const [selectedTier, setSelectedTier] = useState('standard');
  const [quantity, setQuantity] = useState(1);

  const plan = {
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
    similarPlans: [
      { id: 2, title: 'Executive Villa Estate', price: 3200, image: villaImage },
      { id: 3, title: 'Modern Family Villa', price: 2800, image: villaImage },
      { id: 4, title: 'Contemporary Villa Design', price: 3500, image: villaImage },
    ]
  };

  const currentTier = plan.tiers[selectedTier as keyof typeof plan.tiers];

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="container px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/plans" className="flex items-center gap-2 hover:text-primary transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Plans
            </Link>
            <span>/</span>
            <span>{plan.type}</span>
            <span>/</span>
            <span className="text-foreground">{plan.title}</span>
          </div>
        </div>
      </div>

      <div className="container px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative h-96 rounded-2xl overflow-hidden">
                <img
                  src={plan.images[0]}
                  alt={plan.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button variant="secondary" size="sm">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="secondary" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                {plan.images.slice(1).map((image, index) => (
                  <div key={index} className="h-20 rounded-lg overflow-hidden bg-muted">
                    <img
                      src={image}
                      alt={`${plan.title} view ${index + 2}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Plan Details */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{plan.type}</Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 fill-current text-yellow-500" />
                    {plan.rating} ({plan.reviews} reviews)
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Download className="h-4 w-4" />
                    {plan.downloads} downloads
                  </div>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {plan.title}
                </h1>
                <p className="text-muted-foreground">
                  Designed by {plan.architect}
                </p>
              </div>

              {/* Quick Specs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Bed, label: 'Bedrooms', value: plan.bedrooms },
                  { icon: Bath, label: 'Bathrooms', value: plan.bathrooms },
                  { icon: Square, label: 'Sq Feet', value: plan.area.toLocaleString() },
                  { icon: Ruler, label: 'Lot Size', value: plan.lotSize },
                ].map((spec) => (
                  <Card key={spec.label} className="text-center p-4">
                    <spec.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="text-sm text-muted-foreground">{spec.label}</div>
                    <div className="font-semibold">{spec.value}</div>
                  </Card>
                ))}
              </div>

              {/* Tabs Content */}
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                  <TabsTrigger value="specifications">Specs</TabsTrigger>
                </TabsList>
                
                <TabsContent value="description" className="space-y-4">
                  <div className="prose prose-gray max-w-none">
                    <p className="text-muted-foreground leading-relaxed">
                      {plan.description}
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="features" className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="specifications" className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Area:</span>
                        <span className="font-medium">{plan.area} sq ft</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Stories:</span>
                        <span className="font-medium">{plan.stories}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Garage:</span>
                        <span className="font-medium">{plan.garage} cars</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Lot Size:</span>
                        <span className="font-medium">{plan.lotSize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Style:</span>
                        <span className="font-medium">Contemporary</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Foundation:</span>
                        <span className="font-medium">Concrete Slab</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Sidebar - Purchase Options */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Choose Your Package</CardTitle>
                <CardDescription>
                  Select the package that best fits your needs
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Tier Selection */}
                <div className="space-y-3">
                  {Object.entries(plan.tiers).map(([key, tier]) => (
                    <div
                      key={key}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedTier === key
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedTier(key)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{tier.name}</h4>
                        <span className="text-lg font-bold text-primary">
                          ₵{tier.price.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {tier.description}
                      </p>
                      <div className="space-y-1">
                        {tier.includes.slice(0, 3).map((item, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs">
                            <CheckCircle className="h-3 w-3 text-primary" />
                            <span>{item}</span>
                          </div>
                        ))}
                        {tier.includes.length > 3 && (
                          <div className="text-xs text-muted-foreground">
                            +{tier.includes.length - 3} more items
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Package Details */}
                <div className="space-y-3">
                  <h4 className="font-semibold">What's Included:</h4>
                  <div className="space-y-2">
                    {currentTier.includes.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Total and Purchase */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-2xl font-bold text-primary">
                      ₵{currentTier.price.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <Button className="w-full" size="lg">
                      Add to Cart
                    </Button>
                    <Button variant="cta" className="w-full" size="lg">
                      Buy Now
                    </Button>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Instant download after purchase
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Similar Plans */}
            <Card>
              <CardHeader>
                <CardTitle>Similar Plans</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {plan.similarPlans.map((similar) => (
                  <div key={similar.id} className="flex gap-3">
                    <img
                      src={similar.image}
                      alt={similar.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h5 className="font-medium text-sm">{similar.title}</h5>
                      <p className="text-xs text-muted-foreground">
                        From ₵{similar.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanDetail;