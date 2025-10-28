import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import QRCodeStyling, { Options as QRCodeStylingOptions, FileExtension } from 'qr-code-styling';

interface StyledQrCodeProps {
  value: string;
  size: number;
  fgColor: string;
  bgColor: string;
  logoImage?: string;
  logoScale: number;
  excavate: boolean;
  shapeStyle: string;
  borderStyle: string;
  centerStyle: string;
  level: 'L' | 'M' | 'Q' | 'H';
}

export interface StyledQrCodeRef {
  download: (options: { name: string; extension: FileExtension }) => void;
}

const mapShapeStyle = (style: string) => {
  switch (style) {
    case 'rounded': return 'rounded';
    case 'dots': return 'dots';
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
    case 'star': return 'dot';
    case 'zap': return 'dot';
    case 'square':
    default:
      return 'square';
  }
};

const StyledQrCode = forwardRef<StyledQrCodeRef, StyledQrCodeProps>(({
  value,
  size,
  fgColor,
  bgColor,
  logoImage,
  logoScale,
  excavate,
  shapeStyle,
  borderStyle,
  centerStyle,
  level
}, ref) => {
  const qrInstanceRef = useRef<QRCodeStyling | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const options: QRCodeStylingOptions = {
      width: size,
      height: size,
      data: value,
      margin: 5,
      qrOptions: {
        errorCorrectionLevel: level,
      },
      dotsOptions: {
        color: fgColor,
        type: mapShapeStyle(shapeStyle),
      },
      backgroundOptions: {
        color: bgColor,
      },
      cornersSquareOptions: {
        type: mapCornerStyle(borderStyle),
        color: fgColor,
      },
      cornersDotOptions: {
        type: mapCenterStyle(centerStyle),
        color: fgColor,
      },
      imageOptions: {
        hideBackgroundDots: excavate,
        imageSize: logoScale,
        margin: 4,
        crossOrigin: 'anonymous',
      },
      image: logoImage,
    };

    if (!qrInstanceRef.current) {
      qrInstanceRef.current = new QRCodeStyling(options);
      qrInstanceRef.current.append(containerRef.current);
    } else {
      qrInstanceRef.current.update(options);
    }
  }, [value, size, fgColor, bgColor, logoImage, logoScale, excavate, shapeStyle, borderStyle, centerStyle, level]);

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