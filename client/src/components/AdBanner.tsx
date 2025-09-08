import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { api } from '@/lib/api';

interface AdBannerProps {
  position?: 'top' | 'bottom' | 'sidebar' | 'inline';
  adType?: 'banner' | 'sidebar' | 'popup' | 'inline';
  className?: string;
}

const AdBanner = ({ position = 'top', adType = 'banner', className = '' }: AdBannerProps) => {
  const [ad, setAd] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAd();
  }, [position, adType]);

  const fetchAd = async () => {
    try {
      const ads = await api.get(`/ads?status=active&position=${position}&ad_type=${adType}`);
      if (ads && ads.length > 0) {
        // Get a random ad from the available ads
        const randomAd = ads[Math.floor(Math.random() * ads.length)];
        setAd(randomAd);
        
        // Record view
        if (randomAd.id) {
          try {
            await fetch(`/api/ads/${randomAd.id}/view`, { method: 'POST' });
          } catch (error) {
            console.error('Error recording ad view:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching ads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdClick = async () => {
    if (ad?.id) {
      try {
        await fetch(`/api/ads/${ad.id}/click`, { method: 'POST' });
      } catch (error) {
        console.error('Error recording ad click:', error);
      }
    }
    
    if (ad?.link_url) {
      window.open(ad.link_url, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <Card className="h-32 bg-muted rounded-lg" />
      </div>
    );
  }

  if (!ad) {
    return null;
  }

  // Check if ad is within date range
  const now = new Date();
  const startDate = ad.start_date ? new Date(ad.start_date) : null;
  const endDate = ad.end_date ? new Date(ad.end_date) : null;
  
  if (startDate && now < startDate) return null;
  if (endDate && now > endDate) return null;

  return (
    <div className={className}>
      <Card 
        className="overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 border-0 bg-white"
        onClick={handleAdClick}
      >
        {ad.image_url ? (
          <div className="relative">
            <img 
              src={ad.image_url} 
              alt={ad.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 right-2">
              <div className="bg-black/70 text-white text-xs px-2 py-1 rounded">
                {ad.title}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 text-center">
            <h3 className="font-semibold text-foreground mb-2">{ad.title}</h3>
            {ad.description && (
              <p className="text-sm text-muted-foreground">{ad.description}</p>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdBanner;
