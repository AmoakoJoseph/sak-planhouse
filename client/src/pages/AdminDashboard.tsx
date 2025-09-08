import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  FileText, 
  ShoppingCart, 
  TrendingUp, 
  BarChart3, 
  Settings, 
  DollarSign,
  ArrowUpRight,
  Calendar,
  Target,
  Award,
  Activity
} from 'lucide-react';
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
      const [analyticsResponse, ordersResponse, plansResponse] = await Promise.all([
        fetch('/api/analytics'),
        fetch('/api/orders'),
        fetch('/api/plans?featured=true')
      ]);

      const analytics = await analyticsResponse.json();
      const allOrders = await ordersResponse.json();
      const featuredPlans = await plansResponse.json();

      setStats({
        totalUsers: analytics.overview?.totalUsers || 0,
        totalPlans: analytics.planMetrics?.totalPlans || 0,
        totalOrders: analytics.overview?.totalOrders || 0,
        totalRevenue: analytics.overview?.totalRevenue || 0,
        recentOrders: allOrders.slice(0, 5) || [],
        featuredPlans: featuredPlans.slice(0, 5) || []
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setStats({
        totalUsers: 0,
        totalPlans: 0,
        totalOrders: 0,
        totalRevenue: 0,
        recentOrders: [],
        featuredPlans: []
      });
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
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-6"></div>
          <p className="text-xl text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: any) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : Number(amount);
    return `₵${(isNaN(numAmount) ? 0 : numAmount).toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Welcome Section */}
        <div className="mb-6 md:mb-8">
          <div className="admin-card">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Welcome back, Admin! 👋</h1>
                <p className="text-muted-foreground">Here's what's happening with your platform today.</p>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Badge variant="outline" className="px-4 py-2 w-fit">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="metric-card group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Total Users</p>
                <p className="text-3xl font-bold text-foreground">{stats.totalUsers}</p>
                <p className="text-sm text-success mt-1 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +12% from last month
                </p>
              </div>
              <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                <Users className="w-8 h-8 text-primary" />
              </div>
            </div>
          </div>

          {/* Total Plans */}
          <div className="metric-card group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Total Plans</p>
                <p className="text-3xl font-bold text-foreground">{stats.totalPlans}</p>
                <p className="text-sm text-success mt-1 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +5 new this week
                </p>
              </div>
              <div className="p-3 bg-secondary/10 rounded-xl group-hover:bg-secondary/20 transition-colors">
                <FileText className="w-8 h-8 text-secondary" />
              </div>
            </div>
          </div>

          {/* Total Orders */}
          <div className="metric-card group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Total Orders</p>
                <p className="text-3xl font-bold text-foreground">{stats.totalOrders}</p>
                <p className="text-sm text-success mt-1 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +8% from last week
                </p>
              </div>
              <div className="p-3 bg-accent/10 rounded-xl group-hover:bg-accent/20 transition-colors">
                <ShoppingCart className="w-8 h-8 text-accent" />
              </div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="metric-card group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Total Revenue</p>
                <p className="text-3xl font-bold text-foreground">{formatCurrency(stats.totalRevenue)}</p>
                <p className="text-sm text-success mt-1 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +15% from last month
                </p>
              </div>
              <div className="p-3 bg-warning/10 rounded-xl group-hover:bg-warning/20 transition-colors">
                <DollarSign className="w-8 h-8 text-warning" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Button 
            variant="outline" 
            className="admin-card h-auto p-6 flex flex-col items-center justify-center space-y-3 hover:shadow-xl transition-all duration-300 group"
            onClick={() => navigate('/admin/analytics')}
          >
            <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
              <BarChart3 className="w-8 h-8 text-primary" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-foreground">View Analytics</h3>
              <p className="text-sm text-muted-foreground">Detailed insights</p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Button>

          <Button 
            variant="outline" 
            className="admin-card h-auto p-6 flex flex-col items-center justify-center space-y-3 hover:shadow-xl transition-all duration-300 group"
            onClick={() => navigate('/admin/plans')}
          >
            <div className="p-3 bg-secondary/10 rounded-xl group-hover:bg-secondary/20 transition-colors">
              <FileText className="w-8 h-8 text-secondary" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-foreground">Manage Plans</h3>
              <p className="text-sm text-muted-foreground">Add & edit plans</p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-secondary group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Button>

          <Button 
            variant="outline" 
            className="admin-card h-auto p-6 flex flex-col items-center justify-center space-y-3 hover:shadow-xl transition-all duration-300 group"
            onClick={() => navigate('/admin/orders')}
          >
            <div className="p-3 bg-accent/10 rounded-xl group-hover:bg-accent/20 transition-colors">
              <ShoppingCart className="w-8 h-8 text-accent" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-foreground">View Orders</h3>
              <p className="text-sm text-muted-foreground">Track sales</p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Button>

          <Button 
            variant="outline" 
            className="admin-card h-auto p-6 flex flex-col items-center justify-center space-y-3 hover:shadow-xl transition-all duration-300 group"
            onClick={() => navigate('/admin/users')}
          >
            <div className="p-3 bg-warning/10 rounded-xl group-hover:bg-warning/20 transition-colors">
              <Users className="w-8 h-8 text-warning" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-foreground">Manage Users</h3>
              <p className="text-sm text-muted-foreground">User management</p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-warning group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Button>
        </div>

        {/* Recent Activity & Featured Plans */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="admin-card">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Recent Orders
                  </CardTitle>
              <CardDescription>Latest plan purchases</CardDescription>
                </div>
                <Badge variant="secondary" className="px-3 py-1">
                  {stats.recentOrders.length} orders
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {stats.recentOrders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">No Orders Yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Orders will appear here once customers start purchasing plans.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {stats.recentOrders.map((order, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <ShoppingCart className="w-5 h-5 text-primary" />
                        </div>
                      <div>
                          <p className="font-medium text-foreground">Order #{order.id?.slice(0, 8)}</p>
                          <p className="text-sm text-muted-foreground">{order.tier} package</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">{formatCurrency(order.amount)}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </div>

          {/* Featured Plans */}
          <div className="admin-card">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    Featured Plans
                  </CardTitle>
                  <CardDescription>Top performing plans</CardDescription>
                </div>
                <Badge variant="secondary" className="px-3 py-1">
                  {stats.featuredPlans.length} plans
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {stats.featuredPlans.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">No Featured Plans</h3>
                  <p className="text-sm text-muted-foreground">
                    Add some plans and mark them as featured to see them here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {stats.featuredPlans.map((plan, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                          <FileText className="w-5 h-5 text-secondary" />
                        </div>
                      <div>
                          <p className="font-medium text-foreground">{plan.title}</p>
                          <p className="text-sm text-muted-foreground">{plan.plan_type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">₵{plan.basic_price}</p>
                        <Badge variant="outline" className="text-xs">
                          {plan.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8">
          <div className="admin-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Platform Overview
              </CardTitle>
              <CardDescription>Key metrics and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 rounded-xl bg-primary/10 border border-primary/20">
                  <div className="text-3xl font-bold text-primary mb-2">{stats.totalUsers}</div>
                  <div className="text-sm text-muted-foreground">Registered Users</div>
                </div>
                <div className="text-center p-6 rounded-xl bg-secondary/10 border border-secondary/20">
                  <div className="text-3xl font-bold text-secondary mb-2">{stats.totalPlans}</div>
                  <div className="text-sm text-muted-foreground">Available Plans</div>
                </div>
                <div className="text-center p-6 rounded-xl bg-accent/10 border border-accent/20">
                  <div className="text-3xl font-bold text-accent mb-2">{stats.totalOrders}</div>
                  <div className="text-sm text-muted-foreground">Total Orders</div>
                </div>
              </div>
            </CardContent>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;