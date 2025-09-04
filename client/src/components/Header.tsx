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
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg' 
          : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="hidden sm:block">
                <div className="flex items-center space-x-2">
                  <img 
                    src="/logo.png" 
                    alt="SAK Constructions" 
                    className="h-8 w-auto"
                  />
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 group ${
                      isActive(item.href)
                        ? 'text-primary bg-primary/10 border border-primary/20'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4">
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
                  className="btn-primary"
                >
                  <User className="w-4 h-4 mr-2" />
                  Get Started
                </Button>
              )}
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
                    className="w-full btn-primary"
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

      {/* Spacer for fixed header */}
      <div className="h-16 lg:h-20"></div>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
};

export default Header;