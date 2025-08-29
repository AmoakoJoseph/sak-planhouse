import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Grid, List, Star, Bed, Bath, Square, Download } from 'lucide-react';
import { useState } from 'react';
import villaImage from '@/assets/villa-plan.jpg';
import bungalowImage from '@/assets/bungalow-plan.jpg';
import townhouseImage from '@/assets/townhouse-plan.jpg';

const Plans = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  const plans = [
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
      id: 3,
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
      id: 4,
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
      id: 5,
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
      id: 6,
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
  ];

  const filteredPlans = plans.filter(plan =>
    plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              
              <Select>
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

              <Select>
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

              <Select>
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
              {filteredPlans.length} Plans Found
            </h2>
            <p className="text-muted-foreground">
              Professional architectural designs ready for download
            </p>
          </div>
          
          <Select>
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
          {filteredPlans.map((plan) => (
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
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-muted rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Basic</div>
                      <div className="text-sm font-semibold">₵{plan.price.basic}</div>
                    </div>
                    <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
                      <div className="text-xs text-primary mb-1">Standard</div>
                      <div className="text-sm font-semibold text-primary">₵{plan.price.standard}</div>
                    </div>
                    <div className="p-2 bg-muted rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Premium</div>
                      <div className="text-sm font-semibold">₵{plan.price.premium}</div>
                    </div>
                  </div>
                  
                  <Button variant="cta" className="w-full">
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