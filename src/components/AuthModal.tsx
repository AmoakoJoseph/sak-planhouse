import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from '@/components/ui/dialog';
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Phone, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  Building,
  Shield
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [mode, setMode] = useState<'choice' | 'login' | 'register'>('choice');
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Login form data
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  // Register form data
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    receiveUpdates: false
  });

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempted:', loginData);
    // Handle login logic here
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Registration attempted:', registerData);
    // Handle registration logic here
  };

  const resetForm = () => {
    setMode('choice');
    setCurrentStep(1);
    setLoginData({ email: '', password: '', rememberMe: false });
    setRegisterData({
      firstName: '', lastName: '', email: '', phone: '',
      password: '', confirmPassword: '', agreeToTerms: false, receiveUpdates: false
    });
  };

  const handleModeSelect = (selectedMode: 'login' | 'register') => {
    setMode(selectedMode);
    setCurrentStep(1);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const loginSteps = [
    {
      title: 'Welcome Back',
      description: 'Sign in to access your account and continue building your dreams',
      icon: Shield
    },
    {
      title: 'Account Verification',
      description: 'We\'ll send you a verification code to secure your account',
      icon: CheckCircle
    }
  ];

  const registerSteps = [
    {
      title: 'Create Account',
      description: 'Join thousands of customers building their dreams with our plans',
      icon: User
    },
    {
      title: 'Personal Information',
      description: 'Tell us a bit about yourself to personalize your experience',
      icon: Building
    },
    {
      title: 'Account Security',
      description: 'Set up a secure password to protect your account',
      icon: Shield
    },
    {
      title: 'Terms & Preferences',
      description: 'Review our terms and set your communication preferences',
      icon: CheckCircle
    }
  ];

  const steps = mode === 'login' ? loginSteps : registerSteps;

  const renderChoiceStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <User className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Welcome to SAK Constructions</h3>
          <p className="text-sm text-muted-foreground">
            Choose how you'd like to access our premium construction plans
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <Button 
          variant="outline" 
          className="w-full h-16 text-lg" 
          onClick={() => handleModeSelect('login')}
        >
          <div className="flex items-center space-x-3">
            <Shield className="h-5 w-5" />
            <div className="text-left">
              <div className="font-semibold">Sign In</div>
              <div className="text-sm text-muted-foreground">Already have an account?</div>
            </div>
          </div>
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        <Button 
          className="w-full h-16 text-lg" 
          onClick={() => handleModeSelect('register')}
        >
          <div className="flex items-center space-x-3">
            <User className="h-5 w-5" />
            <div className="text-left">
              <div className="font-semibold">Create Account</div>
              <div className="text-sm text-primary-foreground/80">New to SAK Constructions?</div>
            </div>
          </div>
        </Button>
      </div>
    </div>
  );

  const renderLoginStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <form onSubmit={handleLoginSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                checked={loginData.rememberMe}
                onCheckedChange={(checked) => setLoginData({...loginData, rememberMe: checked as boolean})}
              />
              <Label htmlFor="rememberMe" className="text-sm">Remember me</Label>
            </div>

            <Button type="submit" className="w-full" onClick={() => setCurrentStep(2)}>
              Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </form>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Verification Required</h3>
                <p className="text-sm text-muted-foreground">
                  We've sent a verification code to {loginData.email}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Input placeholder="Enter verification code" className="text-center text-lg" />
              <Button className="w-full">
                Verify & Sign In
              </Button>
            </div>

            <Button variant="outline" className="w-full" onClick={() => setCurrentStep(1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  const renderRegisterStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Get Started</h3>
                <p className="text-sm text-muted-foreground">
                  Create your account to access premium construction plans
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Button className="w-full" onClick={() => setCurrentStep(2)}>
                Start Registration
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        );
      case 2:
        return (
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="firstName"
                    placeholder="First name"
                    value={registerData.firstName}
                    onChange={(e) => setRegisterData({...registerData, firstName: e.target.value})}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Last name"
                  value={registerData.lastName}
                  onChange={(e) => setRegisterData({...registerData, lastName: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={registerData.phone}
                  onChange={(e) => setRegisterData({...registerData, phone: e.target.value})}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => setCurrentStep(1)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button className="flex-1" onClick={() => setCurrentStep(3)}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </form>
        );
      case 3:
        return (
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => setCurrentStep(2)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button className="flex-1" onClick={() => setCurrentStep(4)}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </form>
        );
      case 4:
        return (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agreeToTerms"
                  checked={registerData.agreeToTerms}
                  onCheckedChange={(checked) => setRegisterData({...registerData, agreeToTerms: checked as boolean})}
                  className="mt-1"
                />
                <Label htmlFor="agreeToTerms" className="text-sm leading-relaxed">
                  I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and{' '}
                  <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                </Label>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="receiveUpdates"
                  checked={registerData.receiveUpdates}
                  onCheckedChange={(checked) => setRegisterData({...registerData, receiveUpdates: checked as boolean})}
                  className="mt-1"
                />
                <Label htmlFor="receiveUpdates" className="text-sm leading-relaxed">
                  I would like to receive updates about new plans and special offers
                </Label>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => setCurrentStep(3)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button type="submit" className="flex-1">
                Create Account
              </Button>
            </div>
          </form>
        );
      default:
        return null;
    }
  };

  const renderContent = () => {
    if (mode === 'choice') {
      return renderChoiceStep();
    } else if (mode === 'login') {
      return renderLoginStep();
    } else {
      return renderRegisterStep();
    }
  };

  const getTitle = () => {
    if (mode === 'choice') {
      return 'Welcome to SAK Constructions';
    }
    return steps[currentStep - 1]?.title || '';
  };

  const getDescription = () => {
    if (mode === 'choice') {
      return 'Choose how you\'d like to access our premium construction plans';
    }
    return steps[currentStep - 1]?.description || '';
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          {/* Logo */}
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-hover">
              <span className="text-xl font-bold text-primary-foreground">S</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-foreground">SAK CONSTRUCTIONS</span>
              <span className="text-xs text-muted-foreground">GH</span>
            </div>
          </div>

          <DialogTitle className="text-xl">
            {getTitle()}
          </DialogTitle>
          <DialogDescription>
            {getDescription()}
          </DialogDescription>

          {/* Progress Steps - Only show when not in choice mode */}
          {mode !== 'choice' && (
            <div className="flex justify-center space-x-2 mt-4">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index + 1 <= currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          )}
        </DialogHeader>

        <div className="mt-6">
          {renderContent()}
        </div>

        {/* Back to choice - Only show when in login/register mode */}
        {mode !== 'choice' && (
          <div className="mt-6 pt-6 border-t">
            <div className="text-center">
              <button
                onClick={() => setMode('choice')}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                ← Back to options
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
