import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Square, Circle, Star, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface StyleCustomizationProps {
  size: number;
  setSize: (size: number) => void;
  bgColor: string;
  setBgColor: (color: string) => void;
  color1: string;
  setColor1: (color: string) => void;
  color2: string;
  setColor2: (color: string) => void;
  gradientType: 'linear' | 'radial';
  setGradientType: (type: 'linear' | 'radial') => void;
  useGradient: boolean;
  setUseGradient: (use: boolean) => void;
  level: 'L' | 'M' | 'Q' | 'H';
  setLevel: (level: 'L' | 'M' | 'Q' | 'H') => void;
  
  shapeStyle: string;
  setShapeStyle: (style: string) => void;
  borderStyle: string;
  setBorderStyle: (style: string) => void;
  centerStyle: string;
  setCenterStyle: (style: string) => void;
}

const colorPresets = [
  { name: 'Black', value: '#000000' },
  { name: 'Primary Blue', value: '#3b82f6' },
  { name: 'Forest Green', value: '#10b981' },
  { name: 'Crimson Red', value: '#ef4444' },
  { name: 'Deep Purple', value: '#8b5cf6' },
];

const StyleButton: React.FC<{
  styleKey: string;
  currentStyle: string;
  onClick: (key: string) => void;
  children: React.ReactNode;
}> = ({ styleKey, currentStyle, onClick, children }) => {
  const isActive = currentStyle === styleKey;
  return (
    <button
      type="button"
      onClick={() => onClick(styleKey)}
      className={cn(
        "p-2 rounded-lg border-2 transition-colors w-12 h-12 flex items-center justify-center",
        isActive
          ? "border-primary ring-2 ring-primary/50 bg-primary/10"
          : "border-input hover:bg-muted/50"
      )}
    >
      {children}
    </button>
  );
};

export const StyleCustomization: React.FC<StyleCustomizationProps> = ({
  size, setSize, bgColor, setBgColor, color1, setColor1, color2, setColor2,
  gradientType, setGradientType, useGradient, setUseGradient, level, setLevel,
  shapeStyle, setShapeStyle, borderStyle, setBorderStyle, centerStyle, setCenterStyle,
}) => {
  return (
    <Card>
      <CardHeader><CardTitle>Style Customization</CardTitle></CardHeader>
      <CardContent className="space-y-6">
        
        <div className="space-y-3">
          <h3 className="font-medium">Shape Style</h3>
          <div className="flex flex-wrap gap-3">
            <StyleButton styleKey="square" currentStyle={shapeStyle} onClick={setShapeStyle}><Square className="h-6 w-6" /></StyleButton>
            <StyleButton styleKey="rounded" currentStyle={shapeStyle} onClick={setShapeStyle}><div className="h-6 w-6 rounded-md border-2 border-current" /></StyleButton>
            <StyleButton styleKey="dots" currentStyle={shapeStyle} onClick={setShapeStyle}><div className="grid grid-cols-2 gap-1 p-1"><Circle className="h-2 w-2 fill-current" /><Circle className="h-2 w-2 fill-current" /><Circle className="h-2 w-2 fill-current" /><Circle className="h-2 w-2 fill-current" /></div></StyleButton>
            <StyleButton styleKey="classy" currentStyle={shapeStyle} onClick={setShapeStyle}><div className="h-6 w-6 rounded-tl-lg rounded-br-lg border-2 border-current" /></StyleButton>
            <StyleButton styleKey="classy-rounded" currentStyle={shapeStyle} onClick={setShapeStyle}><div className="h-6 w-6 rounded-lg border-2 border-current" /></StyleButton>
            <StyleButton styleKey="extra-rounded" currentStyle={shapeStyle} onClick={setShapeStyle}><Circle className="h-6 w-6" /></StyleButton>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-medium">Border Style</h3>
          <div className="flex flex-wrap gap-3">
            <StyleButton styleKey="square" currentStyle={borderStyle} onClick={setBorderStyle}><Square className="h-6 w-6" /></StyleButton>
            <StyleButton styleKey="rounded" currentStyle={borderStyle} onClick={setBorderStyle}><div className="h-6 w-6 rounded-lg border-2 border-current" /></StyleButton>
            <StyleButton styleKey="circle" currentStyle={borderStyle} onClick={setBorderStyle}><Circle className="h-6 w-6" /></StyleButton>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-medium">Center Style</h3>
          <div className="flex flex-wrap gap-3">
            <StyleButton styleKey="square" currentStyle={centerStyle} onClick={setCenterStyle}><Square className="h-6 w-6 fill-current" /></StyleButton>
            <StyleButton styleKey="rounded" currentStyle={centerStyle} onClick={setCenterStyle}><div className="h-6 w-6 rounded-md bg-current" /></StyleButton>
            <StyleButton styleKey="circle" currentStyle={centerStyle} onClick={setCenterStyle}><Circle className="h-6 w-6 fill-current" /></StyleButton>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Size: {size}px</Label>
          <Slider value={[size]} onValueChange={(v) => setSize(v[0])} min={128} max={1024} step={8} />
        </div>
        
        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <Label htmlFor="use-gradient" className="font-medium">Use Gradient</Label>
            <Switch id="use-gradient" checked={useGradient} onCheckedChange={setUseGradient} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{useGradient ? 'Color 1' : 'Module Color'}</Label>
              <div className="flex items-center gap-2"><Input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} className="p-1 h-10 w-full" /><Input type="text" value={color1} onChange={(e) => setColor1(e.target.value)} placeholder="#000000" className="w-24" /></div>
              <div className="flex gap-2 mt-2">{colorPresets.map(p => (<div key={p.value} className={`w-6 h-6 rounded-full cursor-pointer border-2 ${color1 === p.value ? 'border-primary ring-2 ring-primary/50' : 'border-gray-300'}`} style={{ backgroundColor: p.value }} onClick={() => setColor1(p.value)} title={p.name} />))}</div>
            </div>
            
            {useGradient && (
              <div className="space-y-2">
                <Label>Color 2</Label>
                <div className="flex items-center gap-2"><Input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} className="p-1 h-10 w-full" /><Input type="text" value={color2} onChange={(e) => setColor2(e.target.value)} placeholder="#000000" className="w-24" /></div>
              </div>
            )}
          </div>

          {useGradient && (
            <div className="space-y-2">
              <Label>Gradient Type</Label>
              <Select onValueChange={(v: 'linear'|'radial') => setGradientType(v)} defaultValue={gradientType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="linear">Linear</SelectItem><SelectItem value="radial">Radial</SelectItem></SelectContent>
              </Select>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <Label>Error Correction Level</Label>
          <Select onValueChange={(v: 'L'|'M'|'Q'|'H') => setLevel(v)} defaultValue={level}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="L">Low (7%)</SelectItem><SelectItem value="M">Medium (15%)</SelectItem><SelectItem value="Q">Quartile (25%)</SelectItem><SelectItem value="H">High (30%)</SelectItem></SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};