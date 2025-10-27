import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';

interface LogoIntegrationProps {
  logoImage?: string;
  setLogoImage: (image: string | undefined) => void;
  logoScale: number;
  setLogoScale: (scale: number) => void;
  excavate: boolean;
  setExcavate: (excavate: boolean) => void;
}

export const LogoIntegration: React.FC<LogoIntegrationProps> = ({
  logoImage,
  setLogoImage,
  logoScale,
  setLogoScale,
  excavate,
  setExcavate
}) => {
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setLogoImage(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  return (
    <Card>
      <CardHeader><CardTitle>Logo Integration</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="logo">Upload Logo</Label>
          <Input id="logo" type="file" accept="image/*" onChange={handleLogoUpload} />
        </div>
        {logoImage && (<>
          <div className="space-y-2">
            <Label>Logo Scale: {Math.round(logoScale * 100)}%</Label>
            <Slider 
              value={[logoScale]} 
              onValueChange={(v) => setLogoScale(v[0])} 
              min={0.05} 
              max={0.3} 
              step={0.01} 
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="excavate" 
              checked={excavate} 
              onCheckedChange={(checked) => setExcavate(!!checked)} 
            />
            <Label htmlFor="excavate">Clear space for logo (recommended)</Label>
          </div>
        </>)}
      </CardContent>
    </Card>
  );
};