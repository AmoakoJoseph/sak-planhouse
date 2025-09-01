import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, FileText, ShoppingCart, TrendingUp, LogOut, Settings } from 'lucide-react';

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
      // Fetch users count
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch plans count
      const { count: plansCount } = await supabase
        .from('plans')
        .select('*', { count: 'exact', head: true });

      // Fetch orders count and revenue
      const { data: orders, count: ordersCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact' });

      const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.amount), 0) || 0;

      // Fetch recent orders with plan details
      const { data: recentOrders } = await supabase
        .from('orders')
        .select(`
          *,
          plans:plan_id (title, plan_type),
          profiles:user_id (first_name, last_name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch featured plans
      const { data: featuredPlans } = await supabase
        .from('plans')
        .select('*')
        .eq('featured', true)
        .eq('status', 'active')
        .limit(5);

      setStats({
        totalUsers: usersCount || 0,
        totalPlans: plansCount || 0,
        totalOrders: ordersCount || 0,
        totalRevenue,
        recentOrders: recentOrders || [],
        featuredPlans: featuredPlans || []
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-hover">
              <span className="text-lg font-bold text-primary-foreground">S</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">SAK Constructions Admin</h1>
              <p className="text-sm text-muted-foreground">Management Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

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
            className="h-20 flex-col"
            onClick={() => navigate('/admin/plans')}
          >
            <FileText className="w-6 h-6 mb-2" />
            Manage Plans
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex-col"
            onClick={() => navigate('/admin/orders')}
          >
            <ShoppingCart className="w-6 h-6 mb-2" />
            View Orders
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex-col"
            onClick={() => navigate('/admin/users')}
          >
            <Users className="w-6 h-6 mb-2" />
            Manage Users
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex-col"
          >
            <Settings className="w-6 h-6 mb-2" />
            Site Settings
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