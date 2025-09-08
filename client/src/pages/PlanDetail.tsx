import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import PlanReviews from '@/components/PlanReviews';
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
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/hooks/useAuth';
import villaImage from '@/assets/villa-plan.jpg';
import bungalowImage from '@/assets/bungalow-plan.jpg';
import townhouseImage from '@/assets/townhouse-plan.jpg';

const PlanDetail = () => {
  const [selectedTier, setSelectedTier] = useState('standard');
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [usingFallbackData, setUsingFallbackData] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();

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

  const fetchReviews = async () => {
    if (!id) return;
    
    setReviewsLoading(true);
    try {
      const reviewsData = await api.get(`/reviews/${id}`);
      setReviews(reviewsData || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  const getAverageRating = () => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10; // Round to 1 decimal place
  };


  // Fetch plan data when component mounts
  useEffect(() => {
    if (id) {
      fetchPlan();
      fetchReviews();
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

  const handleFavorite = async () => {
    if (!user) {
      alert('Please log in to add favorites');
      return;
    }
    
    if (!plan?.id) return;
    
    const success = await toggleFavorite(plan.id);
    if (success) {
      // Success feedback could be added here
    } else {
      alert('Failed to update favorite. Please try again.');
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="pt-0 pb-16 bg-primary/10">
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
                     variant={isFavorite(plan?.id) ? "default" : "secondary"}
                     size="sm" 
                     onClick={handleFavorite}
                     className={isFavorite(plan?.id) ? "bg-red-500 hover:bg-red-600 text-white" : ""}
                   >
                     <Heart className={`h-4 w-4 ${isFavorite(plan?.id) ? 'fill-current' : ''}`} />
                   </Button>
                </div>
              </div>
              
                {/* Additional Views or Plan Highlights */}
              <div className="space-y-3">
                {plan.gallery_images && plan.gallery_images.length > 0 ? (
                  <>
                    <h4 className="text-sm font-medium text-muted-foreground">Additional Views</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {plan.gallery_images.slice(0, 3).map((image: string, index: number) => (
                        <div key={index} className="h-24 rounded-lg overflow-hidden border border-border shadow-sm">
                          <img
                            src={image}
                            alt={`${plan.title} view ${index + 2}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <h4 className="text-sm font-medium text-muted-foreground">Plan Highlights</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Professional architectural design</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Construction-ready drawings</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Multiple package options</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Instant download after purchase</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

               {/* Plan Info & Purchase */}
             <div className="space-y-6">
               <div>
                   <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                   {plan.title}
                 </h1>
                   <div className="flex items-center gap-2 mb-3">
                     <div className="flex items-center">
                       {[1, 2, 3, 4, 5].map((star) => (
                         <Star key={star} className={`h-4 w-4 ${star <= Math.round(getAverageRating()) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                       ))}
                     </div>
                     <span className="text-sm text-muted-foreground">
                       {getAverageRating() > 0 ? `${getAverageRating()} (${reviews.length} reviews)` : 'No reviews yet'}
                     </span>
                   </div>
                   {plan.featured && (
                     <Badge className="bg-purple-600 text-white mb-3">
                       <Star className="h-3 w-3 mr-1 fill-current" />
                       Best Seller
                     </Badge>
                   )}
                 </div>

                 {/* Package Selection */}
                 <div className="space-y-4">
                   <div>
                     <h3 className="text-sm font-medium text-muted-foreground mb-3">Choose Package</h3>
                     <div className="space-y-3">
                       {[
                         {
                           key: 'basic',
                           name: 'Basic Package',
                           price: plan.basic_price,
                           description: 'Essential plans to get started'
                         },
                         {
                           key: 'standard',
                           name: 'Standard Package',
                           price: plan.standard_price,
                           description: 'Complete construction package'
                         },
                         {
                           key: 'premium',
                           name: 'Premium Package',
                           price: plan.premium_price,
                           description: 'Professional complete package'
                         }
                       ].map((tier) => (
                         <div key={tier.key} className={`border rounded-lg p-3 cursor-pointer transition-colors ${selectedTier === tier.key ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                              onClick={() => setSelectedTier(tier.key)}>
                           <div className="flex items-center justify-between">
                             <div>
                               <div className="font-medium text-sm">{tier.name}</div>
                               <div className="text-xs text-muted-foreground">{tier.description}</div>
                             </div>
                             <div className="text-right">
                               <div className="font-bold text-primary">₵{tier.price}</div>
                               {selectedTier === tier.key && (
                                 <div className="text-xs text-primary">Selected</div>
                               )}
                             </div>
                           </div>
                         </div>
                       ))}
                     </div>
                   </div>

                   {/* Purchase Button */}
                   <Button className="w-full" size="lg" onClick={handleCheckout}>
                     Proceed to Checkout - ₵{selectedTier === 'basic' ? plan.basic_price : selectedTier === 'standard' ? plan.standard_price : plan.premium_price}
                   </Button>

                   {/* Purchase Guarantees */}
                   <div className="space-y-3 pt-4 border-t">
                     <div className="flex items-center gap-2 text-sm">
                       <Download className="h-4 w-4 text-green-600" />
                       <span>Instant digital delivery</span>
                     </div>
                     <div className="flex items-center gap-2 text-sm">
                       <CheckCircle className="h-4 w-4 text-green-600" />
                       <span>100% Money Guarantee</span>
                     </div>
                     <div className="flex items-center gap-2 text-sm">
                       <CheckCircle className="h-4 w-4 text-green-600" />
                       <span>Multiple payment options</span>
                     </div>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="pb-16">
        <div className="container px-4">
          <div className="max-w-6xl mx-auto">
            <div className="space-y-6">
              <PlanReviews planId={plan.id} planTitle={plan.title} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PlanDetail;