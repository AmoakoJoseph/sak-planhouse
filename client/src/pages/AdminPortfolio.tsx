import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Save, Upload, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import AdminHeader from '@/components/AdminHeader';

type PortfolioItem = {
  id?: string;
  title: string;
  category?: string;
  summary?: string;
  description?: string;
  design_image?: string;
  current_image?: string;
  status?: 'in-progress' | 'completed';
};

const emptyItem: PortfolioItem = {
  title: '',
  category: '',
  summary: '',
  description: '',
  status: 'in-progress'
};

const AdminPortfolio = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [editing, setEditing] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await api.get('/portfolio');
        setItems(data || []);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const startNew = () => setEditing({ ...emptyItem });
  const startEdit = (item: PortfolioItem) => setEditing({ ...item });
  const cancel = () => setEditing(null);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'design_image' | 'current_image') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append('image', file);
    const res = await fetch('/api/upload/image', { method: 'POST', body: form });
    if (res.ok) {
      const data = await res.json();
      setEditing(prev => (prev ? { ...prev, [field]: data.url || data.path } : prev));
    }
  };

  const save = async () => {
    if (!editing) return;
    const isNew = !editing.id;
    const endpoint = isNew ? '/portfolio' : `/portfolio/${editing.id}`;
    const method = isNew ? 'POST' : 'PUT';
    const payload = { ...editing };
    const res = await api.post(endpoint, payload as any).catch(async () => {
      // Get auth headers for fallback request
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      const savedProfile = localStorage.getItem('profile');
      if (savedProfile) {
        try {
          const profile = JSON.parse(savedProfile);
          if (profile.email) {
            headers['x-user-email'] = profile.email;
          }
        } catch (error) {
          console.warn('Failed to parse profile from localStorage:', error);
        }
      }
      
      const r = await fetch(`/api${endpoint}`, { method, headers, body: JSON.stringify(payload) });
      if (!r.ok) throw new Error('failed');
      return r.json();
    });
    if (res) {
      if (isNew) setItems(prev => [res, ...prev]);
      else setItems(prev => prev.map(it => (it.id === editing.id ? res : it)));
      setEditing(null);
    }
  };

  const remove = async (id?: string) => {
    if (!id) return;
    // Get auth headers for the request
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const savedProfile = localStorage.getItem('profile');
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        if (profile.email) {
          headers['x-user-email'] = profile.email;
        }
      } catch (error) {
        console.warn('Failed to parse profile from localStorage:', error);
      }
    }
    
    await fetch(`/api/portfolio/${id}`, { method: 'DELETE', headers });
    setItems(prev => prev.filter(it => it.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Portfolio Management</h1>
                <p className="text-muted-foreground">Manage your project portfolio and showcase completed work</p>
              </div>
              <Button onClick={startNew} className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 shadow-lg">
                <Plus className="w-4 h-4" /> 
                New Project
              </Button>
            </div>
          </div>

        {/* Editor */}
        {editing && (
          <Card className="mb-8 border-2 border-primary/20 shadow-xl">
            <CardHeader className="bg-primary/5 border-b">
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                {editing.id ? '✏️ Edit Project' : '✨ New Project'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Project Title</label>
                  <Input 
                    value={editing.title} 
                    onChange={e => setEditing({ ...editing, title: e.target.value })}
                    placeholder="Enter project title"
                    className="rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Category</label>
                  <Input 
                    value={editing.category} 
                    onChange={e => setEditing({ ...editing, category: e.target.value })}
                    placeholder="e.g., Residential, Commercial, Renovation"
                    className="rounded-lg"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Project Summary</label>
                <Input 
                  value={editing.summary} 
                  onChange={e => setEditing({ ...editing, summary: e.target.value })}
                  placeholder="Brief description of the project"
                  className="rounded-lg"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Detailed Description</label>
                <Textarea 
                  value={editing.description} 
                  onChange={e => setEditing({ ...editing, description: e.target.value })}
                  placeholder="Provide detailed information about the project, challenges, solutions, and outcomes..."
                  className="rounded-lg min-h-24"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Design Image</label>
                  <div className="space-y-3">
                    <Input 
                      type="file" 
                      accept="image/*" 
                      onChange={e => onUpload(e, 'design_image')}
                      className="rounded-lg"
                    />
                    {editing.design_image && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                        ✅ Uploaded
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Current State Image</label>
                  <div className="space-y-3">
                    <Input 
                      type="file" 
                      accept="image/*" 
                      onChange={e => onUpload(e, 'current_image')}
                      className="rounded-lg"
                    />
                    {editing.current_image && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                        ✅ Uploaded
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t">
                <Button 
                  onClick={save} 
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 shadow-lg"
                >
                  <Save className="w-4 h-4" /> 
                  {editing.id ? 'Update Project' : 'Create Project'}
                </Button>
                <Button variant="outline" onClick={cancel} className="rounded-lg">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Portfolio Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-foreground">Portfolio Projects</h2>
            <Badge variant="secondary" className="text-sm">
              {items.length} {items.length === 1 ? 'Project' : 'Projects'}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            ) : items.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="w-24 h-24 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No Projects Yet</h3>
                <p className="text-muted-foreground mb-4">Start building your portfolio by adding your first project.</p>
                <Button onClick={startNew} className="inline-flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create First Project
                </Button>
              </div>
            ) : (
              items.map(item => (
                <Card key={item.id} className="group overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={item.design_image || '/placeholder.svg'} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/90 text-foreground shadow-lg border-0">
                        {item.category || 'Project'}
                      </Badge>
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg text-foreground mb-1 line-clamp-1">{item.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{item.summary || 'No summary provided.'}</p>
                      </div>
                      
                      <div className="flex items-center gap-2 pt-2">
                        <Button 
                          size="sm" 
                          onClick={() => startEdit(item)}
                          className="flex-1 bg-primary hover:bg-primary/90"
                        >
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => remove(item.id)} 
                          className="inline-flex items-center gap-1 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
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

export default AdminPortfolio;


