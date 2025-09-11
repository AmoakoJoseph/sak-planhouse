import React, { useEffect } from 'react';
import { useScreenshotProtection } from '@/hooks/useScreenshotProtection';
import { Shield, Eye, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ScreenshotProtectionProps {
  enabled?: boolean;
  level?: 'basic' | 'standard' | 'strict';
  showStatus?: boolean;
  onViolation?: (type: string, count: number) => void;
}

const ScreenshotProtection: React.FC<ScreenshotProtectionProps> = ({
  enabled = true,
  level = 'standard',
  showStatus = false,
  onViolation,
}) => {
  const protectionLevels = {
    basic: {
      enabled: true,
      blurOnFocusLoss: false,
      disableRightClick: true,
      disableF12: false,
      disablePrintScreen: true,
      disableSelection: false,
      showWarnings: true,
    },
    standard: {
      enabled: true,
      blurOnFocusLoss: true,
      disableRightClick: true,
      disableF12: true,
      disablePrintScreen: true,
      disableSelection: false,
      showWarnings: true,
    },
    strict: {
      enabled: true,
      blurOnFocusLoss: true,
      disableRightClick: true,
      disableF12: true,
      disablePrintScreen: true,
      disableSelection: true,
      showWarnings: true,
    },
  };

  const { isProtected, violationCount } = useScreenshotProtection({
    ...protectionLevels[level],
    enabled,
    onViolationDetected: (type: string) => {
      onViolation?.(type, violationCount + 1);
    },
  });

  // Add meta tag to disable screenshots on mobile
  useEffect(() => {
    if (enabled) {
      const metaTag = document.createElement('meta');
      metaTag.name = 'screen-capture';
      metaTag.content = 'disabled';
      document.head.appendChild(metaTag);

      // iOS specific protection
      const iOSMeta = document.createElement('meta');
      iOSMeta.name = 'format-detection';
      iOSMeta.content = 'telephone=no';
      document.head.appendChild(iOSMeta);

      return () => {
        document.head.removeChild(metaTag);
        document.head.removeChild(iOSMeta);
      };
    }
  }, [enabled]);

  if (!showStatus) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-72 shadow-lg border-l-4 border-l-primary">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Shield className={`w-4 h-4 ${isProtected ? 'text-green-500' : 'text-gray-400'}`} />
              <span className="text-sm font-medium">Content Protection</span>
            </div>
            <Badge variant={isProtected ? 'default' : 'secondary'} className="text-xs">
              {isProtected ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Protection Level:</span>
              <Badge variant="outline" className="text-xs capitalize">
                {level}
              </Badge>
            </div>
            
            {violationCount > 0 && (
              <div className="flex items-center gap-2 text-amber-600">
                <AlertTriangle className="w-3 h-3" />
                <span>{violationCount} security alert{violationCount !== 1 ? 's' : ''}</span>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${protectionLevels[level].disableRightClick ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span>Right-click</span>
              </div>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${protectionLevels[level].disableF12 ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span>DevTools</span>
              </div>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${protectionLevels[level].disablePrintScreen ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span>Screenshot</span>
              </div>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${protectionLevels[level].blurOnFocusLoss ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span>Blur</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScreenshotProtection;