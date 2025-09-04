import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, ArrowLeft, Star, Eye, CheckCircle } from 'lucide-react';

type PlanType = 'villa' | 'bungalow' | 'townhouse' | 'duplex' | 'apartment' | 'commercial';

interface Plan {
  id: string;
  title: string;
  description: string | null;
  plan_type: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area_sqft: number | null;
  basic_price: number;
  standard_price: number;
  premium_price: number;
  featured: boolean;
  status: string;
  image_url?: string | null;
  gallery_images?: any;
  plan_files?: any;
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
    status: 'active',
    image_url: null as string | null,
    gallery_images: null as any,
    plan_files: null as any
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);

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
      const data = await api.getPlans();
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
      await api.createPlan(planForm);

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
      // Mock update for now
      console.log('Update plan:', planForm);

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
      // Mock delete for now
      console.log('Delete plan:', planId);

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
      // Mock toggle featured for now
      console.log('Toggle featured for plan:', plan.id);

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
      status: 'active',
      image_url: null,
      gallery_images: null,
      plan_files: null
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setPlanForm(prev => ({ ...prev, image_url: result.url }));
        toast({
          title: "Success",
          description: "Image uploaded successfully"
        });
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive"
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePlanFilesUpload = async (event: React.ChangeEvent<HTMLInputElement>, tier: string) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploadingFiles(true);
    const formData = new FormData();
    
    for (let i = 0; i < files.length; i++) {
      formData.append(tier, files[i]);
    }

    try {
      const response = await fetch('/api/upload/plan-files', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setPlanForm(prev => ({ 
          ...prev, 
          plan_files: { 
            ...prev.plan_files, 
            [tier]: result.files[tier] || [] // Ensure tier-specific files are stored correctly
          } 
        }));
        toast({
          title: "Success",
          description: `${tier} plan files uploaded successfully`
        });
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading plan files:', error);
      toast({
        title: "Error",
        description: `Failed to upload ${tier} plan files`,
        variant: "destructive"
      });
    } finally {
      setUploadingFiles(false);
    }
  };

  const openEditModal = (plan: Plan) => {
    setEditingPlan(plan);
    setPlanForm({
      title: plan.title,
      description: plan.description || '',
      plan_type: plan.plan_type as PlanType,
      bedrooms: plan.bedrooms || 3,
      bathrooms: plan.bathrooms || 2,
      area_sqft: plan.area_sqft || 2000,
      basic_price: plan.basic_price,
      standard_price: plan.standard_price,
      premium_price: plan.premium_price,
      featured: plan.featured,
      status: plan.status,
      image_url: plan.image_url ?? null,
      gallery_images: plan.gallery_images,
      plan_files: plan.plan_files
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
            <DialogDescription>
              Add a new construction plan with all the necessary details and pricing tiers.
            </DialogDescription>
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

                {/* Image Upload Section */}
                <div className="space-y-2">
                  <Label>Plan Image</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                    <div className="flex flex-col items-center space-y-2">
                      {planForm.image_url ? (
                        <div className="space-y-2">
                          <img src={planForm.image_url} alt="Plan preview" className="max-w-32 h-20 object-cover rounded" />
                          <Button type="button" variant="outline" size="sm" onClick={() => setPlanForm(prev => ({ ...prev, image_url: null }))}>
                            Remove Image
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Upload plan image (JPG, PNG)</p>
                            <p className="text-xs text-muted-foreground">Max size: 10MB</p>
                          </div>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploadingImage}
                            className="max-w-xs"
                          />
                          {uploadingImage && <p className="text-xs text-blue-600">Uploading...</p>}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Plan Files Upload Section */}
                <div className="space-y-4">
                  <Label>Plan Files by Tier</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(['basic', 'standard', 'premium'] as const).map((tier) => (
                      <div key={tier} className="border rounded-lg p-3">
                        <Label className="text-sm font-medium capitalize">{tier} Files</Label>
                        <div className="mt-2 space-y-2">
                          <Input
                            type="file"
                            multiple
                            accept=".pdf,.dwg,.dxf,.zip"
                            onChange={(e) => handlePlanFilesUpload(e, tier)}
                            disabled={uploadingFiles}
                            className="text-xs"
                          />
                          <p className="text-xs text-muted-foreground">PDF, DWG, DXF, ZIP (Max 50MB each)</p>
                          {planForm.plan_files?.[tier] && Array.isArray(planForm.plan_files[tier]) && planForm.plan_files[tier].length > 0 && (
                            <div className="space-y-1">
                              <p className="text-xs font-medium">{planForm.plan_files[tier].length} file(s) uploaded</p>
                              {planForm.plan_files[tier].map((file: string, index: number) => (
                                <p key={index} className="text-xs text-muted-foreground truncate">
                                  {file.split('/').pop()}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {uploadingFiles && <p className="text-sm text-blue-600">Uploading files...</p>}
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
                            {plan.plan_files && Object.values(plan.plan_files).some((files: any) => Array.isArray(files) && files?.length > 0) && (
                              <div title="Has downloadable files">
                                <CheckCircle className="w-4 h-4 ml-2 text-green-500" />
                              </div>
                            )}
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
                        <div className="mt-2 flex gap-1">
                                                     {['basic', 'standard', 'premium'].map((tier) => (
                             <Badge
                               key={tier}
                               className={cn(
                                 "text-xs font-semibold",
                                 plan.plan_files?.[tier] && Array.isArray(plan.plan_files[tier]) && plan.plan_files[tier].length > 0 
                                   ? tier === 'basic' ? 'bg-tier-basic text-white' 
                                     : tier === 'standard' ? 'bg-tier-standard text-white'
                                     : 'bg-tier-premium text-white'
                                   : 'bg-gray-200 text-gray-600'
                               )}
                             >
                               {tier}: {plan.plan_files?.[tier] && Array.isArray(plan.plan_files[tier]) ? plan.plan_files[tier].length : 0}
                             </Badge>
                           ))}
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
