import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, FileText, ShoppingCart, TrendingUp, BarChart3, Settings } from 'lucide-react';
import AdminHeader from '@/components/AdminHeader';

interface DashboardStats {
  totalUsers: number;
  totalPlans: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: any[];
  featuredPlans: any[];
}

const AdminDashboard = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalPlans: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
    featuredPlans: []
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchDashboardStats();
    }
  }, [user, isAdmin]);

  const fetchDashboardStats = async () => {
    try {
      // Mock data for now
      setStats({
        totalUsers: 0,
        totalPlans: 4,
        totalOrders: 0,
        totalRevenue: 0,
        recentOrders: [],
        featuredPlans: []
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      <AdminHeader />

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">Registered customers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Plans</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPlans}</div>
              <p className="text-xs text-muted-foreground">Available construction plans</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">Plans purchased</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₵{stats.totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Gross revenue</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Button 
            className="h-20 flex-col bg-gradient-to-br from-primary to-primary-hover hover:from-primary-hover hover:to-primary"
            onClick={() => navigate('/admin/analytics')}
          >
            <BarChart3 className="w-6 h-6 mb-2" />
            View Analytics
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex-col hover:bg-accent/50"
            onClick={() => navigate('/admin/plans')}
          >
            <FileText className="w-6 h-6 mb-2" />
            Manage Plans
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex-col hover:bg-accent/50"
            onClick={() => navigate('/admin/orders')}
          >
            <ShoppingCart className="w-6 h-6 mb-2" />
            View Orders
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex-col hover:bg-accent/50"
            onClick={() => navigate('/admin/users')}
          >
            <Users className="w-6 h-6 mb-2" />
            Manage Users
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest plan purchases</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingStats ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-12 bg-muted animate-pulse rounded"></div>
                  ))}
                </div>
              ) : stats.recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{order.plans?.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.profiles?.first_name} {order.profiles?.last_name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₵{Number(order.amount).toFixed(2)}</p>
                        <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No orders yet</p>
              )}
            </CardContent>
          </Card>

          {/* Featured Plans */}
          <Card>
            <CardHeader>
              <CardTitle>Featured Plans</CardTitle>
              <CardDescription>Currently promoted plans</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingStats ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-12 bg-muted animate-pulse rounded"></div>
                  ))}
                </div>
              ) : stats.featuredPlans.length > 0 ? (
                <div className="space-y-4">
                  {stats.featuredPlans.map((plan) => (
                    <div key={plan.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{plan.title}</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {plan.plan_type} • {plan.bedrooms}BR/{plan.bathrooms}BA
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₵{Number(plan.basic_price).toFixed(2)}</p>
                        <Badge variant="outline">Featured</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No featured plans</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;