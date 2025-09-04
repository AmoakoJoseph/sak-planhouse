import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Grid, List, Star, Bed, Bath, Square, Download, Scale, MapPin, Users, Building2, Sparkles, ArrowRight, Heart, Eye, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import PlanComparison from '@/components/PlanComparison';
import villaImage from '@/assets/villa-plan.jpg';
import bungalowImage from '@/assets/bungalow-plan.jpg';
import townhouseImage from '@/assets/townhouse-plan.jpg';

const Plans = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedBedrooms, setSelectedBedrooms] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [selectedSort, setSelectedSort] = useState('featured');
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showComparison, setShowComparison] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-secondary rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">Loading Amazing Plans</h3>
            <p className="text-muted-foreground">Discovering the perfect designs for you...</p>
          </div>
        </div>
      </div>
    );
  }

  // Filter plans based on all criteria
  const filteredPlans = plans.filter(plan => {
    // Search filter
    const matchesSearch = plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.plan_type.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Type filter
    const matchesType = selectedType === 'all' || plan.plan_type.toLowerCase() === selectedType.toLowerCase();
    
    // Bedrooms filter
    const matchesBedrooms = selectedBedrooms === 'all' || plan.bedrooms >= parseInt(selectedBedrooms);
    
    // Price filter
    let matchesPrice = true;
    if (selectedPrice === 'low') {
      matchesPrice = plan.basic_price < 2000;
    } else if (selectedPrice === 'mid') {
      matchesPrice = plan.basic_price >= 2000 && plan.basic_price <= 3500;
    } else if (selectedPrice === 'high') {
      matchesPrice = plan.basic_price > 3500;
    }
    
    return matchesSearch && matchesType && matchesBedrooms && matchesPrice;
  });

  // Sort plans
  const sortedPlans = [...filteredPlans].sort((a, b) => {
    switch (selectedSort) {
      case 'featured':
        return b.featured ? 1 : -1;
      case 'price-low':
        return a.basic_price - b.basic_price;
      case 'price-high':
        return b.basic_price - a.basic_price;
      case 'rating':
        return 0; // Rating not implemented yet
      case 'downloads':
        return 0; // Downloads not tracked yet
      default:
        return 0;
    }
  });

  const handleViewDetails = (planId: number) => {
    navigate(`/plans/${planId}`);
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/5 via-primary/10 to-secondary/5 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.1)_1px,transparent_0)] bg-[size:40px_40px]"></div>
        </div>
        
        <div className="container px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20">
              <Sparkles className="w-4 h-4" />
              Premium House Plans
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
              Discover Your Perfect
              <span className="block bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                Dream Home
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Explore our curated collection of professionally designed architectural plans. 
              From modern villas to cozy bungalows, find the perfect design that matches your vision.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" />
                <span>500+ Plans</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span>2,500+ Happy Customers</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Ghana's #1 Platform</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container px-4 py-16">
        {/* Enhanced Filters and Search */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 mb-12">
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search for plans, styles, or features..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-6 py-4 text-lg border-2 border-muted/30 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 rounded-2xl"
              />
              <Button 
                size="sm" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-xl"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Filter Controls */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-40 bg-white/50 border-muted/30 hover:bg-white/70 transition-colors rounded-xl">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="villa">Villas</SelectItem>
                  <SelectItem value="bungalow">Bungalows</SelectItem>
                  <SelectItem value="townhouse">Townhouses</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedBedrooms} onValueChange={setSelectedBedrooms}>
                <SelectTrigger className="w-40 bg-white/50 border-muted/30 hover:bg-white/70 transition-colors rounded-xl">
                  <SelectValue placeholder="Bedrooms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Bedrooms</SelectItem>
                  <SelectItem value="2">2+ Bedrooms</SelectItem>
                  <SelectItem value="3">3+ Bedrooms</SelectItem>
                  <SelectItem value="4">4+ Bedrooms</SelectItem>
                  <SelectItem value="5">5+ Bedrooms</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedPrice} onValueChange={setSelectedPrice}>
                <SelectTrigger className="w-40 bg-white/50 border-muted/30 hover:bg-white/70 transition-colors rounded-xl">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Price</SelectItem>
                  <SelectItem value="low">Under ₵2,000</SelectItem>
                  <SelectItem value="mid">₵2,000 - ₵3,500</SelectItem>
                  <SelectItem value="high">₵3,500+</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedSort} onValueChange={setSelectedSort}>
                <SelectTrigger className="w-48 bg-white/50 border-muted/30 hover:bg-white/70 transition-colors rounded-xl">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="downloads">Most Downloaded</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-4 pt-4">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowComparison(true)}
                className="flex items-center gap-3 px-6 py-3 rounded-xl border-2 hover:border-primary hover:bg-primary/5 transition-all duration-300"
              >
                <Scale className="h-5 w-5" />
                Compare Plans
              </Button>
              
              <div className="flex items-center gap-2 bg-muted/30 rounded-xl p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-lg transition-all duration-300"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-lg transition-all duration-300"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground">
              {sortedPlans.length} Amazing Plans Found
            </h2>
            <p className="text-lg text-muted-foreground">
              Professional architectural designs crafted by Ghana's top architects
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              <Zap className="w-4 h-4 mr-2" />
              {sortedPlans.filter(p => p.featured).length} Featured
            </Badge>
          </div>
        </div>

        {/* Plans Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {sortedPlans.map((plan) => (
              <Card key={plan.id} className="group relative overflow-hidden border-0 bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-500 transform hover:-translate-y-3 hover:shadow-2xl rounded-3xl">
                {/* Featured Badge */}
                {plan.featured && (
                  <div className="absolute top-4 left-4 z-20">
                    <Badge className="bg-gradient-to-r from-primary to-secondary text-white border-0 shadow-lg">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      Featured
                    </Badge>
                  </div>
                )}
                
                {/* Plan Type Badge */}
                <div className="absolute top-4 right-4 z-20">
                  <Badge variant="secondary" className="bg-white/90 text-foreground border-0 shadow-lg">
                    {plan.plan_type}
                  </Badge>
                </div>
                
                {/* Image Section */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={plan.image_url || getPlanImage(plan.plan_type)}
                    alt={plan.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  
                  {/* Quick Actions Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 flex gap-3">
                      <Button size="sm" variant="secondary" className="rounded-full w-10 h-10 p-0">
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="secondary" className="rounded-full w-10 h-10 p-0">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="secondary" className="rounded-full w-10 h-10 p-0">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors duration-300 line-clamp-2">
                    {plan.title}
                  </CardTitle>
                  
                  {/* Plan Features */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground pt-2">
                    <div className="flex items-center gap-1">
                      <Bed className="h-4 w-4 text-primary" />
                      <span>{plan.bedrooms}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="h-4 w-4 text-primary" />
                      <span>{plan.bathrooms}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Square className="h-4 w-4 text-primary" />
                      <span>{plan.area_sqft}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {/* Pricing */}
                    <div className="text-center p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl border border-primary/10">
                      <div className="text-2xl font-bold text-primary">
                        From ₵{plan.basic_price.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Basic Package
                      </div>
                    </div>
                    
                    {/* Action Button */}
                    <Button 
                      variant="default" 
                      className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                      onClick={() => handleViewDetails(plan.id)}
                    >
                      View Details
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {sortedPlans.map((plan) => (
              <Card key={plan.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="relative w-full md:w-80 h-48 md:h-auto overflow-hidden">
                    <img
                      src={plan.image_url || getPlanImage(plan.plan_type)}
                      alt={plan.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    
                    {plan.featured && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-gradient-to-r from-primary to-secondary text-white border-0">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          Featured
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1 space-y-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant="secondary" className="text-xs">
                              {plan.plan_type}
                            </Badge>
                            <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                              {plan.title}
                            </h3>
                          </div>
                          
                          <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Bed className="h-4 w-4 text-primary" />
                              <span>{plan.bedrooms} Bedrooms</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Bath className="h-4 w-4 text-primary" />
                              <span>{plan.bathrooms} Bathrooms</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Square className="h-4 w-4 text-primary" />
                              <span>{plan.area_sqft} sq ft</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-3xl font-bold text-primary">
                          From ₵{plan.basic_price.toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-3">
                        <Button 
                          variant="default" 
                          className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-8 py-3 rounded-xl font-semibold"
                          onClick={() => handleViewDetails(plan.id)}
                        >
                          View Details
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1 rounded-lg">
                            <Heart className="w-4 h-4 mr-2" />
                            Save
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1 rounded-lg">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Load More Section */}
        {sortedPlans.length > 0 && (
          <div className="text-center mt-16">
            <div className="space-y-4">
              <Button variant="outline" size="lg" className="px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary hover:text-white transition-all duration-300">
                Load More Plans
              </Button>
              <p className="text-muted-foreground">
                Can't find what you're looking for? Contact us for custom designs.
              </p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {sortedPlans.length === 0 && (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto space-y-6">
              <div className="w-24 h-24 bg-muted/30 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-12 h-12 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold text-foreground">No Plans Found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or browse all available plans.
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedType('all');
                  setSelectedBedrooms('all');
                  setSelectedPrice('all');
                }}
                className="px-6 py-3 rounded-xl"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Plan Comparison Modal */}
      <PlanComparison 
        isOpen={showComparison} 
        onClose={() => setShowComparison(false)} 
      />
    </div>
  );
};

export default Plans;