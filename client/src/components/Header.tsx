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
  Settings
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import AuthModal from './AuthModal';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAuthenticated, signOut } = useAuth();
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
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-primary to-secondary rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl lg:text-2xl font-bold gradient-text">SAK Constructions</h1>
                <p className="text-xs text-muted-foreground">Premium Plans Platform</p>
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
                <>
                  <Link to="/dashboard">
                    <Button variant="outline" className="btn-outline-modern">
                      <User className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link to="/favorites">
                    <Button variant="outline" className="btn-outline-modern">
                      <Heart className="w-4 h-4 mr-2" />
                      Favorites
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    onClick={handleSignOut}
                    className="btn-outline-modern"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    onClick={handleAuthClick}
                    className="btn-outline-modern"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                  <Button 
                    onClick={handleAuthClick}
                    className="btn-primary"
                  >
                    Get Started
                  </Button>
                </>
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
                    <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full btn-outline-modern">
                        <User className="w-4 h-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                    <Link to="/favorites" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full btn-outline-modern">
                        <Heart className="w-4 h-4 mr-2" />
                        Favorites
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      onClick={handleSignOut}
                      className="w-full btn-outline-modern"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        handleAuthClick();
                        setIsMenuOpen(false);
                      }}
                      className="w-full btn-outline-modern"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                    <Button 
                      onClick={() => {
                        handleAuthClick();
                        setIsMenuOpen(false);
                      }}
                      className="w-full btn-primary"
                    >
                      Get Started
                    </Button>
                  </>
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