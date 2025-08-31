import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Settings, 
  Bell, 
  Shield, 
  Eye, 
  EyeOff,
  Lock,
  Mail,
  Globe,
  Palette,
  Smartphone,
  CreditCard,
  Trash2,
  Download,
  Upload,
  Save,
  X,
  Check,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const UserSettings = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [settings, setSettings] = useState({
    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    orderUpdates: true,
    newPlans: false,
    priceAlerts: true,
    
    // Privacy
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    allowMessages: true,
    
    // Preferences
    language: 'en',
    currency: 'GHS',
    timezone: 'Africa/Accra',
    theme: 'system',
    
    // Security
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: '24h',
    
    // Data
    autoBackup: true,
    dataRetention: '2years'
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Use mock profile data if real profile is not available
  const userProfile = profile || {
    id: 'mock-id',
    user_id: user?.id || '',
    email: user?.email || '',
    first_name: 'John',
    last_name: 'Doe',
    role: 'user' as const,
    avatar_url: undefined
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveSettings = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Settings saved:', settings);
      // You could show a success toast here
    } catch (error) {
      console.error('Error saving settings:', error);
      // You could show an error toast here
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Password changed');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      // You could show a success toast here
    } catch (error) {
      console.error('Error changing password:', error);
      // You could show an error toast here
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = () => {
    const data = {
      profile: userProfile,
      settings,
      orders: [], // This would be fetched from your backend
      favorites: [] // This would be fetched from your backend
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `user-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const deleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Handle account deletion
      console.log('Account deletion requested');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-construction-gray-light">
      {/* Header */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/user/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>

            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Account Settings</h1>
                <p className="text-muted-foreground">Manage your account preferences and security</p>
              </div>
              <Button onClick={saveSettings} disabled={isLoading}>
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Settings Content */}
      <section className="py-16">
        <div className="container px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Settings Navigation */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <nav className="space-y-2">
                      <a href="#notifications" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                        <Bell className="h-4 w-4" />
                        <span>Notifications</span>
                      </a>
                      <a href="#privacy" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                        <Eye className="h-4 w-4" />
                        <span>Privacy</span>
                      </a>
                      <a href="#preferences" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                        <Palette className="h-4 w-4" />
                        <span>Preferences</span>
                      </a>
                      <a href="#security" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                        <Shield className="h-4 w-4" />
                        <span>Security</span>
                      </a>
                      <a href="#data" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                        <Download className="h-4 w-4" />
                        <span>Data & Export</span>
                      </a>
                    </nav>
                  </CardContent>
                </Card>
              </div>

              {/* Settings Forms */}
              <div className="lg:col-span-2 space-y-8">
                {/* Notifications */}
                <Card id="notifications">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Notifications
                    </CardTitle>
                    <CardDescription>
                      Manage how you receive notifications and updates
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="email-notifications">Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                        </div>
                        <Switch
                          id="email-notifications"
                          checked={settings.emailNotifications}
                          onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="sms-notifications">SMS Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                        </div>
                        <Switch
                          id="sms-notifications"
                          checked={settings.smsNotifications}
                          onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="marketing-emails">Marketing Emails</Label>
                          <p className="text-sm text-muted-foreground">Receive promotional emails and offers</p>
                        </div>
                        <Switch
                          id="marketing-emails"
                          checked={settings.marketingEmails}
                          onCheckedChange={(checked) => handleSettingChange('marketingEmails', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="order-updates">Order Updates</Label>
                          <p className="text-sm text-muted-foreground">Get notified about order status changes</p>
                        </div>
                        <Switch
                          id="order-updates"
                          checked={settings.orderUpdates}
                          onCheckedChange={(checked) => handleSettingChange('orderUpdates', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="new-plans">New Plans</Label>
                          <p className="text-sm text-muted-foreground">Get notified when new house plans are added</p>
                        </div>
                        <Switch
                          id="new-plans"
                          checked={settings.newPlans}
                          onCheckedChange={(checked) => handleSettingChange('newPlans', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="price-alerts">Price Alerts</Label>
                          <p className="text-sm text-muted-foreground">Get notified about price changes on favorited plans</p>
                        </div>
                        <Switch
                          id="price-alerts"
                          checked={settings.priceAlerts}
                          onCheckedChange={(checked) => handleSettingChange('priceAlerts', checked)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Privacy */}
                <Card id="privacy">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      Privacy
                    </CardTitle>
                    <CardDescription>
                      Control your privacy settings and profile visibility
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="profile-visibility">Profile Visibility</Label>
                        <Select value={settings.profileVisibility} onValueChange={(value) => handleSettingChange('profileVisibility', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                            <SelectItem value="friends">Friends Only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="show-email">Show Email</Label>
                          <p className="text-sm text-muted-foreground">Allow others to see your email address</p>
                        </div>
                        <Switch
                          id="show-email"
                          checked={settings.showEmail}
                          onCheckedChange={(checked) => handleSettingChange('showEmail', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="show-phone">Show Phone</Label>
                          <p className="text-sm text-muted-foreground">Allow others to see your phone number</p>
                        </div>
                        <Switch
                          id="show-phone"
                          checked={settings.showPhone}
                          onCheckedChange={(checked) => handleSettingChange('showPhone', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="allow-messages">Allow Messages</Label>
                          <p className="text-sm text-muted-foreground">Allow other users to send you messages</p>
                        </div>
                        <Switch
                          id="allow-messages"
                          checked={settings.allowMessages}
                          onCheckedChange={(checked) => handleSettingChange('allowMessages', checked)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Preferences */}
                <Card id="preferences">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5" />
                      Preferences
                    </CardTitle>
                    <CardDescription>
                      Customize your experience and display preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="language">Language</Label>
                        <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="currency">Currency</Label>
                        <Select value={settings.currency} onValueChange={(value) => handleSettingChange('currency', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="GHS">Ghanaian Cedi (₵)</SelectItem>
                            <SelectItem value="USD">US Dollar ($)</SelectItem>
                            <SelectItem value="EUR">Euro (€)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select value={settings.timezone} onValueChange={(value) => handleSettingChange('timezone', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Africa/Accra">Africa/Accra (GMT+0)</SelectItem>
                            <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                            <SelectItem value="America/New_York">Eastern Time (GMT-5)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="theme">Theme</Label>
                        <Select value={settings.theme} onValueChange={(value) => handleSettingChange('theme', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Security */}
                <Card id="security">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Security
                    </CardTitle>
                    <CardDescription>
                      Manage your account security and authentication
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                          <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                        </div>
                        <Switch
                          id="two-factor"
                          checked={settings.twoFactorAuth}
                          onCheckedChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="login-alerts">Login Alerts</Label>
                          <p className="text-sm text-muted-foreground">Get notified of new login attempts</p>
                        </div>
                        <Switch
                          id="login-alerts"
                          checked={settings.loginAlerts}
                          onCheckedChange={(checked) => handleSettingChange('loginAlerts', checked)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="session-timeout">Session Timeout</Label>
                        <Select value={settings.sessionTimeout} onValueChange={(value) => handleSettingChange('sessionTimeout', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1h">1 Hour</SelectItem>
                            <SelectItem value="8h">8 Hours</SelectItem>
                            <SelectItem value="24h">24 Hours</SelectItem>
                            <SelectItem value="7d">7 Days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Separator />

                    {/* Change Password */}
                    <div className="space-y-4">
                      <h4 className="font-medium">Change Password</h4>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="current-password">Current Password</Label>
                          <div className="relative">
                            <Input
                              id="current-password"
                              type={showCurrentPassword ? "text" : "password"}
                              value={passwordForm.currentPassword}
                              onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                              className="pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                            >
                              {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="new-password">New Password</Label>
                          <div className="relative">
                            <Input
                              id="new-password"
                              type={showNewPassword ? "text" : "password"}
                              value={passwordForm.newPassword}
                              onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                              className="pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                            >
                              {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="confirm-password">Confirm New Password</Label>
                          <div className="relative">
                            <Input
                              id="confirm-password"
                              type={showConfirmPassword ? "text" : "password"}
                              value={passwordForm.confirmPassword}
                              onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                              className="pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                            >
                              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                        
                        <Button onClick={changePassword} disabled={isLoading}>
                          <Lock className="h-4 w-4 mr-2" />
                          Change Password
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Data & Export */}
                <Card id="data">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Download className="h-5 w-5" />
                      Data & Export
                    </CardTitle>
                    <CardDescription>
                      Manage your data and export options
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="auto-backup">Auto Backup</Label>
                          <p className="text-sm text-muted-foreground">Automatically backup your data</p>
                        </div>
                        <Switch
                          id="auto-backup"
                          checked={settings.autoBackup}
                          onCheckedChange={(checked) => handleSettingChange('autoBackup', checked)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="data-retention">Data Retention</Label>
                        <Select value={settings.dataRetention} onValueChange={(value) => handleSettingChange('dataRetention', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1year">1 Year</SelectItem>
                            <SelectItem value="2years">2 Years</SelectItem>
                            <SelectItem value="5years">5 Years</SelectItem>
                            <SelectItem value="forever">Forever</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="font-medium">Data Export</h4>
                      <p className="text-sm text-muted-foreground">
                        Download a copy of your data including profile, orders, and preferences
                      </p>
                      <Button variant="outline" onClick={exportData}>
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
                      </Button>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="font-medium text-red-600">Danger Zone</h4>
                      <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                          <div className="flex-1">
                            <h5 className="font-medium text-red-900">Delete Account</h5>
                            <p className="text-sm text-red-700 mt-1">
                              Once you delete your account, there is no going back. Please be certain.
                            </p>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              className="mt-3"
                              onClick={deleteAccount}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Account
                            </Button>
                          </div>
                        </div>
                      </div>
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

export default UserSettings;
