
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Calendar, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

interface DownloadManagerProps {
  orderId: string;
}

interface DownloadInfo {
  orderId: string;
  planTitle: string;
  packageType: string;
  files: string[];
  expiresAt: string;
}

export const DownloadManager = ({ orderId }: DownloadManagerProps) => {
  const [downloadInfo, setDownloadInfo] = useState<DownloadInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(new Set());
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDownloadInfo();
  }, [orderId]);

  const fetchDownloadInfo = async () => {
    try {
      const response = await api.get(`/api/downloads/${orderId}`);
      setDownloadInfo(response.data);
    } catch (error) {
      console.error('Error fetching download info:', error);
      setError('Failed to load download information');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadFile = async (filePath: string) => {
    setDownloadingFiles(prev => new Set([...prev, filePath]));
    
    try {
      const response = await fetch(`/api/downloads/${orderId}/file?filePath=${encodeURIComponent(filePath)}`);
      
      if (!response.ok) {
        throw new Error('Download failed');
      }

      // Get filename from the file path
      const fileName = filePath.split('/').pop() || 'download';
      
      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error);
      setError('Failed to download file');
    } finally {
      setDownloadingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(filePath);
        return newSet;
      });
    }
  };

  const handleDownloadAll = async () => {
    if (!downloadInfo) return;
    
    for (const filePath of downloadInfo.files) {
      await handleDownloadFile(filePath);
      // Add a small delay between downloads to prevent overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const isExpired = downloadInfo ? new Date() > new Date(downloadInfo.expiresAt) : false;

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading download information...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !downloadInfo) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>{error || 'Download information not available'}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Download Your Plans
        </CardTitle>
        <CardDescription>
          {downloadInfo.planTitle} - {downloadInfo.packageType.charAt(0).toUpperCase() + downloadInfo.packageType.slice(1)} Package
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isExpired ? (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center space-x-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Download Link Expired</span>
            </div>
            <p className="text-sm text-destructive/80 mt-1">
              This download link has expired. Please contact support for assistance.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-sm">
                  Expires: {new Date(downloadInfo.expiresAt).toLocaleDateString()}
                </span>
              </div>
              <Badge variant="secondary">
                {downloadInfo.files.length} file{downloadInfo.files.length > 1 ? 's' : ''}
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Available Files</h4>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleDownloadAll}
                  disabled={downloadingFiles.size > 0}
                >
                  {downloadingFiles.size > 0 ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="h-3 w-3 mr-1" />
                      Download All
                    </>
                  )}
                </Button>
              </div>

              <div className="space-y-2">
                {downloadInfo.files.map((filePath, index) => {
                  const fileName = filePath.split('/').pop() || `file-${index + 1}`;
                  const isDownloading = downloadingFiles.has(filePath);
                  
                  return (
                    <div key={filePath} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm">{fileName}</p>
                          <p className="text-xs text-muted-foreground">
                            {filePath.includes('.pdf') ? 'PDF Document' : 
                             filePath.includes('.dwg') ? 'AutoCAD Drawing' :
                             filePath.includes('.dxf') ? 'DXF Drawing' :
                             filePath.includes('.zip') ? 'ZIP Archive' : 'Document'}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadFile(filePath)}
                        disabled={isDownloading}
                      >
                        {isDownloading ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Download className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-3 bg-muted/30 rounded-lg">
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium">Download Instructions:</p>
                  <ul className="text-muted-foreground mt-1 space-y-1">
                    <li>• Click on individual files to download them separately</li>
                    <li>• Use "Download All" to get all files at once</li>
                    <li>• Downloads are available for 7 days after purchase</li>
                    <li>• Contact support if you need assistance</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
