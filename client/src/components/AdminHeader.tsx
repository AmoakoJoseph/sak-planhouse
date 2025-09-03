
import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Menu, Home, BarChart3, FileText, ShoppingCart, Users, Settings, LogOut, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const AdminHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
    { icon: FileText, label: 'Plans', href: '/admin/plans' },
    { icon: ShoppingCart, label: 'Orders', href: '/admin/orders' },
    { icon: Users, label: 'Users', href: '/admin/users' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isActiveRoute = (href: string) => {
    return location.pathname === href;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Link to="/admin/dashboard" className="flex items-center space-x-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-foreground">SAK Admin</span>
              <span className="text-xs text-muted-foreground">Management Portal</span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActiveRoute(item.href)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-primary hover:bg-accent'
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Badge variant="secondary" className="text-xs">
            {profile?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
          </Badge>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.avatar_url} alt={profile?.first_name || 'Admin'} />
                  <AvatarFallback className="text-sm">
                    {profile?.first_name?.[0] || 'A'}{profile?.last_name?.[0] || ''}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{profile?.first_name || 'Admin'} {profile?.last_name || ''}</p>
                  <p className="w-[200px] truncate text-sm text-muted-foreground">
                    {profile?.email || user?.email || 'admin@example.com'}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/admin/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/">
                  <Home className="mr-2 h-4 w-4" />
                  <span>View Site</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <div className="flex flex-col space-y-6 mt-6">
              <div className="flex items-center space-x-2 pb-4 border-b">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={profile?.avatar_url} alt={profile?.first_name || 'Admin'} />
                  <AvatarFallback>
                    {profile?.first_name?.[0] || 'A'}{profile?.last_name?.[0] || ''}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{profile?.first_name || 'Admin'} {profile?.last_name || ''}</p>
                  <Badge variant="secondary" className="text-xs">
                    {profile?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                  </Badge>
                </div>
              </div>

              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`flex items-center space-x-3 text-lg font-medium transition-colors ${
                    isActiveRoute(item.href)
                      ? 'text-primary'
                      : 'text-foreground hover:text-primary'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              ))}

              <div className="pt-6 border-t space-y-3">
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link to="/" onClick={() => setIsOpen(false)}>
                    <Home className="h-4 w-4 mr-2" />
                    View Site
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" onClick={() => {
                  handleSignOut();
                  setIsOpen(false);
                }}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default AdminHeader;
