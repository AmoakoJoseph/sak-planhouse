import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Bed, Bath, Square } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/hooks/useAuth';
import villaImage from '@/assets/villa-plan.jpg';
import bungalowImage from '@/assets/bungalow-plan.jpg';
import townhouseImage from '@/assets/townhouse-plan.jpg';

interface PlanCardProps {
  plan: {
    id: string;
    title: string;
    plan_type: string;
    bedrooms: number | null;
    bathrooms: number | null;
    area_sqft: number | null;
    basic_price: number;
    featured?: boolean;
    image_url?: string | null;
  };
  showFavorites?: boolean;
  className?: string;
}

const PlanCard = ({ plan, showFavorites = false, className = "" }: PlanCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();

  const getPlanImage = (planType: string) => {
    switch (planType.toLowerCase()) {
      case 'villa':
        return villaImage;
      case 'bungalow':
        return bungalowImage;
      case 'townhouse':
        return townhouseImage;
      default:
        return villaImage;
    }
  };

  const handleViewDetails = () => {
    navigate(`/plans/${plan.id}`);
  };

  return (
    <Card className={`group relative overflow-hidden border-0 bg-white backdrop-blur-sm hover:bg-white transition-all duration-500 transform hover:-translate-y-3 hover:shadow-2xl rounded-3xl border border-orange-100 hover:border-orange-200 ${className}`}>
      {/* Featured Badge */}
      {plan.featured && (
        <div className="absolute top-4 left-4 z-20">
          <Badge className="bg-orange-600 text-white border-0 shadow-lg">
            <Star className="h-3 w-3 mr-1 fill-current" />
            Featured
          </Badge>
        </div>
      )}
      
      {/* Plan Type Badge */}
      <div className="absolute top-4 right-4 z-20">
        <Badge variant="secondary" className="bg-white text-gray-700 border-0 shadow-lg">
          {plan.plan_type}
        </Badge>
      </div>
      
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={plan.image_url || getPlanImage(plan.plan_type)}
          alt={plan.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-gray-800 group-hover:text-orange-600 transition-colors duration-300 line-clamp-2">
          {plan.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Price */}
        <div className="mb-3">
          <div className="text-sm text-gray-600">From</div>
          <div className="text-xl font-bold text-gray-800">GHC {plan.basic_price.toLocaleString()}</div>
        </div>

        {/* Specs row with labels */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs text-gray-600 mb-4">
          <div className="flex flex-col items-center gap-1">
            <Bed className="h-4 w-4 text-primary" />
            <div className="font-medium text-gray-800">{plan.bedrooms}</div>
            <div className="text-gray-600">Bedrooms</div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Bath className="h-4 w-4 text-primary" />
            <div className="font-medium text-gray-800">{plan.bathrooms}</div>
            <div className="text-gray-600">Bathrooms</div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Square className="h-4 w-4 text-primary" />
            <div className="font-medium text-gray-800">{plan.area_sqft}</div>
            <div className="text-gray-600">sq ft</div>
          </div>
        </div>

        {/* Bottom actions */}
        <div className="flex items-center gap-3">
          <Button 
            variant="outline"
            className="flex-1 rounded-lg"
            onClick={handleViewDetails}
          >
            View Details
          </Button>
          {showFavorites && (
            <Button 
              variant="outline" 
              size="sm" 
              className={`rounded-lg ${isFavorite(plan.id) ? 'bg-red-500 hover:bg-red-600 text-white border-red-500' : ''}`}
              onClick={() => {
                if (!user) {
                  alert('Please log in to add favorites');
                  return;
                }
                toggleFavorite(plan.id);
              }}
            >
              <Star className={`w-4 h-4 mr-2 ${isFavorite(plan.id) ? 'fill-current' : ''}`} />
              {isFavorite(plan.id) ? 'Saved' : 'Save'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanCard;
