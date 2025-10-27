import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QRCodeCanvas } from 'qrcode.react';
import { Eye, Loader2, Sparkles } from 'lucide-react';

interface QRPreviewProps {
  qrValue: string;
  size: number;
  fgColor: string;
  bgColor: string;
  level: 'L' | 'M' | 'Q' | 'H';
  logoImage?: string;
  logoScale: number;
  excavate: boolean;
  previewMode: 'standard' | 'ai';
  isGeneratingAiQr: boolean;
  aiQrImageUrl: string | null;
  setPreviewMode: (mode: 'standard' | 'ai') => void;
}

export const QRPreview: React.FC<QRPreviewProps> = ({
  qrValue,
  size,
  fgColor,
  bgColor,
  level,
  logoImage,
  logoScale,
  excavate,
  previewMode,
  isGeneratingAiQr,
  aiQrImageUrl,
  setPreviewMode
}) => {
  const qrRef = useRef<HTMLDivElement>(null);
  
  const imageSettings = logoImage ? {
    src: logoImage,
    height: size * logoScale,
    width: size * logoScale,
    excavate: excavate,
  } : undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg p-6 min-h-[400px]">
          {previewMode === 'ai' ? (
            <>
              {isGeneratingAiQr && (
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-16 w-16 animate-spin text-primary" />
                  <p className="text-muted-foreground">Generating your masterpiece...</p>
                </div>
              )}
              {!isGeneratingAiQr && aiQrImageUrl && (
                <img 
                  src={aiQrImageUrl} 
                  alt="AI Generated QR Code" 
                  className="w-full max-w-[300px] rounded-lg shadow-lg" 
                />
              )}
              {!isGeneratingAiQr && !aiQrImageUrl && (
                <div className="text-center text-gray-500">
                  <Sparkles className="mx-auto h-12 w-12 mb-4" />
                  <p>Your generated AI QR code will appear here.</p>
                </div>
              )}
            </>
          ) : (
            <div ref={qrRef} className="bg-white p-4 rounded-lg shadow-lg">
              <QRCodeCanvas 
                value={qrValue} 
                size={size > 300 ? 300 : size} 
                fgColor={fgColor} 
                bgColor={bgColor} 
                level={level} 
                imageSettings={imageSettings} 
              />
            </div>
          )}
          
          <div className="flex gap-2 mt-4">
            <Button 
              variant={previewMode === 'standard' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setPreviewMode('standard')}
            >
              Standard
            </Button>
            <Button 
              variant={previewMode === 'ai' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setPreviewMode('ai')}
              disabled={!aiQrImageUrl}
            >
              AI Version
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};