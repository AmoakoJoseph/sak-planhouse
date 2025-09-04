import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Shield, ArrowLeft } from 'lucide-react';

const AdminLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  
  const { signIn, user, isAdmin, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && isAdmin) {
      navigate('/admin/dashboard');
    }
  }, [user, isAdmin, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(loginForm.email, loginForm.password);
      
      if (error) {
        toast({
          title: "Login Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        // Wait for profile to load to check admin status
        setTimeout(() => {
          toast({
            title: "Admin Login Successful",
            description: "Welcome to the admin dashboard."
          });
        }, 1000);
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Website
          </Button>
          
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/logo.png" 
              alt="SAK Constructions" 
              className="h-12 w-auto"
            />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Admin Access</h1>
          <p className="text-muted-foreground">Management Portal</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>
              Enter your admin credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@sakconstructionsgh.com"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your admin password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In to Dashboard'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;