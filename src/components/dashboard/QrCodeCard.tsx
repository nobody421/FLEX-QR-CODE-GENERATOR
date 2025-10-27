import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, QrCode, BarChart3, ExternalLink, Calendar, Hash } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { showError, showSuccess } from '@/utils/toast';

interface QrCodeCardProps {
  id: string;
  name: string;
  shortCode: string;
  destinationUrl: string;
  scanCount: number;
  createdAt: string;
  customPattern?: string;
  campaignSource?: string;
  campaignMedium?: string;
  scanLimit?: number;
}

export const QrCodeCard: React.FC<QrCodeCardProps> = ({
  id,
  name,
  shortCode,
  destinationUrl,
  scanCount,
  createdAt,
  customPattern,
  campaignSource,
  campaignMedium,
  scanLimit
}) => {
  const qrUrl = `${window.location.origin}/r/${shortCode}`;
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => showSuccess('Copied to clipboard!'))
      .catch(() => showError('Failed to copy'));
  };

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{name || 'Untitled QR Code'}</CardTitle>
          <div className="flex flex-col items-end gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Hash className="h-3 w-3" />
              {scanCount}
            </Badge>
            {scanLimit && (
              <Badge variant="outline" className="text-xs">
                Limit: {scanLimit}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center text-sm text-muted-foreground gap-2">
          <Calendar className="h-4 w-4" />
          <span>{new Date(createdAt).toLocaleDateString()}</span>
        </div>
        {campaignSource && (
          <div className="flex gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              {campaignSource}
            </Badge>
            {campaignMedium && (
              <Badge variant="outline" className="text-xs">
                {campaignMedium}
              </Badge>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex justify-center">
            <div className="bg-white p-2 rounded-lg border inline-block">
              <QRCodeCanvas 
                value={qrUrl} 
                size={128} 
                fgColor={customPattern || '#000000'} 
                bgColor="#ffffff" 
                level="M" 
              />
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Short URL:</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => copyToClipboard(qrUrl)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm break-all bg-muted p-2 rounded">{qrUrl}</p>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Destination:</span>
              <a href={destinationUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            </div>
            <p className="text-sm break-all bg-muted p-2 rounded">{destinationUrl}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => copyToClipboard(qrUrl)} className="flex-1">
            <QrCode className="h-4 w-4 mr-2" />
            Copy URL
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};