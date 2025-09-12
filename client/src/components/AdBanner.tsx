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
      // Use correct parameter names that match the backend API
      const ads = await api.get(`/ads?is_active=true&position=${position}&type=${adType}`);
      console.log('Fetched ads:', ads); // Debug log
      if (ads && ads.length > 0) {
        // Get a random ad from the available ads
        const randomAd = ads[Math.floor(Math.random() * ads.length)];
        console.log('Selected ad:', randomAd); // Debug log
        setAd(randomAd);
        
        // Record view
        if (randomAd.id) {
          try {
            await fetch(`/api/ads/${randomAd.id}/impression`, { method: 'POST' });
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
    console.log('Ad clicked:', { adId: ad?.id, linkUrl: ad?.link_url }); // Debug log
    
    if (ad?.id) {
      try {
        await fetch(`/api/ads/${ad.id}/click`, { method: 'POST' });
        console.log('Click recorded successfully'); // Debug log
      } catch (error) {
        console.error('Error recording ad click:', error);
      }
    }
    
    if (ad?.link_url) {
      // Ensure the URL has a protocol
      let url = ad.link_url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      
      console.log('Opening link:', url); // Debug log
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      console.log('No link URL provided for ad'); // Debug log
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
  
  console.log('Date check:', {
    now: now.toISOString(),
    startDate: startDate?.toISOString(),
    endDate: endDate?.toISOString(),
    isBeforeStart: startDate && now < startDate,
    isAfterEnd: endDate && now > endDate
  });
  
  if (startDate && now < startDate) {
    console.log('Ad not shown: before start date');
    return null;
  }
  if (endDate && now > endDate) {
    console.log('Ad not shown: after end date');
    return null;
  }

  console.log('Rendering ad:', { ad, className }); // Debug log
  
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
              onLoad={() => console.log('Image loaded successfully:', ad.image_url)}
              onError={(e) => {
                console.error('Image failed to load:', ad.image_url);
                console.error('Error details:', e);
                console.error('Error target:', e.target);
                console.error('Error type:', e.type);
              }}
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
