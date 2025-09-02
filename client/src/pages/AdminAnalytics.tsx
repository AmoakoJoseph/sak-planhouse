
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingCart, 
  FileText, 
  DollarSign,
  Download,
  Calendar,
  Target
} from 'lucide-react';
import AdminHeader from '@/components/AdminHeader';

interface AnalyticsData {
  overview: {
    totalRevenue: number;
    revenueGrowth: number;
    totalOrders: number;
    ordersGrowth: number;
    totalUsers: number;
    usersGrowth: number;
    totalDownloads: number;
    downloadsGrowth: number;
  };
  planMetrics: {
    basicSales: number;
    standardSales: number;
    premiumSales: number;
    totalPlans: number;
  };
  recentActivity: Array<{
    id: string;
    type: 'order' | 'download' | 'user_signup';
    description: string;
    timestamp: string;
    amount?: number;
  }>;
  topPlans: Array<{
    id: string;
    title: string;
    sales: number;
    revenue: number;
    category: string;
  }>;
}

const AdminAnalytics = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    overview: {
      totalRevenue: 15420.50,
      revenueGrowth: 12.5,
      totalOrders: 145,
      ordersGrowth: 8.2,
      totalUsers: 89,
      usersGrowth: 15.3,
      totalDownloads: 287,
      downloadsGrowth: 22.1,
    },
    planMetrics: {
      basicSales: 65,
      standardSales: 45,
      premiumSales: 35,
      totalPlans: 12,
    },
    recentActivity: [
      {
        id: '1',
        type: 'order',
        description: 'Premium Villa Plan purchased by John Doe',
        timestamp: '2 hours ago',
        amount: 200.00,
      },
      {
        id: '2',
        type: 'download',
        description: 'Standard files downloaded by Jane Smith',
        timestamp: '4 hours ago',
      },
      {
        id: '3',
        type: 'user_signup',
        description: 'New user registration: Mike Johnson',
        timestamp: '6 hours ago',
      },
    ],
    topPlans: [
      {
        id: '1',
        title: 'Modern Villa Design',
        sales: 24,
        revenue: 4800.00,
        category: 'Villa',
      },
      {
        id: '2',
        title: 'Contemporary Bungalow',
        sales: 18,
        revenue: 2700.00,
        category: 'Bungalow',
      },
      {
        id: '3',
        title: 'Luxury Townhouse',
        sales: 15,
        revenue: 3750.00,
        category: 'Townhouse',
      },
    ],
  });
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchAnalytics();
    }
  }, [user, isAdmin]);

  const fetchAnalytics = async () => {
    try {
      // In a real app, this would fetch from your API
      // For now, we're using mock data
      setTimeout(() => {
        setLoadingAnalytics(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoadingAnalytics(false);
    }
  };

  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => `₵${amount.toFixed(2)}`;
  const formatGrowth = (growth: number) => (
    <div className={`flex items-center ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
      {growth >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
      <span className="text-sm font-medium">{Math.abs(growth)}%</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      <AdminHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Track performance and insights</p>
          </div>
          <Badge variant="outline" className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Last 30 days</span>
          </Badge>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(analytics.overview.totalRevenue)}</div>
                  {formatGrowth(analytics.overview.revenueGrowth)}
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500/5 to-blue-500/10 border-blue-500/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.overview.totalOrders}</div>
                  {formatGrowth(analytics.overview.ordersGrowth)}
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.overview.totalUsers}</div>
                  {formatGrowth(analytics.overview.usersGrowth)}
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500/5 to-purple-500/10 border-purple-500/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
                  <Download className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.overview.totalDownloads}</div>
                  {formatGrowth(analytics.overview.downloadsGrowth)}
                </CardContent>
              </Card>
            </div>

            {/* Plan Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Plan Distribution</span>
                </CardTitle>
                <CardDescription>Sales breakdown by plan type</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Basic Plans</span>
                    <span className="text-sm text-muted-foreground">{analytics.planMetrics.basicSales} sales</span>
                  </div>
                  <Progress value={(analytics.planMetrics.basicSales / analytics.overview.totalOrders) * 100} className="h-2" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Standard Plans</span>
                    <span className="text-sm text-muted-foreground">{analytics.planMetrics.standardSales} sales</span>
                  </div>
                  <Progress value={(analytics.planMetrics.standardSales / analytics.overview.totalOrders) * 100} className="h-2" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Premium Plans</span>
                    <span className="text-sm text-muted-foreground">{analytics.planMetrics.premiumSales} sales</span>
                  </div>
                  <Progress value={(analytics.planMetrics.premiumSales / analytics.overview.totalOrders) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sales" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Plans</CardTitle>
                <CardDescription>Best selling construction plans</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.topPlans.map((plan, index) => (
                    <div key={plan.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <span className="text-sm font-bold text-primary">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{plan.title}</p>
                          <p className="text-sm text-muted-foreground">{plan.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(plan.revenue)}</p>
                        <p className="text-sm text-muted-foreground">{plan.sales} sales</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest platform activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        activity.type === 'order' ? 'bg-green-500/10 text-green-500' :
                        activity.type === 'download' ? 'bg-blue-500/10 text-blue-500' :
                        'bg-purple-500/10 text-purple-500'
                      }`}>
                        {activity.type === 'order' && <ShoppingCart className="h-5 w-5" />}
                        {activity.type === 'download' && <Download className="h-5 w-5" />}
                        {activity.type === 'user_signup' && <Users className="h-5 w-5" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.description}</p>
                        <p className="text-sm text-muted-foreground">{activity.timestamp}</p>
                      </div>
                      {activity.amount && (
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(activity.amount)}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminAnalytics;
