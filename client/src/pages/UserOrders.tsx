import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Calendar,
  ShoppingBag,
  CreditCard,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Star,
  Bed,
  Bath,
  Square,
  X
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import FloatingNav from '@/components/FloatingNav';
import villaImage from '@/assets/villa-plan.jpg';
import bungalowImage from '@/assets/bungalow-plan.jpg';
import townhouseImage from '@/assets/townhouse-plan.jpg';

const UserOrders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedOrderForDownload, setSelectedOrderForDownload] = useState<string | null>(null);

  console.log('UserOrders component rendering, user:', user ? { id: user.id, email: user.email } : 'No user');

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;

    try {
      // Fetch real orders from API
      const response = await fetch(`/api/orders?userId=${user.id}`);
      if (!response.ok) throw new Error('Failed to fetch orders');
      
      const orders = await response.json();
      
      // Transform orders to match the expected format
      const transformedOrders = await Promise.all(orders.map(async (order: any) => {
        // Fetch plan details for each order
        const planResponse = await fetch(`/api/plans/${order.plan_id}`);
        const plan = await planResponse.json();
        
        return {
          id: order.id,
          planTitle: plan.title,
          planType: plan.plan_type,
          packageType: order.tier,
          amount: parseFloat(order.amount),
          paymentMethod: 'paystack',
          status: order.status,
          createdAt: new Date(order.created_at).toLocaleDateString(),
          architect: 'SAKConstruction',
          image: plan.image_url || villaImage, // Fallback to default image
          bedrooms: plan.bedrooms,
          bathrooms: plan.bathrooms,
          area: plan.area_sqft,
          downloadCount: 0, // TODO: Implement download tracking
          downloadExpiry: null // TODO: Implement expiry logic
        };
      }));
      
      setOrders(transformedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

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
          <p className="text-muted-foreground">Loading orders...</p>
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
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'processing':
        return <Clock className="h-4 w-4" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4" />;
      case 'cancelled':
        return <X className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.plans?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesTab = activeTab === 'all' || order.status === activeTab;

    return matchesSearch && matchesStatus && matchesTab;
  });

  const getOrderStats = () => {
    const total = orders.length;
    const completed = orders.filter(o => o.status === 'completed').length;
    const processing = orders.filter(o => o.status === 'processing').length;
    const pending = orders.filter(o => o.status === 'pending').length;
    const totalSpent = orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.amount, 0);

    return { total, completed, processing, pending, totalSpent };
  };

  const stats = getOrderStats();

  if (!user) {
    console.log('UserOrders: No user, showing loading screen');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading orders...</p>
        </div>
      </div>
    );
  }

  console.log('UserOrders: User exists, rendering main content with FloatingNav');
  
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
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <ShoppingBag className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Orders</p>
                      <p className="text-2xl font-bold">{stats.total}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-500/10 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Completed</p>
                      <p className="text-2xl font-bold">{stats.completed}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-yellow-500/10 rounded-lg">
                      <Clock className="h-6 w-6 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Processing</p>
                      <p className="text-2xl font-bold">{stats.processing}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-lg">
                      <CreditCard className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Spent</p>
                      <p className="text-2xl font-bold">₵{stats.totalSpent.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Orders Content */}
      <section className="py-16">
        <div className="container px-4">
          <div className="max-w-7xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All Orders ({stats.total})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({stats.completed})</TabsTrigger>
                <TabsTrigger value="processing">Processing ({stats.processing})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-6">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search orders by plan name or order ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Orders List */}
                <div className="space-y-6">
                  {filteredOrders.length === 0 ? (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No orders found</h3>
                        <p className="text-muted-foreground mb-6">
                          {searchTerm || statusFilter !== 'all' 
                            ? 'Try adjusting your search or filters'
                            : 'You haven\'t placed any orders yet'
                          }
                        </p>
                        <Button asChild>
                          <Link to="/plans">Browse Plans</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    filteredOrders.map((order) => (
                      <Card key={order.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex flex-col lg:flex-row">
                            {/* Order Image */}
                            <div className="lg:w-64 h-48 lg:h-auto">
                              <img
                                src={order.image || villaImage}
                                alt={order.planTitle}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* Order Details */}
                            <div className="flex-1 p-6">
                              <div className="flex items-start justify-between mb-4">
                                <div>
                                  <h3 className="text-xl font-semibold mb-2">{order.planTitle}</h3>
                                  <p className="text-muted-foreground mb-2">{order.packageType} Package</p>
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span>Order ID: {order.id}</span>
                                    <span>Date: {new Date(order.createdAt).toLocaleDateString()}</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <Badge className={`${getStatusColor(order.status)} mb-2`}>
                                    {getStatusIcon(order.status)}
                                    <span className="ml-1 capitalize">{order.status}</span>
                                  </Badge>
                                  <p className="text-2xl font-bold text-primary">₵{order.amount}</p>
                                </div>
                              </div>

                              {/* Package Info */}
                              <div className="mb-4">
                                <h4 className="font-medium mb-2">Package Details:</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="text-muted-foreground">Plan Type:</span> {order.planType}
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Bedrooms:</span> {order.bedrooms}
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Bathrooms:</span> {order.bathrooms}
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Area:</span> {order.area} sq ft
                                  </div>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center justify-between pt-4 border-t">
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm">
                                    <Eye className="w-3 h-3 mr-1" />
                                    View Details
                                  </Button>
                                  {order.status === 'completed' && (
                                    <Button 
                                      variant="default" 
                                      size="sm"
                                      asChild
                                    >
                                      <Link to={`/user/downloads/${order.id}`}>
                                        <Download className="w-3 h-3 mr-1" />
                                        Download
                                      </Link>
                                    </Button>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button variant="outline" size="sm">
                                    <FileText className="h-4 w-4 mr-2" />
                                    Invoice
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserOrders;