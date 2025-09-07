import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Camera,
  Save,
  Edit,
  X,
  Check,
  Shield
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useFavorites } from '@/hooks/useFavorites';
import { useToast } from '@/hooks/use-toast';
import FloatingNav from '@/components/FloatingNav';

const UserProfile = () => {
  const { user, profile, signOut } = useAuth();
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    bio: ''
  });
  const [userStats, setUserStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    favoritePlans: 0,
    downloads: 0
  });

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    setFormData({
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      email: profile?.email || user.email || '',
      phone: profile?.phone || '',
      bio: profile?.bio || ''
    });

    // Fetch real user statistics
    if (user.id) {
      fetchUserStats();
    }
  }, [user, profile, navigate]);

  const fetchUserStats = async () => {
    try {
      const response = await fetch(`/api/analytics/user/${user.id}`);
      if (response.ok) {
        const analytics = await response.json();
        setUserStats({
          totalOrders: analytics.totalOrders || 0,
          totalSpent: analytics.totalSpent || 0,
          favoritePlans: analytics.totalFavorites || 0,
          downloads: analytics.totalDownloads || 0
        });
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Update profile in backend
      const response = await fetch(`/api/profiles/${profile?.user_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Profile updated!",
          description: "Your profile information has been saved successfully.",
        });
        setIsEditing(false);
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      email: profile?.email || user?.email || '',
      phone: profile?.phone || '',
      bio: profile?.bio || ''
    });
    setIsEditing(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPG, PNG, GIF, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image size must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const result = await response.json();
      
      // Update profile with new avatar URL
      const updateResponse = await fetch(`/api/profiles/${profile?.user_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          avatar_url: result.url
        }),
      });

      if (updateResponse.ok) {
        toast({
          title: "Avatar updated!",
          description: "Your profile picture has been updated successfully.",
        });
        // Refresh the page or update the profile state
        window.location.reload();
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-construction-gray-light">
      <FloatingNav />

      {/* Profile Content */}
      <section className="py-12">
        <div className="container px-4 mx-auto">
          {/* Page Header */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Profile</h1>
                <p className="text-muted-foreground">Manage your account information and preferences</p>
              </div>
            </div>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Profile Card */}
              <div className="lg:col-span-1">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <div className="relative inline-block group">
                        <Avatar className="h-24 w-24 mx-auto transition-all duration-300 group-hover:scale-105">
                          <AvatarImage src={profile?.avatar_url} />
                          <AvatarFallback className="text-2xl">
                            {profile?.first_name?.[0]}{profile?.last_name?.[0] || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        {isEditing && (
                          <Button
                            size="sm"
                            variant="secondary"
                            className="absolute -bottom-2 -right-2 h-8 w-8 p-0 rounded-full shadow-lg hover:scale-110 transition-transform duration-200"
                            onClick={handleAvatarClick}
                            disabled={isUploadingAvatar}
                            title="Change avatar"
                          >
                            {isUploadingAvatar ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                            ) : (
                              <Camera className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                        
                        {/* Hidden file input for avatar upload */}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                        />
                        
                        {/* Upload hint */}
                        {isEditing && (
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full flex items-center justify-center">
                            <p className="text-white text-xs font-medium">Click to change</p>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h2 className="text-xl font-semibold">
                          {profile?.first_name} {profile?.last_name}
                        </h2>
                        <p className="text-muted-foreground">{profile?.email}</p>
                        <Badge variant="secondary" className="mt-2">
                          {profile?.role}
                        </Badge>
                      </div>

                      <Separator />

                                             <div className="space-y-3 text-sm">
                         <div className="flex items-center gap-2 text-muted-foreground">
                           <Calendar className="h-4 w-4" />
                           <span>Member since {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently'}</span>
                         </div>
                        {profile?.phone && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            <span>{profile.phone}</span>
                          </div>
                        )}
                        {profile?.city && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{profile.city}, {profile.country}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                                 {/* Account Stats */}
                 <Card className="mt-6">
                   <CardHeader>
                     <CardTitle className="text-lg">Account Statistics</CardTitle>
                   </CardHeader>
                   <CardContent>
                     <div className="space-y-4">
                       <div className="flex items-center justify-between">
                         <span className="text-sm text-muted-foreground">Total Orders</span>
                         <span className="font-semibold">{userStats.totalOrders}</span>
                       </div>
                       <div className="flex items-center justify-between">
                         <span className="text-sm text-muted-foreground">Favorite Plans</span>
                         <span className="font-semibold">{userStats.favoritePlans}</span>
                       </div>
                       <div className="flex items-center justify-between">
                         <span className="text-sm text-muted-foreground">Downloads</span>
                         <span className="font-semibold">{userStats.downloads}</span>
                       </div>
                       <div className="flex items-center justify-between">
                         <span className="text-sm text-muted-foreground">Total Spent</span>
                         <span className="font-semibold">₵{userStats.totalSpent.toLocaleString()}</span>
                       </div>
                     </div>
                   </CardContent>
                 </Card>
              </div>

              {/* Profile Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Personal Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Personal Information
                    </CardTitle>
                    <CardDescription>
                      Update your personal details and contact information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first_name">First Name</Label>
                        <Input
                          id="first_name"
                          value={formData.first_name}
                          onChange={(e) => handleInputChange('first_name', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last_name">Last Name</Label>
                        <Input
                          id="last_name"
                          value={formData.last_name}
                          onChange={(e) => handleInputChange('last_name', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        disabled={!isEditing}
                        placeholder="0246798967"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Tell us about yourself..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>


                {/* Account Security */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Account Security
                    </CardTitle>
                    <CardDescription>
                      Manage your account security and privacy settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Change Password</h4>
                        <p className="text-sm text-muted-foreground">Update your account password</p>
                      </div>
                      <Button variant="outline">Change</Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Two-Factor Authentication</h4>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                      </div>
                      <Button variant="outline">Enable</Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Account Deactivation</h4>
                        <p className="text-sm text-muted-foreground">Temporarily disable your account</p>
                      </div>
                      <Button variant="destructive" onClick={signOut}>Sign Out</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserProfile;