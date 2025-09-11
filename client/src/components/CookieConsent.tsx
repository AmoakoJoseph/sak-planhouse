import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Cookie, Settings, Shield, BarChart3, Target, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

const defaultPreferences: CookiePreferences = {
  essential: true,
  analytics: false,
  marketing: false,
  preferences: false,
};

const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Check if user has already made a cookie choice
    const storedConsent = localStorage.getItem('cookie-consent');
    const storedPreferences = localStorage.getItem('cookie-preferences');
    
    if (!storedConsent) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    } else {
      setHasInteracted(true);
      if (storedPreferences) {
        setPreferences(JSON.parse(storedPreferences));
      }
    }
  }, []);

  const saveCookiePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookie-consent', 'true');
    localStorage.setItem('cookie-preferences', JSON.stringify(prefs));
    setPreferences(prefs);
    setHasInteracted(true);
    setShowBanner(false);
    setShowSettings(false);

    // Apply or remove tracking scripts based on preferences
    applyTrackingPreferences(prefs);
  };

  const applyTrackingPreferences = (prefs: CookiePreferences) => {
    // Google Analytics
    if (prefs.analytics) {
      // Enable GA if not already loaded
      if (!window.gtag) {
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
        document.head.appendChild(script);

        const inlineScript = document.createElement('script');
        inlineScript.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'GA_MEASUREMENT_ID');
        `;
        document.head.appendChild(inlineScript);
      }
    } else {
      // Disable GA tracking
      if (window.gtag) {
        window.gtag('consent', 'update', {
          analytics_storage: 'denied'
        });
      }
    }

    // Marketing cookies (Facebook Pixel, etc.)
    if (prefs.marketing) {
      // Enable marketing tracking
      console.log('Marketing cookies enabled');
    } else {
      // Disable marketing tracking
      console.log('Marketing cookies disabled');
    }

    // Preferences cookies
    if (prefs.preferences) {
      // Enable preferences tracking
      console.log('Preference cookies enabled');
    }
  };

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      essential: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    saveCookiePreferences(allAccepted);
  };

  const acceptEssential = () => {
    saveCookiePreferences(defaultPreferences);
  };

  const handleCustomSave = () => {
    saveCookiePreferences(preferences);
  };

  const cookieTypes = [
    {
      id: 'essential',
      title: 'Essential Cookies',
      description: 'Required for the website to function properly. These cannot be disabled.',
      icon: Shield,
      required: true,
      examples: ['Authentication', 'Security', 'Session management']
    },
    {
      id: 'analytics',
      title: 'Analytics Cookies',
      description: 'Help us understand how visitors interact with our website.',
      icon: BarChart3,
      required: false,
      examples: ['Page views', 'User behavior', 'Performance metrics']
    },
    {
      id: 'marketing',
      title: 'Marketing Cookies',
      description: 'Used to deliver personalized advertisements and track their effectiveness.',
      icon: Target,
      required: false,
      examples: ['Ad targeting', 'Campaign tracking', 'Social media integration']
    },
    {
      id: 'preferences',
      title: 'Preference Cookies',
      description: 'Remember your settings and preferences for a better user experience.',
      icon: Settings,
      required: false,
      examples: ['Language settings', 'Theme preferences', 'Layout customizations']
    }
  ];

  if (!showBanner && !showSettings) {
    return null;
  }

  return (
    <>
      {/* Cookie Consent Banner */}
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur-lg border-t shadow-lg">
          <div className="container mx-auto">
            <Card className="border shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Cookie className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">
                        We use cookies to enhance your experience
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        We use cookies to provide you with the best possible experience. You can review and change your preferences at any time.{' '}
                        <Link 
                          to="/cookies" 
                          className="text-primary hover:underline font-medium"
                        >
                          Learn more
                        </Link>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    <Button
                      variant="outline"
                      onClick={() => setShowSettings(true)}
                      className="flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Customize
                    </Button>
                    <Button
                      variant="outline"
                      onClick={acceptEssential}
                    >
                      Essential Only
                    </Button>
                    <Button
                      onClick={acceptAll}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Accept All
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Cookie Settings Modal */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Cookie className="w-5 h-5 text-primary" />
              <DialogTitle>Cookie Preferences</DialogTitle>
            </div>
            <DialogDescription>
              Manage your cookie preferences. Essential cookies are required for the site to function properly.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="categories" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="categories">Cookie Categories</TabsTrigger>
              <TabsTrigger value="details">Detailed Information</TabsTrigger>
            </TabsList>

            <TabsContent value="categories" className="space-y-4">
              {cookieTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <Card key={type.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-foreground">{type.title}</h4>
                            {type.required && (
                              <Badge variant="secondary" className="text-xs">
                                Required
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {type.description}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {type.examples.map((example, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {example}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <Switch
                        checked={preferences[type.id as keyof CookiePreferences]}
                        onCheckedChange={(checked) => {
                          if (!type.required) {
                            setPreferences(prev => ({
                              ...prev,
                              [type.id]: checked
                            }));
                          }
                        }}
                        disabled={type.required}
                      />
                    </div>
                  </Card>
                );
              })}
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Cookie Policy Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">What are cookies?</h4>
                    <p className="text-muted-foreground">
                      Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
                      They help us provide you with a better user experience and enable certain functionality.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">How we use cookies</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>To keep you logged in to your account</li>
                      <li>To remember your preferences and settings</li>
                      <li>To analyze how our website is used</li>
                      <li>To provide personalized content and advertisements</li>
                      <li>To improve our services and user experience</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Managing cookies</h4>
                    <p className="text-muted-foreground">
                      You can control and manage cookies in various ways. You can delete all cookies from your browser, 
                      or you can set your browser to prevent cookies from being stored.
                    </p>
                  </div>
                  
                  <div className="pt-2">
                    <Link 
                      to="/cookies" 
                      className="text-primary hover:underline font-medium"
                    >
                      Read our full Cookie Policy →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Cookie className="w-4 h-4" />
              <span>
                {Object.values(preferences).filter(Boolean).length} of {Object.keys(preferences).length} categories enabled
              </span>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowSettings(false)}>
                Cancel
              </Button>
              <Button variant="outline" onClick={acceptEssential}>
                Essential Only
              </Button>
              <Button onClick={handleCustomSave}>
                Save Preferences
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cookie Settings Trigger (Always available) */}
      {hasInteracted && (
        <Button
          onClick={() => setShowSettings(true)}
          variant="ghost"
          size="sm"
          className="fixed bottom-4 left-4 z-40 bg-background/80 backdrop-blur border shadow-lg"
        >
          <Cookie className="w-4 h-4 mr-2" />
          Cookie Settings
        </Button>
      )}
    </>
  );
};

// Extend window interface for gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export default CookieConsent;