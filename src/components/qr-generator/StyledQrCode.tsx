import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import QRCodeStyling, { Options as QRCodeStylingOptions, FileExtension, Gradient, DotType, CornerSquareType, CornerDotType } from 'qr-code-styling';

interface StyledQrCodeProps {
  value: string;
  size: number;
  bgColor: string;
  logoImage?: string;
  logoScale: number;
  excavate: boolean;
  shapeStyle: string;
  borderStyle: string;
  centerStyle: string;
  level: 'L' | 'M' | 'Q' | 'H';
  // Color props
  useGradient: boolean;
  color1: string;
  color2: string;
  gradientType: 'linear' | 'radial';
}

export interface StyledQrCodeRef {
  download: (options: { name: string; extension: FileExtension }) => void;
}

const mapShapeStyle = (style: string) => {
  switch (style) {
    case 'rounded': return 'rounded';
    case 'dots': return 'dots';
    case 'classy': return 'classy';
    case 'classy-rounded': return 'classy-rounded';
    case 'extra-rounded': return 'extra-rounded';
    case 'square':
    default:
      return 'square';
  }
};

const mapCornerStyle = (style: string) => {
  switch (style) {
    case 'rounded': return 'extra-rounded';
    case 'circle': return 'dot';
    case 'square':
    default:
      return 'square';
  }
};

const mapCenterStyle = (style: string) => {
  switch (style) {
    case 'rounded': return 'extra-rounded';
    case 'circle': return 'dot';
    case 'square':
    default:
      return 'square';
  }
};

const StyledQrCode = forwardRef<StyledQrCodeRef, StyledQrCodeProps>(({
  value, size, bgColor, logoImage, logoScale, excavate, shapeStyle, borderStyle, centerStyle, level,
  useGradient, color1, color2, gradientType
}, ref) => {
  const qrInstanceRef = useRef<QRCodeStyling | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const dotsOptions: { type: DotType; color?: string; gradient?: Gradient } = {
      type: mapShapeStyle(shapeStyle) as DotType,
    };

    if (useGradient) {
      dotsOptions.gradient = {
        type: gradientType,
        colorStops: [{ offset: 0, color: color1 }, { offset: 1, color: color2 }]
      };
    } else {
      dotsOptions.color = color1;
    }

    const options: QRCodeStylingOptions = {
      width: size,
      height: size,
      data: value,
      margin: 5,
      qrOptions: { errorCorrectionLevel: level },
      dotsOptions: dotsOptions,
      backgroundOptions: { color: bgColor },
      cornersSquareOptions: { type: mapCornerStyle(borderStyle) as CornerSquareType, color: useGradient ? undefined : color1 },
      cornersDotOptions: { type: mapCenterStyle(centerStyle) as CornerDotType, color: useGradient ? undefined : color1 },
      imageOptions: { hideBackgroundDots: excavate, imageSize: logoScale, margin: 4, crossOrigin: 'anonymous' },
      image: logoImage,
    };
    
    if (useGradient) {
        options.cornersSquareOptions!.gradient = dotsOptions.gradient;
        options.cornersDotOptions!.gradient = dotsOptions.gradient;
    }

    if (!qrInstanceRef.current) {
      qrInstanceRef.current = new QRCodeStyling(options);
      qrInstanceRef.current.append(containerRef.current);
    } else {
      qrInstanceRef.current.update(options);
    }
  }, [value, size, bgColor, logoImage, logoScale, excavate, shapeStyle, borderStyle, centerStyle, level, useGradient, color1, color2, gradientType]);

  useImperativeHandle(ref, () => ({
    download: (options) => {
      if (qrInstanceRef.current) {
        qrInstanceRef.current.download(options);
      }
    }
  }));

  return <div ref={containerRef} className="flex justify-center items-center" />;
});

export default StyledQrCode;