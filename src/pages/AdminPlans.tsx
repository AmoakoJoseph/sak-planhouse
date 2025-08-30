import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, ArrowLeft, Star, Eye } from 'lucide-react';

type PlanType = 'villa' | 'bungalow' | 'townhouse' | 'duplex' | 'apartment' | 'commercial';

interface Plan {
  id: string;
  title: string;
  description: string;
  plan_type: PlanType;
  bedrooms: number;
  bathrooms: number;
  area_sqft: number;
  basic_price: number;
  standard_price: number;
  premium_price: number;
  featured: boolean;
  status: string;
  image_url?: string;
  created_at: string;
}

const AdminPlans = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  const [planForm, setPlanForm] = useState({
    title: '',
    description: '',
    plan_type: 'villa' as PlanType,
    bedrooms: 3,
    bathrooms: 2,
    area_sqft: 2000,
    basic_price: 199.99,
    standard_price: 399.99,
    premium_price: 599.99,
    featured: false,
    status: 'active'
  });

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchPlans();
    }
  }, [user, isAdmin]);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast({
        title: "Error",
        description: "Failed to fetch plans",
        variant: "destructive"
      });
    } finally {
      setLoadingPlans(false);
    }
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('plans')
        .insert([planForm]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Plan created successfully"
      });
      
      setIsCreateModalOpen(false);
      resetForm();
      fetchPlans();
    } catch (error) {
      console.error('Error creating plan:', error);
      toast({
        title: "Error",
        description: "Failed to create plan",
        variant: "destructive"
      });
    }
  };

  const handleUpdatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;

    try {
      const { error } = await supabase
        .from('plans')
        .update(planForm)
        .eq('id', editingPlan.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Plan updated successfully"
      });
      
      setEditingPlan(null);
      resetForm();
      fetchPlans();
    } catch (error) {
      console.error('Error updating plan:', error);
      toast({
        title: "Error",
        description: "Failed to update plan",
        variant: "destructive"
      });
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;

    try {
      const { error } = await supabase
        .from('plans')
        .delete()
        .eq('id', planId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Plan deleted successfully"
      });
      
      fetchPlans();
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast({
        title: "Error",
        description: "Failed to delete plan",
        variant: "destructive"
      });
    }
  };

  const toggleFeatured = async (plan: Plan) => {
    try {
      const { error } = await supabase
        .from('plans')
        .update({ featured: !plan.featured })
        .eq('id', plan.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Plan ${!plan.featured ? 'featured' : 'unfeatured'} successfully`
      });
      
      fetchPlans();
    } catch (error) {
      console.error('Error updating plan:', error);
      toast({
        title: "Error",
        description: "Failed to update plan",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setPlanForm({
      title: '',
      description: '',
      plan_type: 'villa' as PlanType,
      bedrooms: 3,
      bathrooms: 2,
      area_sqft: 2000,
      basic_price: 199.99,
      standard_price: 399.99,
      premium_price: 599.99,
      featured: false,
      status: 'active'
    });
  };

  const openEditModal = (plan: Plan) => {
    setEditingPlan(plan);
    setPlanForm({
      title: plan.title,
      description: plan.description || '',
      plan_type: plan.plan_type,
      bedrooms: plan.bedrooms || 3,
      bathrooms: plan.bathrooms || 2,
      area_sqft: plan.area_sqft || 2000,
      basic_price: plan.basic_price,
      standard_price: plan.standard_price,
      premium_price: plan.premium_price,
      featured: plan.featured,
      status: plan.status
    });
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
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-xl font-bold">Plan Management</h1>
              <p className="text-sm text-muted-foreground">Manage construction plans and pricing</p>
            </div>
          </div>
          
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add New Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Plan</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreatePlan} className="space-y-4">
                
                <div className="space-y-2">
                  <Label htmlFor="title">Plan Title</Label>
                  <Input
                    id="title"
                    value={planForm.title}
                    onChange={(e) => setPlanForm(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={planForm.description}
                    onChange={(e) => setPlanForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="plan_type">Plan Type</Label>
                    <Select value={planForm.plan_type} onValueChange={(value) => setPlanForm(prev => ({ ...prev, plan_type: value as PlanType }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="villa">Villa</SelectItem>
                        <SelectItem value="bungalow">Bungalow</SelectItem>
                        <SelectItem value="townhouse">Townhouse</SelectItem>
                        <SelectItem value="duplex">Duplex</SelectItem>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={planForm.status} onValueChange={(value) => setPlanForm(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      value={planForm.bedrooms}
                      onChange={(e) => setPlanForm(prev => ({ ...prev, bedrooms: parseInt(e.target.value) }))}
                      min="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      value={planForm.bathrooms}
                      onChange={(e) => setPlanForm(prev => ({ ...prev, bathrooms: parseInt(e.target.value) }))}
                      min="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="area_sqft">Area (sq ft)</Label>
                    <Input
                      id="area_sqft"
                      type="number"
                      value={planForm.area_sqft}
                      onChange={(e) => setPlanForm(prev => ({ ...prev, area_sqft: parseInt(e.target.value) }))}
                      min="100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="basic_price">Basic Price (₵)</Label>
                    <Input
                      id="basic_price"
                      type="number"
                      step="0.01"
                      value={planForm.basic_price}
                      onChange={(e) => setPlanForm(prev => ({ ...prev, basic_price: parseFloat(e.target.value) }))}
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="standard_price">Standard Price (₵)</Label>
                    <Input
                      id="standard_price"
                      type="number"
                      step="0.01"
                      value={planForm.standard_price}
                      onChange={(e) => setPlanForm(prev => ({ ...prev, standard_price: parseFloat(e.target.value) }))}
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="premium_price">Premium Price (₵)</Label>
                    <Input
                      id="premium_price"
                      type="number"
                      step="0.01"
                      value={planForm.premium_price}
                      onChange={(e) => setPlanForm(prev => ({ ...prev, premium_price: parseFloat(e.target.value) }))}
                      min="0"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={planForm.featured}
                    onChange={(e) => setPlanForm(prev => ({ ...prev, featured: e.target.checked }))}
                  />
                  <Label htmlFor="featured">Featured Plan</Label>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Create Plan
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>All Plans ({plans.length})</CardTitle>
            <CardDescription>Manage your construction plans and pricing tiers</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingPlans ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-muted animate-pulse rounded"></div>
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plan</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Specs</TableHead>
                    <TableHead>Pricing</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium flex items-center">
                            {plan.title}
                            {plan.featured && <Star className="w-4 h-4 ml-2 text-yellow-500" />}
                          </div>
                          <div className="text-sm text-muted-foreground truncate max-w-xs">
                            {plan.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {plan.plan_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {plan.bedrooms}BR / {plan.bathrooms}BA<br />
                          {plan.area_sqft?.toLocaleString()} sq ft
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          Basic: ₵{plan.basic_price}<br />
                          Standard: ₵{plan.standard_price}<br />
                          Premium: ₵{plan.premium_price}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={plan.status === 'active' ? 'default' : 'secondary'}>
                          {plan.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleFeatured(plan)}
                            title={plan.featured ? 'Remove from featured' : 'Mark as featured'}
                          >
                            <Star className={`w-4 h-4 ${plan.featured ? 'text-yellow-500 fill-current' : ''}`} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => navigate(`/plans/${plan.id}`)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openEditModal(plan)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeletePlan(plan.id)}
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
      </div>

      {/* Edit Modal */}
      <Dialog open={!!editingPlan} onOpenChange={(open) => !open && setEditingPlan(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Plan</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdatePlan} className="space-y-4">
            
            <div className="space-y-2">
              <Label htmlFor="edit-title">Plan Title</Label>
              <Input
                id="edit-title"
                value={planForm.title}
                onChange={(e) => setPlanForm(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={planForm.description}
                onChange={(e) => setPlanForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-plan_type">Plan Type</Label>
                <Select value={planForm.plan_type} onValueChange={(value) => setPlanForm(prev => ({ ...prev, plan_type: value as PlanType }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="bungalow">Bungalow</SelectItem>
                    <SelectItem value="townhouse">Townhouse</SelectItem>
                    <SelectItem value="duplex">Duplex</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={planForm.status} onValueChange={(value) => setPlanForm(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-bedrooms">Bedrooms</Label>
                <Input
                  id="edit-bedrooms"
                  type="number"
                  value={planForm.bedrooms}
                  onChange={(e) => setPlanForm(prev => ({ ...prev, bedrooms: parseInt(e.target.value) }))}
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-bathrooms">Bathrooms</Label>
                <Input
                  id="edit-bathrooms"
                  type="number"
                  value={planForm.bathrooms}
                  onChange={(e) => setPlanForm(prev => ({ ...prev, bathrooms: parseInt(e.target.value) }))}
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-area_sqft">Area (sq ft)</Label>
                <Input
                  id="edit-area_sqft"
                  type="number"
                  value={planForm.area_sqft}
                  onChange={(e) => setPlanForm(prev => ({ ...prev, area_sqft: parseInt(e.target.value) }))}
                  min="100"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-basic_price">Basic Price (₵)</Label>
                <Input
                  id="edit-basic_price"
                  type="number"
                  step="0.01"
                  value={planForm.basic_price}
                  onChange={(e) => setPlanForm(prev => ({ ...prev, basic_price: parseFloat(e.target.value) }))}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-standard_price">Standard Price (₵)</Label>
                <Input
                  id="edit-standard_price"
                  type="number"
                  step="0.01"
                  value={planForm.standard_price}
                  onChange={(e) => setPlanForm(prev => ({ ...prev, standard_price: parseFloat(e.target.value) }))}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-premium_price">Premium Price (₵)</Label>
                <Input
                  id="edit-premium_price"
                  type="number"
                  step="0.01"
                  value={planForm.premium_price}
                  onChange={(e) => setPlanForm(prev => ({ ...prev, premium_price: parseFloat(e.target.value) }))}
                  min="0"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-featured"
                checked={planForm.featured}
                onChange={(e) => setPlanForm(prev => ({ ...prev, featured: e.target.checked }))}
              />
              <Label htmlFor="edit-featured">Featured Plan</Label>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setEditingPlan(null)}>
                Cancel
              </Button>
              <Button type="submit">
                Update Plan
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPlans;
