import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Home, 
  User, 
  Settings, 
  ShoppingBag, 
  Heart,
  Download,
  Calendar,
  MapPin,
  Phone
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface UserHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backTo?: string;
  backText?: string;
  actions?: React.ReactNode;
  showUserInfo?: boolean;
  showBreadcrumbs?: boolean;
}

const UserHeader = ({ 
  title, 
  subtitle, 
  showBackButton = true, 
  backTo = "/user/dashboard", 
  backText = "Back to Dashboard",
  actions,
  showUserInfo = true,
  showBreadcrumbs = true
}: UserHeaderProps) => {
  const { user, profile } = useAuth();
  const location = useLocation();

  const getBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [];
    
    if (pathSegments[0] === 'user') {
      breadcrumbs.push({ name: 'Dashboard', href: '/user/dashboard', icon: Home });
      
      if (pathSegments[1] && pathSegments[1] !== 'dashboard') {
        switch (pathSegments[1]) {
          case 'profile':
            breadcrumbs.push({ name: 'Profile', href: '/user/profile', icon: User });
            break;
          case 'orders':
            breadcrumbs.push({ name: 'Orders', href: '/user/orders', icon: ShoppingBag });
            break;
          case 'favorites':
            breadcrumbs.push({ name: 'Favorites', href: '/user/favorites', icon: Heart });
            break;
          case 'downloads':
            breadcrumbs.push({ name: 'Downloads', href: '/user/downloads', icon: Download });
            break;
          case 'settings':
            breadcrumbs.push({ name: 'Settings', href: '/user/settings', icon: Settings });
            break;
          default:
            breadcrumbs.push({ name: pathSegments[1].charAt(0).toUpperCase() + pathSegments[1].slice(1), href: location.pathname, icon: User });
        }
      }
    }
    
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <section className="py-16 bg-gradient-to-r from-primary/10 to-primary/5">
      <div className="container px-4">
        <div className="max-w-7xl mx-auto">
          {/* Back Button and Breadcrumbs */}
          <div className="flex items-center gap-4 mb-8">
            {showBackButton && (
              <Button variant="ghost" size="sm" asChild>
                <Link to={backTo}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {backText}
                </Link>
              </Button>
            )}
            
            {showBreadcrumbs && breadcrumbs.length > 1 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {breadcrumbs.map((crumb, index) => (
                  <div key={crumb.href} className="flex items-center gap-2">
                    {index > 0 && <span>/</span>}
                    <Link 
                      to={crumb.href} 
                      className="flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                      <crumb.icon className="h-3 w-3" />
                      {crumb.name}
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Main Header Content */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
              {subtitle && (
                <p className="text-muted-foreground text-lg">{subtitle}</p>
              )}
            </div>
            
            {actions && (
              <div className="flex items-center gap-3">
                {actions}
              </div>
            )}
          </div>

          {/* User Info Card */}
          {showUserInfo && user && (
            <Card className="bg-card/95 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profile?.avatar_url} />
                    <AvatarFallback className="text-lg">
                      {profile?.first_name?.[0]}{profile?.last_name?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-2">
                      {profile?.first_name} {profile?.last_name}
                    </h2>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {profile?.email || user.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{profile?.role || 'user'}</Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Member since {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently'}</span>
                      </div>
                      {profile?.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          <span>{profile.phone}</span>
                        </div>
                      )}
                      {profile?.city && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{profile.city}, {profile.country}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/user/profile">
                        <User className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/user/settings">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};

export default UserHeader;
