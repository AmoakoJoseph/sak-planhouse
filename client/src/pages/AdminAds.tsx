import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Search, Plus, Eye, Edit, Trash2, BarChart3, Target, Calendar, MousePointer } from 'lucide-react';
import AdminHeader from '@/components/AdminHeader';

interface Ad {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  type: string;
  position: string;
  image_url: string | null;
  link_url: string | null;
  target_page: string;
  is_active: boolean;
  priority: number;
  impressions: number;
  clicks: number;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

interface AdForm {
  title: string;
  description: string;
  content: string;
  type: string;
  position: string;
  image_url: string;
  link_url: string;
  target_page: string;
  is_active: boolean;
  priority: number;
  start_date: string;
  end_date: string;
}

const AdminAds = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [ads, setAds] = useState<Ad[]>([]);
  const [loadingAds, setLoadingAds] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const [createAdOpen, setCreateAdOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);
  
  const [adForm, setAdForm] = useState<AdForm>({
    title: '',
    description: '',
    content: '',
    type: 'banner',
    position: 'top',
    image_url: '',
    link_url: '',
    target_page: 'all',
    is_active: true,
    priority: 0,
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchAds();
    }
  }, [user, isAdmin]);

  const fetchAds = async () => {
    try {
      setLoadingAds(true);
      const response = await fetch('/api/ads');
      if (!response.ok) throw new Error('Failed to fetch ads');
      const adsData = await response.json();
      setAds(adsData);
    } catch (error) {
      console.error('Error fetching ads:', error);
      toast({
        title: "Error",
        description: "Failed to load ads",
        variant: "destructive"
      });
    } finally {
      setLoadingAds(false);
    }
  };

  const resetForm = () => {
    setAdForm({
      title: '',
      description: '',
      content: '',
      type: 'banner',
      position: 'top',
      image_url: '',
      link_url: '',
      target_page: 'all',
      is_active: true,
      priority: 0,
      start_date: '',
      end_date: ''
    });
  };

  const openEditModal = (ad: Ad) => {
    setEditingAd(ad);
    setAdForm({
      title: ad.title,
      description: ad.description || '',
      content: ad.content || '',
      type: ad.type,
      position: ad.position,
      image_url: ad.image_url || '',
      link_url: ad.link_url || '',
      target_page: ad.target_page,
      is_active: ad.is_active,
      priority: ad.priority,
      start_date: ad.start_date ? new Date(ad.start_date).toISOString().split('T')[0] : '',
      end_date: ad.end_date ? new Date(ad.end_date).toISOString().split('T')[0] : ''
    });
  };

  const handleCreateAd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...adForm,
          start_date: adForm.start_date || null,
          end_date: adForm.end_date || null
        }),
      });

      if (!response.ok) throw new Error('Failed to create ad');

      toast({
        title: "Success",
        description: "Ad created successfully"
      });
      
      setCreateAdOpen(false);
      resetForm();
      fetchAds();
    } catch (error: any) {
      console.error('Error creating ad:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create ad",
        variant: "destructive"
      });
    }
  };

  const handleUpdateAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAd) return;

    try {
      const response = await fetch(`/api/ads/${editingAd.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...adForm,
          start_date: adForm.start_date || null,
          end_date: adForm.end_date || null
        }),
      });

      if (!response.ok) throw new Error('Failed to update ad');

      toast({
        title: "Success",
        description: "Ad updated successfully"
      });
      
      setEditingAd(null);
      resetForm();
      fetchAds();
    } catch (error: any) {
      console.error('Error updating ad:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update ad",
        variant: "destructive"
      });
    }
  };

  const handleDeleteAd = async (adId: string) => {
    if (!confirm('Are you sure you want to delete this ad?')) return;

    try {
      const response = await fetch(`/api/ads/${adId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete ad');

      toast({
        title: "Success",
        description: "Ad deleted successfully"
      });
      
      fetchAds();
    } catch (error: any) {
      console.error('Error deleting ad:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete ad",
        variant: "destructive"
      });
    }
  };

  const toggleAdStatus = async (ad: Ad) => {
    try {
      const response = await fetch(`/api/ads/${ad.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !ad.is_active }),
      });

      if (!response.ok) throw new Error('Failed to update ad status');

      toast({
        title: "Success",
        description: `Ad ${!ad.is_active ? 'activated' : 'deactivated'} successfully`
      });
      
      fetchAds();
    } catch (error: any) {
      console.error('Error updating ad status:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update ad status",
        variant: "destructive"
      });
    }
  };

  const filteredAds = ads.filter(ad => {
    const matchesSearch = 
      ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || ad.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' ? ad.is_active : !ad.is_active);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'banner': return 'bg-blue-500';
      case 'popup': return 'bg-red-500';
      case 'sidebar': return 'bg-green-500';
      case 'inline': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  const calculateCTR = (impressions: number, clicks: number) => {
    return impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : '0';
  };

  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-6"></div>
          <p className="text-xl text-muted-foreground">Loading ads dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      <AdminHeader />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
                <Target className="w-8 h-8 text-primary" />
                Ads Management
              </h1>
              <p className="text-muted-foreground">Create and manage advertisements across your platform</p>
            </div>
            
            <Button onClick={() => setCreateAdOpen(true)} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Ad
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="p-3 bg-blue-500/10 rounded-xl mr-4">
                <Target className="w-8 h-8 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Ads</p>
                <p className="text-3xl font-bold text-foreground">{ads.length}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="p-3 bg-green-500/10 rounded-xl mr-4">
                <Eye className="w-8 h-8 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Ads</p>
                <p className="text-3xl font-bold text-foreground">
                  {ads.filter(ad => ad.is_active).length}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="p-3 bg-purple-500/10 rounded-xl mr-4">
                <BarChart3 className="w-8 h-8 text-purple-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Impressions</p>
                <p className="text-3xl font-bold text-foreground">
                  {ads.reduce((total, ad) => total + ad.impressions, 0).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="p-3 bg-orange-500/10 rounded-xl mr-4">
                <MousePointer className="w-8 h-8 text-orange-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Clicks</p>
                <p className="text-3xl font-bold text-foreground">
                  {ads.reduce((total, ad) => total + ad.clicks, 0).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search ads by title, description, or type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="banner">Banner</SelectItem>
                  <SelectItem value="popup">Popup</SelectItem>
                  <SelectItem value="sidebar">Sidebar</SelectItem>
                  <SelectItem value="inline">Inline</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Ads Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Advertisement List
            </CardTitle>
            <CardDescription>
              Manage your ads and track their performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingAds ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ad Details</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAds.map((ad) => (
                    <TableRow key={ad.id}>
                      <TableCell>
                        <div className="flex items-start gap-3">
                          {ad.image_url && (
                            <img 
                              src={ad.image_url} 
                              alt={ad.title}
                              className="w-16 h-12 object-cover rounded"
                            />
                          )}
                          <div>
                            <p className="font-medium text-foreground">{ad.title}</p>
                            <p className="text-sm text-muted-foreground truncate max-w-xs">
                              {ad.description || 'No description'}
                            </p>
                            <Badge variant="outline" className="mt-1 text-xs">
                              Priority: {ad.priority}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-white ${getTypeColor(ad.type)}`}>
                          {ad.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {ad.position.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={ad.is_active}
                            onCheckedChange={() => toggleAdStatus(ad)}
                            size="sm"
                          />
                          <span className="text-sm">
                            {ad.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>Views: {ad.impressions.toLocaleString()}</div>
                          <div>Clicks: {ad.clicks.toLocaleString()}</div>
                          <div>CTR: {calculateCTR(ad.impressions, ad.clicks)}%</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>Start: {formatDate(ad.start_date)}</div>
                          <div>End: {formatDate(ad.end_date)}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {ad.link_url && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => window.open(ad.link_url!, '_blank')}
                              title="Visit ad link"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openEditModal(ad)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteAd(ad.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Create Ad Modal */}
        <Dialog open={createAdOpen} onOpenChange={setCreateAdOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Ad</DialogTitle>
              <DialogDescription>
                Create a new advertisement to display on your platform
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateAd} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={adForm.title}
                  onChange={(e) => setAdForm(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={adForm.description}
                  onChange={(e) => setAdForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content (HTML)</Label>
                <Textarea
                  id="content"
                  value={adForm.content}
                  onChange={(e) => setAdForm(prev => ({ ...prev, content: e.target.value }))}
                  rows={3}
                  placeholder="HTML content for the ad"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select value={adForm.type} onValueChange={(value) => setAdForm(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="banner">Banner</SelectItem>
                      <SelectItem value="popup">Popup</SelectItem>
                      <SelectItem value="sidebar">Sidebar</SelectItem>
                      <SelectItem value="inline">Inline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Select value={adForm.position} onValueChange={(value) => setAdForm(prev => ({ ...prev, position: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top">Top</SelectItem>
                      <SelectItem value="bottom">Bottom</SelectItem>
                      <SelectItem value="sidebar">Sidebar</SelectItem>
                      <SelectItem value="between_plans">Between Plans</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={adForm.image_url}
                  onChange={(e) => setAdForm(prev => ({ ...prev, image_url: e.target.value }))}
                  placeholder="https://example.com/ad-image.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="link_url">Link URL</Label>
                <Input
                  id="link_url"
                  type="url"
                  value={adForm.link_url}
                  onChange={(e) => setAdForm(prev => ({ ...prev, link_url: e.target.value }))}
                  placeholder="https://example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="target_page">Target Page</Label>
                  <Select value={adForm.target_page} onValueChange={(value) => setAdForm(prev => ({ ...prev, target_page: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Pages</SelectItem>
                      <SelectItem value="home">Home</SelectItem>
                      <SelectItem value="plans">Plans</SelectItem>
                      <SelectItem value="plan_detail">Plan Detail</SelectItem>
                      <SelectItem value="checkout">Checkout</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Input
                    id="priority"
                    type="number"
                    value={adForm.priority}
                    onChange={(e) => setAdForm(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={adForm.start_date}
                    onChange={(e) => setAdForm(prev => ({ ...prev, start_date: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={adForm.end_date}
                    onChange={(e) => setAdForm(prev => ({ ...prev, end_date: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={adForm.is_active}
                  onCheckedChange={(checked) => setAdForm(prev => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setCreateAdOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Create Ad
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Ad Modal */}
        <Dialog open={!!editingAd} onOpenChange={(open) => !open && setEditingAd(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Ad</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateAd} className="space-y-4">
              {/* Same form fields as create modal */}
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={adForm.title}
                  onChange={(e) => setAdForm(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={adForm.description}
                  onChange={(e) => setAdForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-content">Content (HTML)</Label>
                <Textarea
                  id="edit-content"
                  value={adForm.content}
                  onChange={(e) => setAdForm(prev => ({ ...prev, content: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-type">Type</Label>
                  <Select value={adForm.type} onValueChange={(value) => setAdForm(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="banner">Banner</SelectItem>
                      <SelectItem value="popup">Popup</SelectItem>
                      <SelectItem value="sidebar">Sidebar</SelectItem>
                      <SelectItem value="inline">Inline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-position">Position</Label>
                  <Select value={adForm.position} onValueChange={(value) => setAdForm(prev => ({ ...prev, position: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top">Top</SelectItem>
                      <SelectItem value="bottom">Bottom</SelectItem>
                      <SelectItem value="sidebar">Sidebar</SelectItem>
                      <SelectItem value="between_plans">Between Plans</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-image_url">Image URL</Label>
                <Input
                  id="edit-image_url"
                  type="url"
                  value={adForm.image_url}
                  onChange={(e) => setAdForm(prev => ({ ...prev, image_url: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-link_url">Link URL</Label>
                <Input
                  id="edit-link_url"
                  type="url"
                  value={adForm.link_url}
                  onChange={(e) => setAdForm(prev => ({ ...prev, link_url: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-target_page">Target Page</Label>
                  <Select value={adForm.target_page} onValueChange={(value) => setAdForm(prev => ({ ...prev, target_page: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Pages</SelectItem>
                      <SelectItem value="home">Home</SelectItem>
                      <SelectItem value="plans">Plans</SelectItem>
                      <SelectItem value="plan_detail">Plan Detail</SelectItem>
                      <SelectItem value="checkout">Checkout</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-priority">Priority</Label>
                  <Input
                    id="edit-priority"
                    type="number"
                    value={adForm.priority}
                    onChange={(e) => setAdForm(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-start_date">Start Date</Label>
                  <Input
                    id="edit-start_date"
                    type="date"
                    value={adForm.start_date}
                    onChange={(e) => setAdForm(prev => ({ ...prev, start_date: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-end_date">End Date</Label>
                  <Input
                    id="edit-end_date"
                    type="date"
                    value={adForm.end_date}
                    onChange={(e) => setAdForm(prev => ({ ...prev, end_date: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-is_active"
                  checked={adForm.is_active}
                  onCheckedChange={(checked) => setAdForm(prev => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="edit-is_active">Active</Label>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setEditingAd(null)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Update Ad
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminAds;