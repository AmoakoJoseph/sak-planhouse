import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Heart, 
  Eye, 
  ShoppingBag,
  Plus,
  Trash2,
  Star,
  Bed,
  Bath,
  Square,
  Home,
  Building,
  MapPin,
  Calendar
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import villaImage from '@/assets/villa-plan.jpg';
import bungalowImage from '@/assets/bungalow-plan.jpg';
import townhouseImage from '@/assets/townhouse-plan.jpg';

const UserFavorites = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [favorites, setFavorites] = useState<any[]>([]);

  // Mock favorites data - in a real app, this would come from your backend
  const mockFavorites = [
    {
      id: 1,
      title: 'Luxury Villa Paradise',
      type: 'Villa',
      bedrooms: 5,
      bathrooms: 4,
      area: 3200,
      price: 4500,
      image: villaImage,
      architect: 'Samuel Kwame Architecture',
      rating: 4.9,
      reviews: 47,
      addedDate: '2024-01-15',
      featured: true,
      description: 'This stunning luxury villa combines contemporary African design with modern amenities.'
    },
    {
      id: 7,
      title: 'Modern Family Bungalow',
      type: 'Bungalow',
      bedrooms: 3,
      bathrooms: 2,
      area: 1800,
      price: 3100,
      image: bungalowImage,
      architect: 'Ama Osei Architecture',
      rating: 4.7,
      reviews: 34,
      addedDate: '2024-01-12',
      featured: false,
      description: 'A modern family bungalow designed for comfort and functionality.'
    },
    {
      id: 13,
      title: 'Contemporary Townhouse',
      type: 'Townhouse',
      bedrooms: 4,
      bathrooms: 3,
      area: 2400,
      price: 3800,
      image: townhouseImage,
      architect: 'Kwame Asante Architecture',
      rating: 4.8,
      reviews: 41,
      addedDate: '2024-01-10',
      featured: true,
      description: 'A contemporary townhouse designed for urban living with modern aesthetics.'
    },
    {
      id: 2,
      title: 'Executive Villa Estate',
      type: 'Villa',
      bedrooms: 6,
      bathrooms: 5,
      area: 4100,
      price: 5500,
      image: villaImage,
      architect: 'Samuel Kwame Architecture',
      rating: 4.9,
      reviews: 52,
      addedDate: '2024-01-08',
      featured: false,
      description: 'An executive villa designed for luxury living with premium finishes.'
    },
    {
      id: 8,
      title: 'Coastal Bungalow Retreat',
      type: 'Bungalow',
      bedrooms: 4,
      bathrooms: 3,
      area: 2200,
      price: 2800,
      image: bungalowImage,
      architect: 'Ama Osei Architecture',
      rating: 4.6,
      reviews: 28,
      addedDate: '2024-01-05',
      featured: false,
      description: 'A beautiful coastal bungalow with ocean views and modern amenities.'
    },
    {
      id: 14,
      title: 'Urban Townhouse Complex',
      type: 'Townhouse',
      bedrooms: 3,
      bathrooms: 2,
      area: 2000,
      price: 3200,
      image: townhouseImage,
      architect: 'Kwame Asante Architecture',
      rating: 4.5,
      reviews: 35,
      addedDate: '2024-01-03',
      featured: false,
      description: 'Modern urban townhouse perfect for city living.'
    }
  ];

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // In a real app, you would fetch favorites from your backend
    setFavorites(mockFavorites);
  }, [user, navigate]);

  const filteredFavorites = favorites.filter(favorite => {
    const matchesSearch = favorite.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         favorite.architect.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || favorite.type.toLowerCase() === typeFilter;
    const matchesPrice = priceFilter === 'all' || 
                        (priceFilter === 'low' && favorite.price <= 3000) ||
                        (priceFilter === 'medium' && favorite.price > 3000 && favorite.price <= 4500) ||
                        (priceFilter === 'high' && favorite.price > 4500);
    
    return matchesSearch && matchesType && matchesPrice;
  });

  const removeFavorite = (planId: number) => {
    setFavorites(prev => prev.filter(fav => fav.id !== planId));
  };

  const getTypeStats = () => {
    const total = favorites.length;
    const villas = favorites.filter(f => f.type === 'Villa').length;
    const bungalows = favorites.filter(f => f.type === 'Bungalow').length;
    const townhouses = favorites.filter(f => f.type === 'Townhouse').length;
    const totalValue = favorites.reduce((sum, f) => sum + f.price, 0);

    return { total, villas, bungalows, townhouses, totalValue };
  };

  const stats = getTypeStats();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-construction-gray-light">
      {/* Header */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/user/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>

            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">My Favorites</h1>
                <p className="text-muted-foreground">Your saved house plans and designs</p>
              </div>
              <Button asChild>
                <Link to="/plans">
                  <Plus className="h-4 w-4 mr-2" />
                  Browse More Plans
                </Link>
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-500/10 rounded-lg">
                      <Heart className="h-6 w-6 text-red-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Favorites</p>
                      <p className="text-2xl font-bold">{stats.total}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Home className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Villas</p>
                      <p className="text-2xl font-bold">{stats.villas}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-500/10 rounded-lg">
                      <Building className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Bungalows</p>
                      <p className="text-2xl font-bold">{stats.bungalows}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-lg">
                      <MapPin className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Townhouses</p>
                      <p className="text-2xl font-bold">{stats.townhouses}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Favorites Content */}
      <section className="py-16">
        <div className="container px-4">
          <div className="max-w-7xl mx-auto">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search favorites by plan name or architect..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="villa">Villas</SelectItem>
                  <SelectItem value="bungalow">Bungalows</SelectItem>
                  <SelectItem value="townhouse">Townhouses</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="low">Under ₵3,000</SelectItem>
                  <SelectItem value="medium">₵3,000 - ₵4,500</SelectItem>
                  <SelectItem value="high">Over ₵4,500</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Favorites Grid */}
            {filteredFavorites.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No favorites found</h3>
                  <p className="text-muted-foreground mb-6">
                    {searchTerm || typeFilter !== 'all' || priceFilter !== 'all'
                      ? 'Try adjusting your search or filters'
                      : 'You haven\'t added any plans to your favorites yet'
                    }
                  </p>
                  <Button asChild>
                    <Link to="/plans">Browse Plans</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFavorites.map((plan) => (
                  <Card key={plan.id} className="group hover:shadow-construction transition-all duration-300">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={plan.image}
                        alt={plan.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute top-2 right-2 flex gap-2">
                        {plan.featured && (
                          <Badge className="bg-primary text-primary-foreground">
                            Featured
                          </Badge>
                        )}
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0 rounded-full bg-white/90 hover:bg-white"
                          onClick={() => removeFavorite(plan.id)}
                        >
                          <Heart className="h-4 w-4 fill-current text-red-500" />
                        </Button>
                      </div>
                    </div>
                    
                    <CardHeader>
                      <CardTitle className="text-lg">{plan.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {plan.description}
                      </CardDescription>
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
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 fill-current text-yellow-400" />
                          <span className="text-sm font-medium">{plan.rating}</span>
                          <span className="text-sm text-muted-foreground">({plan.reviews})</span>
                        </div>
                        <Badge variant="outline">{plan.type}</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-semibold text-primary">₵{plan.price}</p>
                          <p className="text-sm text-muted-foreground">{plan.architect}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/plans/${plan.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Link>
                          </Button>
                          <Button size="sm" asChild>
                            <Link to={`/plans/${plan.id}`}>
                              <ShoppingBag className="h-4 w-4 mr-2" />
                              Buy
                            </Link>
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Added {new Date(plan.addedDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Quick Actions */}
            {filteredFavorites.length > 0 && (
              <div className="mt-12">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>
                      Manage your favorites and discover new plans
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      <Button variant="outline" className="justify-start" asChild>
                        <Link to="/plans">
                          <Plus className="h-4 w-4 mr-3" />
                          Browse More Plans
                        </Link>
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Trash2 className="h-4 w-4 mr-3" />
                        Clear All Favorites
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Heart className="h-4 w-4 mr-3" />
                        Share Favorites
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserFavorites;
