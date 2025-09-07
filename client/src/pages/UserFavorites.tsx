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
import { useFavorites } from '@/hooks/useFavorites';
import FloatingNav from '@/components/FloatingNav';
import villaImage from '@/assets/villa-plan.jpg';
import bungalowImage from '@/assets/bungalow-plan.jpg';
import townhouseImage from '@/assets/townhouse-plan.jpg';

const UserFavorites = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { favorites, loading, removeFavorite } = useFavorites();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
  }, [user, navigate]);

  const filteredFavorites = favorites.filter(favorite => {
    if (!favorite.plan) return false;
    
    const plan = favorite.plan;
    const matchesSearch = plan.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || plan.plan_type.toLowerCase() === typeFilter;
    const planPrice = parseFloat(plan.standard_price || '0');
    const matchesPrice = priceFilter === 'all' || 
                        (priceFilter === 'low' && planPrice <= 3000) ||
                        (priceFilter === 'medium' && planPrice > 3000 && planPrice <= 4500) ||
                        (priceFilter === 'high' && planPrice > 4500);
    
    return matchesSearch && matchesType && matchesPrice;
  });

  const handleRemoveFavorite = async (planId: string) => {
    const success = await removeFavorite(planId);
    if (!success) {
      alert('Failed to remove favorite. Please try again.');
    }
  };

  const getTypeStats = () => {
    const total = favorites.length;
    const villas = favorites.filter(f => f.plan?.plan_type === 'villa').length;
    const bungalows = favorites.filter(f => f.plan?.plan_type === 'bungalow').length;
    const townhouses = favorites.filter(f => f.plan?.plan_type === 'townhouse').length;
    const totalValue = favorites.reduce((sum, f) => sum + parseFloat(f.plan?.standard_price || '0'), 0);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-construction-gray-light">
        <FloatingNav />
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your favorites...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-construction-gray-light">
      <FloatingNav />

      {/* Stats Cards */}
      <section className="py-16">
        <div className="container px-4">
          <div className="max-w-7xl mx-auto">
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
                {filteredFavorites.map((favorite) => {
                  const plan = favorite.plan;
                  if (!plan) return null;
                  
                  return (
                    <Card key={favorite.id} className="group hover:shadow-construction transition-all duration-300">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={plan.image_url || '/placeholder.svg'}
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
                            onClick={() => handleRemoveFavorite(plan.id)}
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
                            {plan.area_sqft} sq ft
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 fill-current text-yellow-400" />
                            <span className="text-sm font-medium">4.5</span>
                            <span className="text-sm text-muted-foreground">(0)</span>
                          </div>
                          <Badge variant="outline" className="capitalize">{plan.plan_type}</Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-lg font-semibold text-primary">₵{plan.standard_price}</p>
                            <p className="text-sm text-muted-foreground">SAK Constructions</p>
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
                            <span>Added {new Date(favorite.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
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
