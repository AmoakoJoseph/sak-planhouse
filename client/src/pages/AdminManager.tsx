import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Search, UserPlus, UserCog, Shield, Users, Crown } from 'lucide-react';
import AdminHeader from '@/components/AdminHeader';
import * as api from '@/lib/api';

interface Profile {
  id: string;
  user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: 'user' | 'admin' | 'super_admin';
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface CreateAdminForm {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'super_admin';
}

const AdminManager = () => {
  const { user, profile, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [admins, setAdmins] = useState<Profile[]>([]);
  const [allUsers, setAllUsers] = useState<Profile[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  
  const [createAdminOpen, setCreateAdminOpen] = useState(false);
  
  const [createAdminForm, setCreateAdminForm] = useState<CreateAdminForm>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'admin'
  });

  useEffect(() => {
    if (!loading && (!user || !isAdmin || profile?.role !== 'super_admin')) {
      navigate('/admin/dashboard');
    }
  }, [user, isAdmin, profile, loading, navigate]);

  useEffect(() => {
    if (user && profile?.role === 'super_admin') {
      fetchData();
    }
  }, [user, profile]);

  const fetchData = async () => {
    try {
      setLoadingData(true);
      
      // Fetch all users with profiles
      const usersResponse = await fetch('/api/users');
      const usersData = await usersResponse.json();
      
      const adminUsers = usersData.filter((user: Profile) => 
        user.role === 'admin' || user.role === 'super_admin'
      );
      
      setAdmins(adminUsers);
      setAllUsers(usersData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive"
      });
    } finally {
      setLoadingData(false);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create the user account
      const signupResponse = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: createAdminForm.email,
          password: createAdminForm.password,
          firstName: createAdminForm.firstName,
          lastName: createAdminForm.lastName
        })
      });

      if (!signupResponse.ok) {
        throw new Error('Failed to create admin account');
      }

      const { profile: newProfile } = await signupResponse.json();

      // Update the role to admin or super_admin
      await api.updateProfile(newProfile.user_id, { role: createAdminForm.role });

      toast({
        title: "Success",
        description: `New ${createAdminForm.role} account created successfully`,
      });

      setCreateAdminForm({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: 'admin'
      });
      setCreateAdminOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error creating admin:', error);
      toast({
        title: "Error",
        description: "Failed to create admin account",
        variant: "destructive"
      });
    }
  };

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    try {
      await api.updateProfile(userId, { role: newRole });
      
      toast({
        title: "Success",
        description: `User role updated to ${newRole}`,
      });

      fetchData();
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive"
      });
    }
  };

  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = 
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.last_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || admin.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const filteredUsers = allUsers.filter(user => 
    user.role === 'user' && 
    (user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-red-500 hover:bg-red-600';
      case 'admin': return 'bg-blue-500 hover:bg-blue-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin': return <Crown className="w-4 h-4" />;
      case 'admin': return <Shield className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  if (loading || !user || !isAdmin || profile?.role !== 'super_admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-6"></div>
          <p className="text-xl text-muted-foreground">Loading admin manager...</p>
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
                <UserCog className="w-8 h-8 text-primary" />
                Admin Manager
              </h1>
              <p className="text-muted-foreground">Manage administrator accounts and permissions</p>
            </div>
            
            <Dialog open={createAdminOpen} onOpenChange={setCreateAdminOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Create Admin
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Admin Account</DialogTitle>
                  <DialogDescription>
                    Create a new administrator account with specified role and permissions.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateAdmin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={createAdminForm.email}
                      onChange={(e) => setCreateAdminForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={createAdminForm.password}
                      onChange={(e) => setCreateAdminForm(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={createAdminForm.firstName}
                        onChange={(e) => setCreateAdminForm(prev => ({ ...prev, firstName: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={createAdminForm.lastName}
                        onChange={(e) => setCreateAdminForm(prev => ({ ...prev, lastName: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select 
                      value={createAdminForm.role} 
                      onValueChange={(value: 'admin' | 'super_admin') => 
                        setCreateAdminForm(prev => ({ ...prev, role: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setCreateAdminOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      Create Admin
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="p-3 bg-red-500/10 rounded-xl mr-4">
                <Crown className="w-8 h-8 text-red-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Super Admins</p>
                <p className="text-3xl font-bold text-foreground">
                  {admins.filter(admin => admin.role === 'super_admin').length}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="p-3 bg-blue-500/10 rounded-xl mr-4">
                <Shield className="w-8 h-8 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Admins</p>
                <p className="text-3xl font-bold text-foreground">
                  {admins.filter(admin => admin.role === 'admin').length}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="p-3 bg-gray-500/10 rounded-xl mr-4">
                <Users className="w-8 h-8 text-gray-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Regular Users</p>
                <p className="text-3xl font-bold text-foreground">
                  {allUsers.filter(user => user.role === 'user').length}
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
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Admin List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Administrator Accounts
            </CardTitle>
            <CardDescription>
              Manage existing administrator accounts and their permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingData ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Admin</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAdmins.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            {getRoleIcon(admin.role)}
                          </div>
                          <div>
                            <p className="font-medium">
                              {admin.first_name} {admin.last_name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              ID: {admin.user_id.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>
                        <Badge className={`text-white ${getRoleBadgeColor(admin.role)}`}>
                          {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(admin.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {admin.user_id !== user?.id && (
                            <Select
                              value={admin.role}
                              onValueChange={(value) => handleRoleUpdate(admin.user_id, value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="super_admin">Super Admin</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                          {admin.user_id === user?.id && (
                            <Badge variant="outline" className="text-xs">
                              You
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* User Promotion Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Promote Users to Admin
            </CardTitle>
            <CardDescription>
              Convert regular users to administrator accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No Users Found</h3>
                <p className="text-sm text-muted-foreground">
                  No regular users match your search criteria.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.slice(0, 10).map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-500/10 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-gray-500" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {user.first_name} {user.last_name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              ID: {user.user_id.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Select
                          value={user.role}
                          onValueChange={(value) => handleRoleUpdate(user.user_id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="super_admin">Super Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminManager;