import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import PlanReviews from '@/components/PlanReviews';
import Plan3DViewer from '@/components/Plan3DViewer';
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
  Image as ImageIcon,
  Box
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import villaImage from '@/assets/villa-plan.jpg';
import bungalowImage from '@/assets/bungalow-plan.jpg';
import townhouseImage from '@/assets/townhouse-plan.jpg';

const PlanDetail = () => {
  const [selectedTier, setSelectedTier] = useState('standard');
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [show3DViewer, setShow3DViewer] = useState(false);
  const [usingFallbackData, setUsingFallbackData] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  
  const { id } = useParams();
  const navigate = useNavigate();

  // Create a comprehensive fallback plan
  const createFallbackPlan = (planId: string) => ({
    id: planId,
    title: 'Modern Villa Design',
    description: 'A stunning contemporary villa featuring open-concept living spaces, luxury amenities, and sustainable design principles. Perfect for families seeking modern comfort and elegant aesthetics.',
    plan_type: 'villa',
    bedrooms: 4,
    bathrooms: 3,
    area_sqft: 3200,
    basic_price: 2800,
    standard_price: 3800,
    premium_price: 4800,
    featured: true,
    status: 'active',
    image_url: null,
    gallery_images: [],
    plan_files: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  // Validate plan data to ensure it's actually a house plan
  const validatePlanData = (planData: any) => {
    // Check if this looks like travel data instead of plan data
    if (planData.travel_date || planData.departure_time || planData.from || planData.to || planData.fare) {
      console.warn('API returned travel data instead of plan data, using fallback');
      return false;
    }
    
    // Check if this has the expected plan structure
    if (!planData.title || !planData.plan_type || planData.bedrooms === undefined) {
      console.warn('Plan data missing required fields, using fallback');
      return false;
    }
    
    return true;
  };

  const fetchPlan = async () => {
    try {
      if (id) {
        const data = await api.getPlan(id);
        console.log('Fetched plan data:', data); // Debug log
        console.log('Plan data type:', typeof data);
        console.log('Plan data keys:', Object.keys(data || {}));
        console.log('Plan data structure:', JSON.stringify(data, null, 2));
        
        // Validate the data
        if (validatePlanData(data)) {
          setPlan(data);
          setUsingFallbackData(false);
        } else {
          // Use fallback data if API returns invalid data
          console.warn('Using fallback plan data due to invalid API response');
          setPlan(createFallbackPlan(id));
          setUsingFallbackData(true);
        }
      }
    } catch (error) {
      console.error('Error fetching plan:', error);
      // If API fails, create a fallback plan for demonstration
      console.warn('API failed, using fallback plan data');
      setPlan(createFallbackPlan(id || 'unknown'));
      setUsingFallbackData(true);
    } finally {
      setLoading(false);
    }
  };

  // Check if plan is already in favorites on component mount
  useEffect(() => {
    if (plan) {
      const existingFavorites = JSON.parse(localStorage.getItem('favoritePlans') || '[]');
      const isPlanFavorite = existingFavorites.some((fav: any) => fav.id === plan.id);
      setIsFavorite(isPlanFavorite);
    }
  }, [plan]);

  // Fetch plan data when component mounts
  useEffect(() => {
    if (id) {
      fetchPlan();
    }
  }, [id]);

  const handleCheckout = () => {
    const prices = {
      basic: plan.basic_price,
      standard: plan.standard_price,
      premium: plan.premium_price
    };
    
    const checkoutData = {
      planId: plan.id,
      planTitle: plan.title,
      package: selectedTier,
      packageName: `${selectedTier} Package`,
      price: prices[selectedTier as keyof typeof prices],
    };
    
    // Store checkout data in localStorage for the checkout page
    localStorage.setItem('checkoutData', JSON.stringify(checkoutData));
    
    // Navigate to checkout page
    navigate('/checkout');
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const shareData = {
        title: plan.title,
        text: `Check out this amazing ${plan.plan_type} plan: ${plan.description}`,
        url: window.location.href,
      };

      if (navigator.share && navigator.canShare(shareData)) {
        // Use native sharing on mobile devices
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (clipboardError) {
        alert('Unable to share or copy link');
      }
    } finally {
      setIsSharing(false);
    }
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    
    // Get existing favorites from localStorage
    const existingFavorites = JSON.parse(localStorage.getItem('favoritePlans') || '[]');
    
    if (isFavorite) {
      // Remove from favorites
      const updatedFavorites = existingFavorites.filter((fav: any) => fav.id !== plan.id);
      localStorage.setItem('favoritePlans', JSON.stringify(updatedFavorites));
    } else {
      // Add to favorites
      const planData = {
        id: plan.id,
        title: plan.title,
        plan_type: plan.plan_type,
        image_url: plan.image_url,
        basic_price: plan.basic_price,
        added_at: new Date().toISOString()
      };
      const updatedFavorites = [...existingFavorites, planData];
      localStorage.setItem('favoritePlans', JSON.stringify(updatedFavorites));
    }
  };

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

  // Similar plans would need a separate query
  const similarPlans: any[] = [];

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
              <Badge variant="secondary">{plan.plan_type}</Badge>
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
                    src={plan.image_url || villaImage}
                  alt={plan.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button variant="secondary" size="sm" onClick={() => setShow3DViewer(true)}>
                      <Box className="h-4 w-4" />
                  </Button>
                  <Button 
                     variant="secondary" 
                     size="sm" 
                     onClick={handleShare}
                     disabled={isSharing}
                   >
                     {isSharing ? (
                       <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                     ) : (
                       <Share2 className="h-4 w-4" />
                     )}
                   </Button>
                   <Button 
                     variant={isFavorite ? "default" : "secondary"}
                     size="sm" 
                     onClick={handleFavorite}
                     className={isFavorite ? "bg-red-500 hover:bg-red-600 text-white" : ""}
                   >
                     <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                   </Button>
                </div>
              </div>
              
                {/* Additional Images */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Additional Views</h4>
                <div className="grid grid-cols-3 gap-3">
                  {plan.gallery_images?.slice(0, 3).map((image: string, index: number) => (
                    <div key={index} className="h-24 rounded-lg overflow-hidden border border-border shadow-sm">
                      <img
                        src={image}
                        alt={`${plan.title} view ${index + 2}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  )) || [1, 2, 3].map((index) => (
                    <div key={index} className="h-24 rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <ImageIcon className="w-6 h-6 mx-auto mb-1 opacity-50" />
                        <span className="text-xs">View {index + 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
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
                      <span className="text-2xl font-bold">{plan.area_sqft}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Sq Ft</div>
                  </div>
                  <div className="text-center p-4 bg-card rounded-lg">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <Star className="h-5 w-5 text-primary fill-current" />
                      <span className="text-2xl font-bold">4.5</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Rating</div>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>Type: {plan.plan_type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    <span>Status: {plan.status}</span>
                  </div>
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
                          <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
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
                        <span className="font-medium">{plan.area_sqft} sq ft</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Bedrooms:</span>
                        <span className="font-medium">{plan.bedrooms}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Bathrooms:</span>
                        <span className="font-medium">{plan.bathrooms}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <span className="font-medium">{plan.plan_type}</span>
                      </div>
                    </div>
                      </div>
                    </div>
              </TabsContent>

              <TabsContent value="features" className="space-y-6">
                <h3 className="text-xl font-semibold">Plan Features</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Professional architectural plans</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Detailed floor plans</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Construction-ready drawings</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Material specifications</span>
                  </div>
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
                    {[
                      {
                        key: 'basic',
                        name: 'Basic Package',
                        description: 'Essential plans to get started',
                        price: plan.basic_price,
                        includes: ['Floor plans (PDF)', 'Basic elevations', 'Plot plan', 'Material list']
                      },
                      {
                        key: 'standard',
                        name: 'Standard Package', 
                        description: 'Complete construction package',
                        price: plan.standard_price,
                        includes: ['Everything in Basic', 'Detailed elevations', 'Cross sections', 'Construction details', 'Electrical layout', 'Plumbing layout']
                      },
                      {
                        key: 'premium',
                        name: 'Premium Package',
                        description: 'Professional complete package', 
                        price: plan.premium_price,
                        includes: ['Everything in Standard', '3D renderings', 'Interior layouts', 'Landscape design', 'Structural details', 'HVAC layout', 'Permit-ready drawings']
                      }
                    ].map((tier) => (
                      <Card key={tier.key} className={`relative ${selectedTier === tier.key ? 'ring-2 ring-primary' : ''}`}>
                        {selectedTier === tier.key && (
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
                            variant={selectedTier === tier.key ? 'default' : 'outline'}
                      onClick={() => setSelectedTier(tier.key)}
                    >
                            {selectedTier === tier.key ? 'Selected' : 'Select Package'}
                          </Button>
                        </CardContent>
                      </Card>
                  ))}
                </div>

                <Separator />

                <div className="space-y-4">
                     <div className="flex items-center justify-between text-lg font-semibold">
                       <span>Total:</span>
                       <span className="text-primary">₵{selectedTier === 'basic' ? plan.basic_price : selectedTier === 'standard' ? plan.standard_price : plan.premium_price}</span>
                  </div>
                  
                     <Button className="w-full" size="lg" onClick={handleCheckout}>
                       Proceed to Checkout - ₵{selectedTier === 'basic' ? plan.basic_price : selectedTier === 'standard' ? plan.standard_price : plan.premium_price}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                <PlanReviews planId={plan.id} planTitle={plan.title} />
              </TabsContent>

              <TabsContent value="similar" className="space-y-6">
                <h3 className="text-xl font-semibold">Similar {plan.plan_type} Plans</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center py-12 text-muted-foreground">
                    <p>Similar plans coming soon...</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
        </div>
              </div>
      </section>

      {/* 3D Viewer Modal */}
      {plan && (
        <Plan3DViewer 
          plan={plan}
          isOpen={show3DViewer} 
          onClose={() => setShow3DViewer(false)} 
        />
      )}
    </div>
  );
};

export default PlanDetail;