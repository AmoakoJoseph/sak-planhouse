import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Menu, 
  X, 
  Building2, 
  Home, 
  FileText, 
  Info, 
  Phone, 
  User, 
  ShoppingCart,
  Heart,
  LogOut,
  Settings,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import AuthModal from './AuthModal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/ThemeToggle';
import AdBanner from './AdBanner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, profile, isAuthenticated, signOut } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAuthClick = () => {
    setAuthModalOpen(true);
  };

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Plans', href: '/plans', icon: FileText },
    { name: 'Services', href: '/services', icon: Building2 },
    { name: 'About', href: '/about', icon: Info },
    { name: 'Contact', href: '/contact', icon: Phone },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Top Header Ad Banner */}
      <div className="w-full bg-background border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 py-2">
          <AdBanner position="top" adType="banner" className="h-16" />
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/70 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="flex items-center space-x-3">
                {/* Company Logo */}
                <img 
                  src="/logo.png" 
                  alt="SAK Constructions" 
                  className="h-12 w-auto hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-slate-900'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="flex items-center gap-4">
              {/* Sidebar Ad for Desktop */}
              <div className="hidden lg:block">
                <AdBanner position="sidebar" adType="sidebar" className="w-32 h-20" />
              </div>
              
              <div className="flex items-center gap-2">
                <ThemeToggle />
                {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 hover:bg-muted/50">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={profile?.avatar_url} alt={profile?.first_name || user?.email} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {profile?.first_name?.[0]}{profile?.last_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {profile?.first_name} {profile?.last_name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/user/dashboard" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/user/profile" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/user/orders" className="cursor-pointer">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        <span>Orders</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/user/favorites" className="cursor-pointer">
                        <Heart className="mr-2 h-4 w-4" />
                        <span>Favorites</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  onClick={handleAuthClick}
                  className="ml-2 inline-flex items-center gap-2 rounded-2xl bg-orange-600 text-white px-4 py-2 text-sm font-semibold hover:bg-orange-700 transition-colors"
                >
                  <User className="w-4 h-4" />
                  Get Started
                </Button>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-muted/50 hover:bg-muted/80 transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl">
            <div className="container mx-auto px-4 py-6">
              <nav className="space-y-4">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                        isActive(item.href)
                          ? 'text-primary bg-primary/10 border border-primary/20'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-6 pt-6 border-t border-border/50 space-y-4">
                {/* Theme Toggle for Mobile */}
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm font-medium">Theme</span>
                  <ThemeToggle />
                </div>
                
                {isAuthenticated ? (
                  <>
                    {/* User Profile Section */}
                    <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={profile?.avatar_url} alt={profile?.first_name || user?.email} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {profile?.first_name?.[0]}{profile?.last_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-none">
                          {profile?.first_name} {profile?.last_name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground truncate">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    
                    {/* User Menu Items */}
                    <div className="space-y-2">
                      <Link to="/user/dashboard" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="outline" className="w-full btn-outline-modern justify-start">
                          <User className="w-4 h-4 mr-3" />
                          Dashboard
                        </Button>
                      </Link>
                      <Link to="/user/profile" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="outline" className="w-full btn-outline-modern justify-start">
                          <Settings className="w-4 h-4 mr-3" />
                          Profile
                        </Button>
                      </Link>
                      <Link to="/user/orders" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="outline" className="w-full btn-outline-modern justify-start">
                          <ShoppingCart className="w-4 h-4 mr-3" />
                          Orders
                        </Button>
                      </Link>
                      <Link to="/user/favorites" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="outline" className="w-full btn-outline-modern justify-start">
                          <Heart className="w-4 h-4 mr-3" />
                          Favorites
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        onClick={handleSignOut}
                        className="w-full btn-outline-modern justify-start"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Sign Out
                      </Button>
                    </div>
                  </>
                ) : (
                  <Button 
                    onClick={() => {
                      handleAuthClick();
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Get Started
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>


      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
};

export default Header;