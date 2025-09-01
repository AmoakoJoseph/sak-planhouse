import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Grid, List, Star, Bed, Bath, Square, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
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
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .eq('status', 'active')
        .order('featured', { ascending: false });

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading plans...</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-construction-gray-light">
      {/* Header */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Badge variant="secondary" className="mb-4">
              Browse Plans
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground">
              Discover Your Perfect
              <span className="bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent"> House Plan</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Browse our comprehensive collection of professionally designed architectural plans. 
              Find the perfect design for your dream home.
            </p>
          </div>
        </div>
      </section>

      <div className="container px-4 py-12">
        {/* Filters and Search */}
        <div className="bg-card rounded-2xl shadow-card border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search plans..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-40">
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
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Bedrooms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                  <SelectItem value="5">5+</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedPrice} onValueChange={setSelectedPrice}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Price</SelectItem>
                  <SelectItem value="low">Under ₵2,000</SelectItem>
                  <SelectItem value="mid">₵2,000 - ₵3,500</SelectItem>
                  <SelectItem value="high">₵3,500+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {sortedPlans.length} Plans Found
            </h2>
            <p className="text-muted-foreground">
              Professional architectural designs ready for download
            </p>
          </div>
          
          <Select value={selectedSort} onValueChange={setSelectedSort}>
            <SelectTrigger className="w-48">
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

        {/* Plans Grid */}
        <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}>
          {sortedPlans.map((plan) => (
            <Card key={plan.id} className="group hover:shadow-construction transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border-0 bg-gradient-card">
              {plan.featured && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-primary text-primary-foreground">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                </div>
              )}
              
              <div className="relative h-48 overflow-hidden">
                <img
                  src={plan.image_url || villaImage}
                  alt={plan.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <Badge variant="secondary" className="text-xs mb-2">
                    {plan.plan_type}
                  </Badge>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {plan.title}
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Bed className="h-4 w-4" />
                    {plan.bedrooms}
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="h-4 w-4" />
                    {plan.bathrooms}
                  </div>
                  <div className="flex items-center gap-1">
                    <Square className="h-4 w-4" />
                    {plan.area_sqft} sq ft
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div className="mb-4">
                    <div className="text-xl font-bold text-primary">
                      From ₵{plan.basic_price.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Basic Package
                    </div>
                  </div>
                  <Button 
                    variant="default" 
                    className="w-full"
                    onClick={() => handleViewDetails(plan.id)}
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Plans
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Plans;