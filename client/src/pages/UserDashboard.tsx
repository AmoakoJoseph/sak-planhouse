import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Heart, 
  ShoppingBag, 
  Settings, 
  Download, 
  Star, 
  Calendar,
  MapPin,
  Phone,
  Mail,
  Edit,
  Plus,
  ArrowRight,
  Home,
  FileText,
  CreditCard
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useFavorites } from '@/hooks/useFavorites';
import villaImage from '@/assets/villa-plan.jpg';
import bungalowImage from '@/assets/bungalow-plan.jpg';
import townhouseImage from '@/assets/townhouse-plan.jpg';
import FloatingNav from '@/components/FloatingNav';

const UserDashboard = () => {
  const { user, profile, signOut } = useAuth();
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [userStats, setUserStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    favoritePlans: 0,
    downloads: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;
    
    try {
      // Fetch user analytics from API
      const analyticsResponse = await fetch(`/api/analytics/user/${user.id}`);
      if (!analyticsResponse.ok) throw new Error('Failed to fetch user analytics');
      
      const analytics = await analyticsResponse.json();
      
      setUserStats({
        totalOrders: analytics.totalOrders || 0,
        totalSpent: analytics.totalSpent || 0,
        favoritePlans: analytics.totalFavorites || 0,
        downloads: analytics.totalDownloads || 0
      });

      setRecentOrders(analytics.recentOrders || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };


  // Get favorite plans with plan details
  const favoritePlans = favorites
    .filter(fav => fav.plan) // Only include favorites that have plan data
    .slice(0, 3) // Show only first 3 for dashboard
    .map(fav => ({
      id: fav.plan.id,
      title: fav.plan.title,
      type: fav.plan.plan_type,
      bedrooms: fav.plan.bedrooms,
      bathrooms: fav.plan.bathrooms,
      area: fav.plan.area_sqft,
      price: fav.plan.basic_price,
      image: fav.plan.image_url || villaImage
    }));

  const recentActivity = [
    {
      type: 'purchase',
      message: 'Purchased Luxury Villa Paradise - Premium Package',
      date: '2024-01-15',
      amount: 4500
    },
    {
      type: 'favorite',
      message: 'Added Modern Family Bungalow to favorites',
      date: '2024-01-12'
    },
    {
      type: 'download',
      message: 'Downloaded Contemporary Townhouse plans',
      date: '2024-01-10'
    },
    {
      type: 'purchase',
      message: 'Purchased Modern Family Bungalow - Standard Package',
      date: '2024-01-10',
      amount: 2300
    }
  ];

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Use mock profile data if real profile is not available
  const userProfile = profile || {
    id: 'mock-id',
    user_id: user?.id || '',
    email: user?.email || '',
    first_name: 'John',
    last_name: 'Doe',
    role: 'user' as const,
    avatar_url: undefined
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <ShoppingBag className="h-4 w-4" />;
      case 'favorite':
        return <Heart className="h-4 w-4" />;
      case 'download':
        return <Download className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <FloatingNav />

      {/* Dashboard Content */}
      <section className="py-12">
        <div className="container px-4 mx-auto">
          {/* Page Header */}
          <div className="max-w-7xl mx-auto mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">Overview of your account and recent activity</p>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="favorites">Favorites</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-8">
                {/* Stats Cards */}
                <div className="grid md:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <ShoppingBag className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Orders</p>
                          <p className="text-2xl font-bold">{userStats.totalOrders}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-500/10 rounded-lg">
                          <CreditCard className="h-6 w-6 text-green-500" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Spent</p>
                          <p className="text-2xl font-bold">₵{userStats.totalSpent.toLocaleString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-500/10 rounded-lg">
                          <Heart className="h-6 w-6 text-red-500" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Favorite Plans</p>
                          <p className="text-2xl font-bold">{userStats.favoritePlans}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-lg">
                          <Download className="h-6 w-6 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Downloads</p>
                          <p className="text-2xl font-bold">{userStats.downloads}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Orders & Quick Actions */}
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Recent Orders */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5" />
                        Recent Orders
                      </CardTitle>
                      <CardDescription>Your latest plan purchases</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentOrders.slice(0, 3).map((order) => (
                          <div key={order.id} className="flex items-center gap-4 p-4 border rounded-lg">
                            <img
                              src={order.plans?.image_url || villaImage}
                              alt={order.plans?.title}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium">{order.plans?.title}</h4>
                              <p className="text-sm text-muted-foreground">{order.tier} Package</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className={getStatusColor(order.status)}>
                                  {order.status}
                                </Badge>
                                <span className="text-sm text-muted-foreground">₵{order.amount}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button variant="outline" className="w-full mt-4" asChild>
                        <Link to="/user/orders">
                          View All Orders
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Quick Actions
                      </CardTitle>
                      <CardDescription>Common tasks and shortcuts</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3">
                        <Button variant="outline" className="justify-start" asChild>
                          <Link to="/plans">
                            <Home className="h-4 w-4 mr-3" />
                            Browse House Plans
                          </Link>
                        </Button>
                        <Button variant="outline" className="justify-start" asChild>
                          <Link to="/user/favorites">
                            <Heart className="h-4 w-4 mr-3" />
                            View Favorites
                          </Link>
                        </Button>
                        <Button variant="outline" className="justify-start" asChild>
                          <Link to="/user/profile">
                            <User className="h-4 w-4 mr-3" />
                            Edit Profile
                          </Link>
                        </Button>
                        <Button variant="outline" className="justify-start" asChild>
                          <Link to="/user/settings">
                            <Settings className="h-4 w-4 mr-3" />
                            Account Settings
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="orders" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Order History</h3>
                  <Button asChild>
                    <Link to="/plans">
                      <Plus className="h-4 w-4 mr-2" />
                      Browse More Plans
                    </Link>
                  </Button>
                </div>

                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <Card key={order.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-6">
                          <img
                            src={order.image}
                            alt={order.planTitle}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-lg font-semibold">{order.planTitle}</h4>
                              <Badge className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground mb-2">{order.package}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>Order ID: {order.id}</span>
                              <span>Date: {new Date(order.date).toLocaleDateString()}</span>
                              <span className="font-semibold text-foreground">₵{order.amount}</span>
                            </div>
                          </div>
                          <Button variant="outline" asChild>
                            <Link to={`/plans/${order.id}`}>View Plan</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="favorites" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Favorite Plans</h3>
                  <Button asChild>
                    <Link to="/plans">
                      <Plus className="h-4 w-4 mr-2" />
                      Browse More Plans
                    </Link>
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoritePlans.map((plan) => (
                    <Card key={plan.id} className="group hover:shadow-construction transition-all duration-300">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={plan.image}
                          alt={plan.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute top-2 right-2">
                          <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                            <Heart className="h-4 w-4 fill-current text-red-500" />
                          </Button>
                        </div>
                      </div>
                      <CardHeader>
                        <CardTitle className="text-lg">{plan.title}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Home className="h-4 w-4" />
                            {plan.bedrooms}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4" />
                            {plan.bathrooms}
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            {plan.area} sq ft
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold text-primary">
                            ₵{plan.price}
                          </span>
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/plans/${plan.id}`}>View Details</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="activity" className="space-y-6">
                <h3 className="text-xl font-semibold">Recent Activity</h3>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{activity.message}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              {new Date(activity.date).toLocaleDateString()}
                              {activity.amount && (
                                <span className="font-semibold text-foreground">₵{activity.amount}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserDashboard;
