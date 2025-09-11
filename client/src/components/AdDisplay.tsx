import { useEffect, useState } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Ad {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  type: string;
  position: string;
  image_url: string | null;
  link_url: string | null;
  target_page: string;
  is_active: boolean;
  priority: number;
  impressions: number;
  clicks: number;
  start_date: string | null;
  end_date: string | null;
}

interface AdDisplayProps {
  position: string;
  targetPage: string;
  className?: string;
}

const AdDisplay: React.FC<AdDisplayProps> = ({ position, targetPage, className }) => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [dismissedAds, setDismissedAds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchAds();
  }, [position, targetPage]);

  const fetchAds = async () => {
    try {
      const response = await fetch(`/api/ads?is_active=true&target_page=${targetPage}`);
      if (response.ok) {
        const allAds = await response.json();
        const filteredAds = allAds.filter((ad: Ad) => 
          (ad.position === position || ad.position === 'all') &&
          (ad.target_page === targetPage || ad.target_page === 'all') &&
          !dismissedAds.has(ad.id) &&
          isAdActive(ad)
        );
        
        // Sort by priority and creation date
        filteredAds.sort((a: Ad, b: Ad) => b.priority - a.priority || new Date(b.start_date || '').getTime() - new Date(a.start_date || '').getTime());
        
        setAds(filteredAds);
      }
    } catch (error) {
      console.error('Error fetching ads:', error);
    } finally {
      setLoading(false);
    }
  };

  const isAdActive = (ad: Ad): boolean => {
    const now = new Date();
    const startDate = ad.start_date ? new Date(ad.start_date) : null;
    const endDate = ad.end_date ? new Date(ad.end_date) : null;

    if (startDate && now < startDate) return false;
    if (endDate && now > endDate) return false;

    return true;
  };

  const recordImpression = async (adId: string) => {
    try {
      await fetch(`/api/ads/${adId}/impression`, { method: 'POST' });
    } catch (error) {
      console.error('Error recording impression:', error);
    }
  };

  const recordClick = async (adId: string) => {
    try {
      await fetch(`/api/ads/${adId}/click`, { method: 'POST' });
    } catch (error) {
      console.error('Error recording click:', error);
    }
  };

  const handleAdClick = async (ad: Ad) => {
    await recordClick(ad.id);
    if (ad.link_url) {
      window.open(ad.link_url, '_blank', 'noopener,noreferrer');
    }
  };

  const dismissAd = (adId: string) => {
    setDismissedAds(prev => new Set([...prev, adId]));
    setAds(prev => prev.filter(ad => ad.id !== adId));
  };

  // Record impressions when ads are loaded
  useEffect(() => {
    ads.forEach(ad => {
      recordImpression(ad.id);
    });
  }, [ads]);

  if (loading || ads.length === 0) {
    return null;
  }

  const renderBannerAd = (ad: Ad) => (
    <Card key={ad.id} className={cn("w-full mb-4 border shadow-sm", className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div 
              className="cursor-pointer" 
              onClick={() => handleAdClick(ad)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleAdClick(ad);
                }
              }}
            >
              <div className="flex items-center gap-4">
                {ad.image_url && (
                  <img 
                    src={ad.image_url} 
                    alt={ad.title}
                    className="w-20 h-16 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-foreground hover:text-primary transition-colors">
                    {ad.title}
                    {ad.link_url && (
                      <ExternalLink className="inline-block w-3 h-3 ml-1" />
                    )}
                  </h3>
                  {ad.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {ad.description}
                    </p>
                  )}
                </div>
              </div>
              
              {ad.content && (
                <div 
                  className="mt-2 text-xs prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: ad.content }}
                />
              )}
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dismissAd(ad.id)}
            className="ml-2 h-6 w-6 p-0 opacity-50 hover:opacity-100"
            aria-label="Dismiss ad"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
        
        <div className="flex justify-between items-center mt-3 pt-2 border-t">
          <span className="text-xs text-muted-foreground">Sponsored</span>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{ad.impressions.toLocaleString()} views</span>
            <span>•</span>
            <span>{ad.clicks.toLocaleString()} clicks</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderSidebarAd = (ad: Ad) => (
    <Card key={ad.id} className={cn("w-full mb-4 border shadow-sm", className)}>
      <CardContent className="p-3">
        <div className="flex items-start justify-between mb-2">
          <span className="text-xs text-muted-foreground">Sponsored</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dismissAd(ad.id)}
            className="h-4 w-4 p-0 opacity-50 hover:opacity-100"
          >
            <X className="w-2 h-2" />
          </Button>
        </div>
        
        <div 
          className="cursor-pointer" 
          onClick={() => handleAdClick(ad)}
          role="button"
          tabIndex={0}
        >
          {ad.image_url && (
            <img 
              src={ad.image_url} 
              alt={ad.title}
              className="w-full h-32 object-cover rounded mb-2"
            />
          )}
          
          <h4 className="font-medium text-sm text-foreground hover:text-primary transition-colors mb-1">
            {ad.title}
            {ad.link_url && (
              <ExternalLink className="inline-block w-3 h-3 ml-1" />
            )}
          </h4>
          
          {ad.description && (
            <p className="text-xs text-muted-foreground line-clamp-3 mb-2">
              {ad.description}
            </p>
          )}
          
          {ad.content && (
            <div 
              className="text-xs prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: ad.content }}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderPopupAd = (ad: Ad) => (
    <div key={ad.id} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full bg-background shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <span className="text-xs text-muted-foreground bg-accent px-2 py-1 rounded">Sponsored</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dismissAd(ad.id)}
              className="h-6 w-6 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div 
            className="cursor-pointer" 
            onClick={() => handleAdClick(ad)}
            role="button"
            tabIndex={0}
          >
            {ad.image_url && (
              <img 
                src={ad.image_url} 
                alt={ad.title}
                className="w-full h-48 object-cover rounded mb-4"
              />
            )}
            
            <h3 className="text-lg font-semibold text-foreground hover:text-primary transition-colors mb-2">
              {ad.title}
              {ad.link_url && (
                <ExternalLink className="inline-block w-4 h-4 ml-1" />
              )}
            </h3>
            
            {ad.description && (
              <p className="text-sm text-muted-foreground mb-3">
                {ad.description}
              </p>
            )}
            
            {ad.content && (
              <div 
                className="text-sm prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: ad.content }}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderInlineAd = (ad: Ad) => (
    <div key={ad.id} className={cn("w-full my-6 p-4 bg-accent/5 border-l-4 border-primary/20 rounded-r", className)}>
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs text-muted-foreground">Sponsored Content</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => dismissAd(ad.id)}
          className="h-4 w-4 p-0 opacity-50 hover:opacity-100"
        >
          <X className="w-3 h-3" />
        </Button>
      </div>
      
      <div 
        className="cursor-pointer" 
        onClick={() => handleAdClick(ad)}
        role="button"
        tabIndex={0}
      >
        <div className="flex items-center gap-3">
          {ad.image_url && (
            <img 
              src={ad.image_url} 
              alt={ad.title}
              className="w-16 h-16 object-cover rounded"
            />
          )}
          
          <div className="flex-1">
            <h4 className="font-medium text-foreground hover:text-primary transition-colors">
              {ad.title}
              {ad.link_url && (
                <ExternalLink className="inline-block w-3 h-3 ml-1" />
              )}
            </h4>
            
            {ad.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {ad.description}
              </p>
            )}
          </div>
        </div>
        
        {ad.content && (
          <div 
            className="mt-3 text-sm prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: ad.content }}
          />
        )}
      </div>
    </div>
  );

  const renderAd = (ad: Ad) => {
    switch (ad.type) {
      case 'banner':
        return renderBannerAd(ad);
      case 'sidebar':
        return renderSidebarAd(ad);
      case 'popup':
        return renderPopupAd(ad);
      case 'inline':
        return renderInlineAd(ad);
      default:
        return renderBannerAd(ad);
    }
  };

  return (
    <div className={cn("ad-container", className)}>
      {ads.map(renderAd)}
    </div>
  );
};

export default AdDisplay;