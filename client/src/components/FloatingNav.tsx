import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  X, 
  Home, 
  User, 
  Settings, 
  ShoppingBag, 
  Heart,
  Download,
  ArrowLeft
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const FloatingNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const isUserPage = location.pathname.startsWith('/user');
  const isAdminPage = location.pathname.startsWith('/admin');

  if (!isUserPage && !isAdminPage) {
    return null; // Don't show on main site pages
  }

  const getCurrentPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Dashboard';
    if (path.includes('/profile')) return 'Profile';
    if (path.includes('/orders')) return 'Orders';
    if (path.includes('/favorites')) return 'Favorites';
    if (path.includes('/settings')) return 'Settings';
    if (path.includes('/admin')) return 'Admin';
    return 'User Area';
  };

  const userNavItems = [
    { name: 'Dashboard', href: '/user/dashboard', icon: Home },
    { name: 'Profile', href: '/user/profile', icon: User },
    { name: 'Orders', href: '/user/orders', icon: ShoppingBag },
    { name: 'Favorites', href: '/user/favorites', icon: Heart },
    { name: 'Settings', href: '/user/settings', icon: Settings },
  ];

  const adminNavItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
    { name: 'Plans', href: '/admin/plans', icon: Download },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Users', href: '/admin/users', icon: User },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const navItems = isAdminPage ? adminNavItems : userNavItems;

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Navigation Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="fixed bottom-24 right-6 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 min-w-[280px] max-w-[320px]">
            {/* Header */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">
                  {getCurrentPageTitle()}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {user && (
                <p className="text-sm text-gray-500 mt-1">
                  {user.email}
                </p>
              )}
            </div>

            {/* Navigation Items */}
            <div className="p-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-gray-100 space-y-2">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="w-full"
              >
                <Link to="/" onClick={() => setIsOpen(false)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Site
                </Link>
              </Button>
              
              {isUserPage && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="w-full"
                >
                  <Link to="/plans" onClick={() => setIsOpen(false)}>
                    <Download className="h-4 w-4 mr-2" />
                    Browse Plans
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default FloatingNav;
