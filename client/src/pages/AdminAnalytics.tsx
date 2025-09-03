import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Download, 
  Calendar,
  BarChart3,
  Target,
  Activity,
  Award,
  Building2,
  FileText,
  ArrowUpRight,
  Eye,
  BarChart
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
  recentActivity: any[];
  topPlans: any[];
}

const AdminAnalytics = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

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
      setLoadingAnalytics(true);
      const [analyticsResponse, ordersResponse, plansResponse] = await Promise.all([
        fetch('/api/analytics'),
        fetch('/api/orders'),
        fetch('/api/plans')
      ]);

      if (!analyticsResponse.ok || !ordersResponse.ok || !plansResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const analyticsData = await analyticsResponse.json();
      const ordersData = await ordersResponse.json();
      const plansData = await plansResponse.json();

      // Calculate growth rates (mock for now since we need historical data)
      const revenueGrowth = 12.5;
      const ordersGrowth = 8.2;
      const usersGrowth = 15.3;
      const downloadsGrowth = 22.1;

      // Calculate plan metrics
      const basicSales = ordersData.filter((order: any) => order.tier === 'basic').length;
      const standardSales = ordersData.filter((order: any) => order.tier === 'standard').length;
      const premiumSales = ordersData.filter((order: any) => order.tier === 'premium').length;

      // Generate recent activity
      const recentActivity = ordersData.slice(0, 10).map((order: any, index: number) => ({
        id: order.id,
        type: 'order' as const,
        description: `${order.tier} package purchased`,
        timestamp: new Date(order.created_at).toLocaleDateString(),
        amount: parseFloat(order.amount)
      }));

      // Calculate top plans
      const planSales: { [key: string]: { plan: any, sales: number, revenue: number } } = {};
      ordersData.forEach((order: any) => {
        if (!planSales[order.plan_id]) {
          planSales[order.plan_id] = {
            plan: plansData.find((p: any) => p.id === order.plan_id),
            sales: 0,
            revenue: 0
          };
        }
        planSales[order.plan_id].sales++;
        planSales[order.plan_id].revenue += parseFloat(order.amount);
      });

      const topPlans = Object.values(planSales)
        .filter(item => item.plan)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)
        .map(item => ({
          id: item.plan.id,
          title: item.plan.title,
          sales: item.sales,
          revenue: item.revenue,
          category: item.plan.plan_type
        }));

      setAnalytics({
        overview: {
          totalRevenue: analyticsData.overview.totalRevenue,
          revenueGrowth,
          totalOrders: analyticsData.overview.totalOrders,
          ordersGrowth,
          totalUsers: analyticsData.overview.totalUsers,
          usersGrowth,
          totalDownloads: analyticsData.overview.totalDownloads,
          downloadsGrowth,
        },
        planMetrics: {
          basicSales,
          standardSales,
          premiumSales,
          totalPlans: analyticsData.planMetrics.totalPlans,
        },
        recentActivity,
        topPlans,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setAnalytics(null);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  if (loading || loadingAnalytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-6"></div>
          <p className="text-xl text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-medium text-muted-foreground mb-2">Failed to load analytics</h3>
          <p className="text-sm text-muted-foreground mb-4">There was an error loading the analytics data.</p>
          <Button onClick={fetchAnalytics} className="btn-primary">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => `₵${(amount || 0).toFixed(2)}`;
  
  const formatGrowth = (growth: number) => (
    <div className={`flex items-center ${growth >= 0 ? 'text-success' : 'text-destructive'}`}>
      {growth >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
      <span className="text-sm font-medium">{Math.abs(growth)}%</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      <AdminHeader />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="admin-card">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
                  <BarChart3 className="w-8 h-8 text-primary" />
                  Analytics Dashboard
                </h1>
                <p className="text-muted-foreground">Track performance and insights across your platform</p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="px-4 py-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  Last 30 days
                </Badge>
                <Button variant="outline" onClick={fetchAnalytics} className="btn-outline-modern">
                  <Eye className="w-4 h-4 mr-2" />
                  Refresh Data
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="sales" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <TrendingUp className="w-4 h-4 mr-2" />
              Sales
            </TabsTrigger>
            <TabsTrigger value="activity" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Activity className="w-4 h-4 mr-2" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="plans" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <FileText className="w-4 h-4 mr-2" />
              Plans
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="metric-card group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Total Revenue</p>
                    <div className="text-3xl font-bold text-foreground mb-2">{formatCurrency(analytics.overview.totalRevenue)}</div>
                    {formatGrowth(analytics.overview.revenueGrowth)}
                  </div>
                  <div className="p-4 bg-primary/10 rounded-2xl group-hover:bg-primary/20 transition-colors">
                    <DollarSign className="w-8 h-8 text-primary" />
                  </div>
                </div>
              </div>

              <div className="metric-card group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Total Orders</p>
                    <div className="text-3xl font-bold text-foreground mb-2">{analytics.overview.totalOrders}</div>
                    {formatGrowth(analytics.overview.ordersGrowth)}
                  </div>
                  <div className="p-4 bg-secondary/10 rounded-2xl group-hover:bg-secondary/20 transition-colors">
                    <ShoppingCart className="w-8 h-8 text-secondary" />
                  </div>
                </div>
              </div>

              <div className="metric-card group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Total Users</p>
                    <div className="text-3xl font-bold text-foreground mb-2">{analytics.overview.totalUsers}</div>
                    {formatGrowth(analytics.overview.usersGrowth)}
                  </div>
                  <div className="p-4 bg-accent/10 rounded-2xl group-hover:bg-accent/20 transition-colors">
                    <Users className="w-8 h-8 text-accent" />
                  </div>
                </div>
              </div>

              <div className="metric-card group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Total Downloads</p>
                    <div className="text-3xl font-bold text-foreground mb-2">{analytics.overview.totalDownloads}</div>
                    {formatGrowth(analytics.overview.downloadsGrowth)}
                  </div>
                  <div className="p-4 bg-warning/10 rounded-2xl group-hover:bg-warning/20 transition-colors">
                    <Download className="w-8 h-8 text-warning" />
                  </div>
                </div>
              </div>
            </div>

            {/* Plan Distribution */}
            <div className="admin-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Plan Distribution
                </CardTitle>
                <CardDescription>Sales breakdown by plan type</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                    <div className="text-3xl font-bold text-primary mb-2">{analytics.planMetrics.basicSales}</div>
                    <div className="text-sm text-muted-foreground mb-3">Basic Plans</div>
                    <Progress 
                      value={analytics.overview.totalOrders > 0 ? (analytics.planMetrics.basicSales / analytics.overview.totalOrders) * 100 : 0} 
                      className="h-2 bg-primary/20" 
                    />
                  </div>

                  <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-secondary/5 to-secondary/10 border border-secondary/20">
                    <div className="text-3xl font-bold text-secondary mb-2">{analytics.planMetrics.standardSales}</div>
                    <div className="text-sm text-muted-foreground mb-3">Standard Plans</div>
                    <Progress 
                      value={analytics.overview.totalOrders > 0 ? (analytics.planMetrics.standardSales / analytics.overview.totalOrders) * 100 : 0} 
                      className="h-2 bg-secondary/20" 
                    />
                  </div>

                  <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/20">
                    <div className="text-3xl font-bold text-accent mb-2">{analytics.planMetrics.premiumSales}</div>
                    <div className="text-sm text-muted-foreground mb-3">Premium Plans</div>
                    <Progress 
                      value={analytics.overview.totalOrders > 0 ? (analytics.planMetrics.premiumSales / analytics.overview.totalOrders) * 100 : 0} 
                      className="h-2 bg-accent/20" 
                    />
                  </div>
                </div>
              </CardContent>
            </div>
          </TabsContent>

          <TabsContent value="sales" className="space-y-8">
            {/* Sales Performance */}
            <div className="admin-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Sales Performance
                </CardTitle>
                <CardDescription>Revenue and order trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">Revenue Breakdown</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                        <span className="text-sm text-muted-foreground">Basic Plans</span>
                        <span className="font-semibold text-foreground">
                          {formatCurrency(analytics.planMetrics.basicSales * 100)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                        <span className="text-sm text-muted-foreground">Standard Plans</span>
                        <span className="font-semibold text-foreground">
                          {formatCurrency(analytics.planMetrics.standardSales * 150)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                        <span className="text-sm text-muted-foreground">Premium Plans</span>
                        <span className="font-semibold text-foreground">
                          {formatCurrency(analytics.planMetrics.premiumSales * 250)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">Growth Metrics</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                        <span className="text-sm text-muted-foreground">Revenue Growth</span>
                        <Badge variant="outline" className="text-success border-success/20">
                          +{analytics.overview.revenueGrowth}%
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                        <span className="text-sm text-muted-foreground">Orders Growth</span>
                        <Badge variant="outline" className="text-success border-success/20">
                          +{analytics.overview.ordersGrowth}%
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                        <span className="text-sm text-muted-foreground">User Growth</span>
                        <Badge variant="outline" className="text-success border-success/20">
                          +{analytics.overview.usersGrowth}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-8">
            {/* Recent Activity */}
            <div className="admin-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest platform activities and transactions</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics.recentActivity.length === 0 ? (
                  <div className="text-center py-12">
                    <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">No Recent Activity</h3>
                    <p className="text-sm text-muted-foreground">
                      Activity will appear here once users start using the platform.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {analytics.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <ShoppingCart className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{activity.description}</p>
                            <p className="text-sm text-muted-foreground">{activity.timestamp}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground">{formatCurrency(activity.amount)}</p>
                          <Badge variant="outline" className="text-xs">
                            {activity.type}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </div>
          </TabsContent>

          <TabsContent value="plans" className="space-y-8">
            {/* Top Plans */}
            <div className="admin-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Top Performing Plans
                </CardTitle>
                <CardDescription>Plans with highest sales and revenue</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics.topPlans.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">No Plan Data</h3>
                    <p className="text-sm text-muted-foreground">
                      Plan performance data will appear here once orders are placed.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {analytics.topPlans.map((plan, index) => (
                      <div key={plan.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                            <FileText className="w-5 h-5 text-secondary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{plan.title}</p>
                            <p className="text-sm text-muted-foreground capitalize">{plan.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground">{formatCurrency(plan.revenue)}</p>
                          <p className="text-sm text-muted-foreground">{plan.sales} sales</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminAnalytics;