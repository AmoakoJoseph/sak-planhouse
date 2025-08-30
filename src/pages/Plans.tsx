import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Grid, List, Star, Bed, Bath, Square, Download } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  
  const navigate = useNavigate();

  const plans = [
    // VILLAS - Luxury & Executive
    {
      id: 1,
      title: 'Luxury Villa Paradise',
      type: 'Villa',
      bedrooms: 5,
      bathrooms: 4,
      area: 3200,
      price: { basic: 2500, standard: 3200, premium: 4500 },
      image: villaImage,
      featured: true,
      rating: 4.9,
      downloads: 234,
    },
    {
      id: 2,
      title: 'Executive Villa Estate',
      type: 'Villa',
      bedrooms: 6,
      bathrooms: 5,
      area: 4100,
      price: { basic: 3200, standard: 4100, premium: 5500 },
      image: villaImage,
      featured: false,
      rating: 4.9,
      downloads: 298,
    },
    {
      id: 3,
      title: 'Modern Mediterranean Villa',
      type: 'Villa',
      bedrooms: 4,
      bathrooms: 4,
      area: 2800,
      price: { basic: 2200, standard: 2800, premium: 3800 },
      image: villaImage,
      featured: true,
      rating: 4.8,
      downloads: 187,
    },
    {
      id: 4,
      title: 'African Heritage Villa',
      type: 'Villa',
      bedrooms: 5,
      bathrooms: 3,
      area: 3500,
      price: { basic: 2800, standard: 3600, premium: 4800 },
      image: villaImage,
      featured: false,
      rating: 4.7,
      downloads: 156,
    },
    {
      id: 5,
      title: 'Contemporary Glass Villa',
      type: 'Villa',
      bedrooms: 4,
      bathrooms: 4,
      area: 3000,
      price: { basic: 2400, standard: 3100, premium: 4200 },
      image: villaImage,
      featured: false,
      rating: 4.6,
      downloads: 134,
    },
    {
      id: 6,
      title: 'Tropical Paradise Villa',
      type: 'Villa',
      bedrooms: 6,
      bathrooms: 5,
      area: 3800,
      price: { basic: 3000, standard: 3800, premium: 5200 },
      image: villaImage,
      featured: true,
      rating: 4.9,
      downloads: 267,
    },

    // BUNGALOWS - Family & Comfort
    {
      id: 7,
      title: 'Modern Family Bungalow',
      type: 'Bungalow',
      bedrooms: 3,
      bathrooms: 2,
      area: 1800,
      price: { basic: 1800, standard: 2300, premium: 3100 },
      image: bungalowImage,
      featured: false,
      rating: 4.7,
      downloads: 156,
    },
    {
      id: 8,
      title: 'Cozy Garden Bungalow',
      type: 'Bungalow',
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      price: { basic: 1500, standard: 1900, premium: 2600 },
      image: bungalowImage,
      featured: false,
      rating: 4.6,
      downloads: 92,
    },
    {
      id: 9,
      title: 'Contemporary African Bungalow',
      type: 'Bungalow',
      bedrooms: 4,
      bathrooms: 3,
      area: 2200,
      price: { basic: 2000, standard: 2500, premium: 3400 },
      image: bungalowImage,
      featured: true,
      rating: 4.8,
      downloads: 178,
    },
    {
      id: 10,
      title: 'Minimalist Bungalow',
      type: 'Bungalow',
      bedrooms: 2,
      bathrooms: 2,
      area: 1400,
      price: { basic: 1600, standard: 2000, premium: 2800 },
      image: bungalowImage,
      featured: false,
      rating: 4.5,
      downloads: 89,
    },
    {
      id: 11,
      title: 'Traditional Ghanaian Bungalow',
      type: 'Bungalow',
      bedrooms: 3,
      bathrooms: 2,
      area: 1600,
      price: { basic: 1700, standard: 2100, premium: 2900 },
      image: bungalowImage,
      featured: false,
      rating: 4.7,
      downloads: 145,
    },
    {
      id: 12,
      title: 'Eco-Friendly Bungalow',
      type: 'Bungalow',
      bedrooms: 3,
      bathrooms: 2,
      area: 1900,
      price: { basic: 1900, standard: 2400, premium: 3300 },
      image: bungalowImage,
      featured: true,
      rating: 4.8,
      downloads: 167,
    },

    // TOWNHOUSES - Urban & Modern
    {
      id: 13,
      title: 'Contemporary Townhouse',
      type: 'Townhouse',
      bedrooms: 4,
      bathrooms: 3,
      area: 2400,
      price: { basic: 2200, standard: 2800, premium: 3800 },
      image: townhouseImage,
      featured: true,
      rating: 4.8,
      downloads: 189,
    },
    {
      id: 14,
      title: 'Urban Smart Townhouse',
      type: 'Townhouse',
      bedrooms: 3,
      bathrooms: 3,
      area: 2100,
      price: { basic: 2000, standard: 2500, premium: 3400 },
      image: townhouseImage,
      featured: false,
      rating: 4.7,
      downloads: 167,
    },
    {
      id: 15,
      title: 'Luxury Penthouse Townhouse',
      type: 'Townhouse',
      bedrooms: 5,
      bathrooms: 4,
      area: 2800,
      price: { basic: 2600, standard: 3300, premium: 4500 },
      image: townhouseImage,
      featured: true,
      rating: 4.9,
      downloads: 234,
    },
    {
      id: 16,
      title: 'Modern Duplex Townhouse',
      type: 'Townhouse',
      bedrooms: 4,
      bathrooms: 3,
      area: 2200,
      price: { basic: 2100, standard: 2600, premium: 3600 },
      image: townhouseImage,
      featured: false,
      rating: 4.6,
      downloads: 123,
    },
    {
      id: 17,
      title: 'Family-Friendly Townhouse',
      type: 'Townhouse',
      bedrooms: 3,
      bathrooms: 2,
      area: 1800,
      price: { basic: 1800, standard: 2200, premium: 3000 },
      image: townhouseImage,
      featured: false,
      rating: 4.7,
      downloads: 145,
    },
    {
      id: 18,
      title: 'Contemporary Loft Townhouse',
      type: 'Townhouse',
      bedrooms: 2,
      bathrooms: 2,
      area: 1600,
      price: { basic: 1700, standard: 2100, premium: 2900 },
      image: townhouseImage,
      featured: false,
      rating: 4.5,
      downloads: 98,
    },

    // ADDITIONAL VILLAS - More Luxury Options
    {
      id: 19,
      title: 'Beachfront Villa',
      type: 'Villa',
      bedrooms: 5,
      bathrooms: 4,
      area: 3600,
      price: { basic: 2900, standard: 3700, premium: 5000 },
      image: villaImage,
      featured: true,
      rating: 4.9,
      downloads: 312,
    },
    {
      id: 20,
      title: 'Mountain View Villa',
      type: 'Villa',
      bedrooms: 4,
      bathrooms: 3,
      area: 2800,
      price: { basic: 2300, standard: 2900, premium: 3900 },
      image: villaImage,
      featured: false,
      rating: 4.7,
      downloads: 167,
    },
    {
      id: 21,
      title: 'Garden Estate Villa',
      type: 'Villa',
      bedrooms: 6,
      bathrooms: 5,
      area: 4200,
      price: { basic: 3300, standard: 4200, premium: 5700 },
      image: villaImage,
      featured: false,
      rating: 4.8,
      downloads: 245,
    },
    {
      id: 22,
      title: 'Modern Farmhouse Villa',
      type: 'Villa',
      bedrooms: 4,
      bathrooms: 3,
      area: 2600,
      price: { basic: 2100, standard: 2700, premium: 3700 },
      image: villaImage,
      featured: false,
      rating: 4.6,
      downloads: 134,
    },

    // ADDITIONAL BUNGALOWS - More Family Options
    {
      id: 23,
      title: 'Ranch Style Bungalow',
      type: 'Bungalow',
      bedrooms: 3,
      bathrooms: 2,
      area: 1700,
      price: { basic: 1800, standard: 2200, premium: 3000 },
      image: bungalowImage,
      featured: false,
      rating: 4.5,
      downloads: 112,
    },
    {
      id: 24,
      title: 'Cottage Style Bungalow',
      type: 'Bungalow',
      bedrooms: 2,
      bathrooms: 2,
      area: 1300,
      price: { basic: 1600, standard: 2000, premium: 2700 },
      image: bungalowImage,
      featured: false,
      rating: 4.4,
      downloads: 89,
    },
    {
      id: 25,
      title: 'Modern Split-Level Bungalow',
      type: 'Bungalow',
      bedrooms: 4,
      bathrooms: 3,
      area: 2000,
      price: { basic: 2000, standard: 2500, premium: 3400 },
      image: bungalowImage,
      featured: true,
      rating: 4.7,
      downloads: 178,
    },
    {
      id: 26,
      title: 'Traditional Courtyard Bungalow',
      type: 'Bungalow',
      bedrooms: 3,
      bathrooms: 2,
      area: 1500,
      price: { basic: 1700, standard: 2100, premium: 2900 },
      image: bungalowImage,
      featured: false,
      rating: 4.6,
      downloads: 134,
    },

    // ADDITIONAL TOWNHOUSES - More Urban Options
    {
      id: 27,
      title: 'Modern Terrace Townhouse',
      type: 'Townhouse',
      bedrooms: 3,
      bathrooms: 2,
      area: 1900,
      price: { basic: 1900, standard: 2300, premium: 3200 },
      image: townhouseImage,
      featured: false,
      rating: 4.5,
      downloads: 123,
    },
    {
      id: 28,
      title: 'Luxury Corner Townhouse',
      type: 'Townhouse',
      bedrooms: 4,
      bathrooms: 3,
      area: 2300,
      price: { basic: 2200, standard: 2700, premium: 3700 },
      image: townhouseImage,
      featured: false,
      rating: 4.6,
      downloads: 145,
    },
    {
      id: 29,
      title: 'Modern End Unit Townhouse',
      type: 'Townhouse',
      bedrooms: 3,
      bathrooms: 2,
      area: 2000,
      price: { basic: 2000, standard: 2400, premium: 3300 },
      image: townhouseImage,
      featured: false,
      rating: 4.5,
      downloads: 112,
    },
    {
      id: 30,
      title: 'Contemporary Middle Unit Townhouse',
      type: 'Townhouse',
      bedrooms: 2,
      bathrooms: 2,
      area: 1700,
      price: { basic: 1800, standard: 2200, premium: 3000 },
      image: townhouseImage,
      featured: false,
      rating: 4.4,
      downloads: 98,
    },
  ];

  // Filter plans based on all criteria
  const filteredPlans = plans.filter(plan => {
    // Search filter
    const matchesSearch = plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Type filter
    const matchesType = selectedType === 'all' || plan.type.toLowerCase() === selectedType.toLowerCase();
    
    // Bedrooms filter
    const matchesBedrooms = selectedBedrooms === 'all' || plan.bedrooms >= parseInt(selectedBedrooms);
    
    // Price filter
    let matchesPrice = true;
    if (selectedPrice === 'low') {
      matchesPrice = plan.price.basic < 2000;
    } else if (selectedPrice === 'mid') {
      matchesPrice = plan.price.basic >= 2000 && plan.price.basic <= 3500;
    } else if (selectedPrice === 'high') {
      matchesPrice = plan.price.basic > 3500;
    }
    
    return matchesSearch && matchesType && matchesBedrooms && matchesPrice;
  });

  // Sort plans
  const sortedPlans = [...filteredPlans].sort((a, b) => {
    switch (selectedSort) {
      case 'featured':
        return b.featured ? 1 : -1;
      case 'price-low':
        return a.price.basic - b.price.basic;
      case 'price-high':
        return b.price.basic - a.price.basic;
      case 'rating':
        return b.rating - a.rating;
      case 'downloads':
        return b.downloads - a.downloads;
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
                  src={plan.image}
                  alt={plan.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <Badge variant="secondary" className="text-xs mb-2">
                    {plan.type}
                  </Badge>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      {plan.rating}
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      {plan.downloads}
                    </div>
                  </div>
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
                    {plan.area} sq ft
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <Button 
                    variant="cta" 
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