import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Star, 
  Download, 
  Bed, 
  Bath, 
  Square,
  Users,
  Building2,
  CheckCircle,
  X,
  Plus,
  ArrowRight,
  Scale,
  Heart
} from 'lucide-react';
import { api } from '@/lib/api';

interface Plan {
  id: number;
  title: string;
  description: string;
  plan_type: string;
  bedrooms: number;
  bathrooms: number;
  area_sqft: number;
  basic_price: number;
  standard_price: number;
  premium_price: number;
  image_url?: string;
  featured?: boolean;
  status: string;
}

interface PlanComparisonProps {
  isOpen: boolean;
  onClose: () => void;
}

const PlanComparison = ({ isOpen, onClose }: PlanComparisonProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [plans, setPlans] = useState<Plan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<Plan[]>([]);
  const [selectedPlans, setSelectedPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  useEffect(() => {
    if (isOpen) {
      fetchPlans();
    }
  }, [isOpen]);

  useEffect(() => {
    filterPlans();
  }, [plans, searchTerm, selectedType]);

  const fetchPlans = async () => {
    try {
      const data = await api.getPlans({ status: 'active' });
      setPlans(data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPlans = () => {
    let filtered = plans.filter(plan => {
      const matchesSearch = plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           plan.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'all' || plan.plan_type === selectedType;
      return matchesSearch && matchesType;
    });
    setFilteredPlans(filtered);
  };

  const addToComparison = (plan: Plan) => {
    if (selectedPlans.length >= 4) {
      alert('You can compare up to 4 plans at once');
      return;
    }
    if (!selectedPlans.find(p => p.id === plan.id)) {
      setSelectedPlans([...selectedPlans, plan]);
    }
  };

  const removeFromComparison = (planId: number) => {
    setSelectedPlans(selectedPlans.filter(p => p.id !== planId));
  };

  const clearComparison = () => {
    setSelectedPlans([]);
  };

  const getPriceRange = (plan: Plan) => {
    const min = Math.min(plan.basic_price, plan.standard_price, plan.premium_price);
    const max = Math.max(plan.basic_price, plan.standard_price, plan.premium_price);
    return min === max ? `₵${min.toLocaleString()}` : `₵${min.toLocaleString()} - ₵${max.toLocaleString()}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Scale className="w-6 h-6 text-primary" />
            <div>
              <h2 className="text-2xl font-bold text-foreground">Plan Comparison</h2>
              <p className="text-muted-foreground">Compare up to 4 house plans side by side</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={clearComparison} disabled={selectedPlans.length === 0}>
              Clear All
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Left Panel - Plan Selection */}
          <div className="w-1/2 border-r p-6 overflow-y-auto">
            <div className="space-y-4 mb-6">
              <div className="flex space-x-3">
                <Input
                  placeholder="Search plans..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="bungalow">Bungalow</SelectItem>
                    <SelectItem value="townhouse">Townhouse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  Grid
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                >
                  Table
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="h-4 bg-muted rounded mb-2"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 gap-4">
                {filteredPlans.map((plan) => (
                  <Card 
                    key={plan.id} 
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedPlans.find(p => p.id === plan.id) ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => addToComparison(plan)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <img 
                          src={plan.image_url || '/placeholder.svg'} 
                          alt={plan.title}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-foreground truncate">{plan.title}</h3>
                            {selectedPlans.find(p => p.id === plan.id) && (
                              <CheckCircle className="w-5 h-5 text-primary" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {plan.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <Bed className="w-3 h-3 mr-1" />
                              {plan.bedrooms} BR
                            </span>
                            <span className="flex items-center">
                              <Bath className="w-3 h-3 mr-1" />
                              {plan.bathrooms} BA
                            </span>
                            <span className="flex items-center">
                              <Square className="w-3 h-3 mr-1" />
                              {plan.area_sqft?.toLocaleString()} sq ft
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="mb-2 capitalize">
                            {plan.plan_type}
                          </Badge>
                          <div className="text-lg font-bold text-primary">
                            {getPriceRange(plan)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredPlans.map((plan) => (
                  <div 
                    key={plan.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-muted/50 ${
                      selectedPlans.find(p => p.id === plan.id) ? 'bg-primary/10 ring-1 ring-primary' : ''
                    }`}
                    onClick={() => addToComparison(plan)}
                  >
                    <img 
                      src={plan.image_url || '/placeholder.svg'} 
                      alt={plan.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate">{plan.title}</h3>
                      <p className="text-sm text-muted-foreground truncate">{plan.description}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="mb-1 capitalize text-xs">
                        {plan.plan_type}
                      </Badge>
                      <div className="text-sm font-semibold text-primary">
                        {getPriceRange(plan)}
                      </div>
                    </div>
                    {selectedPlans.find(p => p.id === plan.id) && (
                      <CheckCircle className="w-5 h-5 text-primary" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Panel - Comparison Table */}
          <div className="w-1/2 p-6 overflow-y-auto">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Selected Plans ({selectedPlans.length}/4)
              </h3>
              {selectedPlans.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Scale className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Select plans from the left panel to compare them</p>
                </div>
              )}
            </div>

            {selectedPlans.length > 0 && (
              <div className="space-y-6">
                {/* Plan Headers */}
                <div className="grid grid-cols-1 gap-4">
                  {selectedPlans.map((plan) => (
                    <Card key={plan.id} className="relative">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <img 
                            src={plan.image_url || '/placeholder.svg'} 
                            alt={plan.title}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-foreground">{plan.title}</h3>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFromComparison(plan.id)}
                                className="h-6 w-6"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                              {plan.description}
                            </p>
                            <div className="flex items-center space-x-4 text-sm">
                              <span className="flex items-center">
                                <Bed className="w-3 h-3 mr-1" />
                                {plan.bedrooms} BR
                              </span>
                              <span className="flex items-center">
                                <Bath className="w-3 h-3 mr-1" />
                                {plan.bathrooms} BA
                              </span>
                              <span className="flex items-center">
                                <Square className="w-3 h-3 mr-1" />
                                {plan.area_sqft?.toLocaleString()} sq ft
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="mb-2 capitalize">
                              {plan.plan_type}
                            </Badge>
                            <div className="space-y-1">
                              <div className="text-sm">
                                <span className="text-muted-foreground">Basic:</span>
                                <span className="font-semibold ml-1">₵{plan.basic_price?.toLocaleString()}</span>
                              </div>
                              <div className="text-sm">
                                <span className="text-muted-foreground">Standard:</span>
                                <span className="font-semibold ml-1">₵{plan.standard_price?.toLocaleString()}</span>
                              </div>
                              <div className="text-sm">
                                <span className="text-muted-foreground">Premium:</span>
                                <span className="font-semibold ml-1">₵{plan.premium_price?.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Comparison Actions */}
                <div className="flex space-x-3">
                  <Button 
                    className="flex-1"
                    onClick={() => {
                      // Navigate to checkout with selected plans
                      console.log('Proceed to checkout with:', selectedPlans);
                    }}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Add to Favorites
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      // Download comparison PDF
                      console.log('Download comparison for:', selectedPlans);
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Comparison
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanComparison;
