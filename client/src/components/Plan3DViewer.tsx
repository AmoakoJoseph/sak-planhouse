import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Box, 
  Eye, 
  EyeOff, 
  RotateCcw, 
  Fullscreen,
  Download
} from 'lucide-react';

interface Plan3DViewerProps {
  plan: {
    id: number;
    title: string;
    plan_type: string;
    bedrooms: number;
    bathrooms: number;
    area_sqft: number;
  };
  isOpen: boolean;
  onClose: () => void;
}

const Plan3DViewer = ({ plan, isOpen, onClose }: Plan3DViewerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      init3DScene();
    }
  }, [isOpen, plan]);

  const init3DScene = async () => {
    if (!canvasRef.current) return;

    setIsLoading(true);
    
    try {
      // For now, we'll create a placeholder 3D scene
      // In a real implementation, you would use Three.js or similar
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Set canvas size
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        
        // Draw a simple 3D-like house representation
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw house outline
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.strokeRect(100, 100, 200, 150);
        
        // Draw roof
        ctx.beginPath();
        ctx.moveTo(100, 100);
        ctx.lineTo(200, 50);
        ctx.lineTo(300, 100);
        ctx.stroke();
        
        // Draw windows
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(120, 120, 30, 30);
        ctx.fillRect(250, 120, 30, 30);
        
        // Draw door
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(180, 180, 40, 70);
        
        // Add text
        ctx.fillStyle = '#333';
        ctx.font = '16px Arial';
        ctx.fillText(`${plan.title} - 3D View`, 20, 30);
        ctx.fillText(`${plan.bedrooms} BR, ${plan.bathrooms} BA`, 20, 50);
        ctx.fillText(`${plan.area_sqft} sq ft`, 20, 70);
      }
      
    } catch (error) {
      console.error('Error initializing 3D scene:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetView = () => {
    if (canvasRef.current) {
      init3DScene();
    }
  };

  const downloadScreenshot = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `${plan.title}-3D-view.png`;
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Box className="w-6 h-6 text-primary" />
            <div>
              <h2 className="text-2xl font-bold text-foreground">3D Plan Viewer</h2>
              <p className="text-muted-foreground">{plan.title}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" onClick={resetView}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset View
            </Button>
            <Button variant="outline" size="sm" onClick={downloadScreenshot}>
              <Download className="w-4 h-4 mr-2" />
              Screenshot
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <EyeOff className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-gradient-to-br from-sky-100 to-blue-100 rounded-lg overflow-hidden relative min-h-[500px]">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading 3D scene...</p>
                </div>
              </div>
            )}
            
            <canvas
              ref={canvasRef}
              className="w-full h-full cursor-grab active:cursor-grabbing"
              style={{ display: isLoading ? 'none' : 'block' }}
            />
            
            {/* Instructions Overlay */}
            <div className="absolute bottom-4 left-4 bg-background/90 rounded-lg p-3 text-sm text-muted-foreground">
              <p>🖱️ Click and drag to rotate • 🖱️ Scroll to zoom</p>
            </div>
          </div>
          
          {/* Plan Information */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Plan Type</h3>
                <p className="text-muted-foreground">{plan.plan_type}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Bedrooms</h3>
                <p className="text-muted-foreground">{plan.bedrooms}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Area</h3>
                <p className="text-muted-foreground">{plan.area_sqft} sq ft</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plan3DViewer;
