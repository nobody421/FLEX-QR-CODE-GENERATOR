import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QRCodeCanvas } from 'qrcode.react';
import { Eye } from 'lucide-react';

interface QRPreviewProps {
  qrValue: string;
  size: number;
  fgColor: string;
  bgColor: string;
  level: 'L' | 'M' | 'Q' | 'H';
  logoImage?: string;
  logoScale: number;
  excavate: boolean;
  // Removed AI-related props: previewMode, isGeneratingAiQr, aiQrImageUrl, setPreviewMode
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
          
          <div className="text-center text-gray-500 mt-4">
            <p className="text-sm">Standard QR Code</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};