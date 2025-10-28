import React, { forwardRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';
import StyledQrCode, { StyledQrCodeRef } from './StyledQrCode';

interface QRPreviewProps {
  qrValue: string;
  size: number;
  bgColor: string;
  level: 'L' | 'M' | 'Q' | 'H';
  logoImage?: string;
  logoScale: number;
  excavate: boolean;
  shapeStyle: string;
  borderStyle: string;
  centerStyle: string;
  useGradient: boolean;
  color1: string;
  color2: string;
  gradientType: 'linear' | 'radial';
}

export const QRPreview = forwardRef<StyledQrCodeRef, QRPreviewProps>(({
  qrValue, size, bgColor, level, logoImage, logoScale, excavate, shapeStyle, borderStyle, centerStyle,
  useGradient, color1, color2, gradientType
}, ref) => {
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
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <StyledQrCode
              ref={ref}
              value={qrValue}
              size={size > 300 ? 300 : size}
              bgColor={bgColor}
              level={level}
              logoImage={logoImage}
              logoScale={logoScale}
              excavate={excavate}
              shapeStyle={shapeStyle}
              borderStyle={borderStyle}
              centerStyle={centerStyle}
              useGradient={useGradient}
              color1={color1}
              color2={color2}
              gradientType={gradientType}
            />
          </div>
          
          <div className="text-center text-gray-500 mt-4">
            <p className="text-sm">Custom Styled QR Code</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});