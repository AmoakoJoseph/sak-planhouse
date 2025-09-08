import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus, Save, Edit, Trash2, Eye, MousePointer, Calendar, Target } from 'lucide-react';
import { api } from '@/lib/api';
import AdminHeader from '@/components/AdminHeader';

type Ad = {
  id?: string;
  title: string;
  description?: string;
  image_url?: string;
  link_url?: string;
  ad_type: 'banner' | 'sidebar' | 'popup' | 'inline';
  position: 'top' | 'bottom' | 'sidebar' | 'inline';
  status: 'active' | 'inactive' | 'draft';
  start_date?: string;
  end_date?: string;
  click_count?: number;
  view_count?: number;
  created_at?: string;
  updated_at?: string;
};

const emptyAd: Ad = {
  title: '',
  description: '',
  image_url: '',
  link_url: '',
  ad_type: 'banner',
  position: 'top',
  status: 'draft',
  start_date: '',
  end_date: ''
};

const AdminAds = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [editing, setEditing] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const data = await api.get('/ads');
      setAds(data || []);
    } catch (error) {
      console.error('Error fetching ads:', error);
      setAds([]);
    } finally {
      setLoading(false);
    }
  };

  const startNew = () => setEditing({ ...emptyAd });
  const startEdit = (ad: Ad) => setEditing({ ...ad });
  const cancel = () => setEditing(null);

  const onImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append('image', file);
    const res = await fetch('/api/upload/image', { method: 'POST', body: form });
    if (res.ok) {
      const data = await res.json();
      setEditing(prev => (prev ? { ...prev, image_url: data.url || data.path } : prev));
    }
  };

  const save = async () => {
    if (!editing) return;
    const isNew = !editing.id;
    const endpoint = isNew ? '/ads' : `/ads/${editing.id}`;
    const method = isNew ? 'POST' : 'PUT';
    
    // Clean up the payload - convert date strings to ISO strings or null
    const payload = { 
      ...editing,
      start_date: editing.start_date && editing.start_date.trim() !== '' ? new Date(editing.start_date + 'Z').toISOString() : null,
      end_date: editing.end_date && editing.end_date.trim() !== '' ? new Date(editing.end_date + 'Z').toISOString() : null
    };
    
    
    try {
      const res = await api.post(endpoint, payload as any).catch(async () => {
        const r = await fetch(`/api${endpoint}`, { 
          method, 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify(payload) 
        });
        if (!r.ok) throw new Error('failed');
        return r.json();
      });
      
      if (res) {
        if (isNew) setAds(prev => [res, ...prev]);
        else setAds(prev => prev.map(ad => (ad.id === editing.id ? res : ad)));
        setEditing(null);
      }
    } catch (error) {
      console.error('Error saving ad:', error);
    }
  };

  const remove = async (id?: string) => {
    if (!id) return;
    try {
      await fetch(`/api/ads/${id}`, { method: 'DELETE' });
      setAds(prev => prev.filter(ad => ad.id !== id));
    } catch (error) {
      console.error('Error deleting ad:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAdTypeColor = (type: string) => {
    switch (type) {
      case 'banner': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'sidebar': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'popup': return 'bg-red-100 text-red-800 border-red-200';
      case 'inline': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Ad Management</h1>
                <p className="text-muted-foreground text-sm md:text-base">Create and manage advertisements for your website</p>
              </div>
              <Button onClick={startNew} className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 shadow-lg w-full sm:w-auto">
                <Plus className="w-4 h-4" /> 
                New Ad
              </Button>
            </div>
          </div>

          {/* Editor */}
          {editing && (
            <Card className="mb-6 md:mb-8 border-2 border-primary/20 shadow-xl">
              <CardHeader className="bg-primary/5 border-b p-4 md:p-6">
                <CardTitle className="text-lg md:text-xl font-semibold flex items-center gap-2">
                  {editing.id ? '✏️ Edit Ad' : '✨ New Ad'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6 p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">Ad Title</Label>
                    <Input 
                      value={editing.title} 
                      onChange={e => setEditing({ ...editing, title: e.target.value })}
                      placeholder="Enter ad title"
                      className="rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">Link URL</Label>
                    <Input 
                      value={editing.link_url} 
                      onChange={e => setEditing({ ...editing, link_url: e.target.value })}
                      placeholder="https://example.com"
                      className="rounded-lg"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Description</Label>
                  <Textarea 
                    value={editing.description} 
                    onChange={e => setEditing({ ...editing, description: e.target.value })}
                    placeholder="Brief description of the ad"
                    className="rounded-lg min-h-20"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">Ad Type</Label>
                    <Select value={editing.ad_type} onValueChange={(value: any) => setEditing({ ...editing, ad_type: value })}>
                      <SelectTrigger className="rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="banner">Banner</SelectItem>
                        <SelectItem value="sidebar">Sidebar</SelectItem>
                        <SelectItem value="popup">Popup</SelectItem>
                        <SelectItem value="inline">Inline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">Position</Label>
                    <Select value={editing.position} onValueChange={(value: any) => setEditing({ ...editing, position: value })}>
                      <SelectTrigger className="rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="top">Top</SelectItem>
                        <SelectItem value="bottom">Bottom</SelectItem>
                        <SelectItem value="sidebar">Sidebar</SelectItem>
                        <SelectItem value="inline">Inline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                    <Label className="text-sm font-medium text-foreground">Status</Label>
                    <Select value={editing.status} onValueChange={(value: any) => setEditing({ ...editing, status: value })}>
                      <SelectTrigger className="rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">Start Date</Label>
                    <Input 
                      type="datetime-local"
                      value={editing.start_date} 
                      onChange={e => setEditing({ ...editing, start_date: e.target.value })}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">End Date</Label>
                    <Input 
                      type="datetime-local"
                      value={editing.end_date} 
                      onChange={e => setEditing({ ...editing, end_date: e.target.value })}
                      className="rounded-lg"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Ad Image</Label>
                  <div className="space-y-3">
                    <Input 
                      type="file" 
                      accept="image/*" 
                      onChange={onImageUpload}
                      className="rounded-lg"
                    />
                    {editing.image_url && (
                      <div className="space-y-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                          ✅ Image Uploaded
                        </Badge>
                        <div className="w-32 h-20 border rounded-lg overflow-hidden">
                          <img src={editing.image_url} alt="Ad preview" className="w-full h-full object-cover" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t">
                  <Button 
                    onClick={save} 
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 shadow-lg w-full sm:w-auto"
                  >
                    <Save className="w-4 h-4" /> 
                    {editing.id ? 'Update Ad' : 'Create Ad'}
                  </Button>
                  <Button variant="outline" onClick={cancel} className="rounded-lg w-full sm:w-auto">
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Ads Grid */}
          <div className="space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h2 className="text-xl md:text-2xl font-semibold text-foreground">All Ads</h2>
              <Badge variant="secondary" className="text-sm w-fit">
                {ads.length} {ads.length === 1 ? 'Ad' : 'Ads'}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="animate-pulse shadow-lg">
                    <div className="h-48 bg-muted rounded-t-lg" />
                    <CardContent className="p-6">
                      <div className="h-5 bg-muted rounded w-3/4 mb-3"></div>
                      <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))
              ) : ads.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="w-24 h-24 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">No Ads Yet</h3>
                  <p className="text-muted-foreground mb-4">Start creating ads to promote your content.</p>
                  <Button onClick={startNew} className="inline-flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Create First Ad
                  </Button>
                </div>
              ) : (
                ads.map(ad => (
                  <Card key={ad.id} className="group overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white">
                    <div className="relative h-48 overflow-hidden">
                      {ad.image_url ? (
                        <img 
                          src={ad.image_url} 
                          alt={ad.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <Target className="w-12 h-12 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4 flex gap-2">
                        <Badge className={`text-xs ${getStatusColor(ad.status)}`}>
                          {ad.status}
                        </Badge>
                        <Badge className={`text-xs ${getAdTypeColor(ad.ad_type)}`}>
                          {ad.ad_type}
                        </Badge>
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    </div>
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg text-foreground mb-1 line-clamp-1">{ad.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{ad.description || 'No description provided.'}</p>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>{ad.view_count || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MousePointer className="w-3 h-3" />
                            <span>{ad.click_count || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            <span>{ad.position}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2">
                          <Button 
                            size="sm" 
                            onClick={() => startEdit(ad)}
                            className="flex-1 bg-primary hover:bg-primary/90"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => remove(ad.id)} 
                            className="inline-flex items-center gap-1 hover:bg-red-50 hover:border-red-200 hover:text-red-600 sm:w-auto"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="sm:hidden">Delete</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAds;
