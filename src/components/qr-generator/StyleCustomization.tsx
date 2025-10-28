import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Square, Circle, Star, Zap, Plus, Minus, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
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
  customPattern: string;
  setCustomPattern: (color: string) => void;
  level: 'L' | 'M' | 'Q' | 'H';
  setLevel: (level: 'L' | 'M' | 'Q' | 'H') => void;
  
  // New Style Props
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

// Helper component for style selection buttons
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
  size,
  setSize,
  bgColor,
  setBgColor,
  customPattern,
  setCustomPattern,
  level,
  setLevel,
  shapeStyle,
  setShapeStyle,
  borderStyle,
  setBorderStyle,
  centerStyle,
  setCenterStyle,
}) => {
  return (
    <Card>
      <CardHeader><CardTitle>Style Customization</CardTitle></CardHeader>
      <CardContent className="space-y-6">
        
        {/* --- Shape Style (Data Modules) --- */}
        <div className="space-y-3">
          <h3 className="font-medium">Shape Style</h3>
          <div className="flex flex-wrap gap-3">
            <StyleButton styleKey="square" currentStyle={shapeStyle} onClick={setShapeStyle}>
              <Square className="h-6 w-6" />
            </StyleButton>
            <StyleButton styleKey="rounded" currentStyle={shapeStyle} onClick={setShapeStyle}>
              <div className="h-6 w-6 rounded-md border-2 border-current" />
            </StyleButton>
            <StyleButton styleKey="dots" currentStyle={shapeStyle} onClick={setShapeStyle}>
              <div className="flex flex-col gap-1">
                <div className="h-1 w-4 bg-current" />
                <div className="h-1 w-4 bg-current" />
                <div className="h-1 w-4 bg-current" />
              </div>
            </StyleButton>
            <StyleButton styleKey="extra-rounded" currentStyle={shapeStyle} onClick={setShapeStyle}>
              <Circle className="h-6 w-6" />
            </StyleButton>
            {/* Add more styles as placeholders */}
          </div>
        </div>

        {/* --- Border Style (Finder Pattern) --- */}
        <div className="space-y-3">
          <h3 className="font-medium">Border Style</h3>
          <div className="flex flex-wrap gap-3">
            <StyleButton styleKey="square" currentStyle={borderStyle} onClick={setBorderStyle}>
              <Square className="h-6 w-6" />
            </StyleButton>
            <StyleButton styleKey="rounded" currentStyle={borderStyle} onClick={setBorderStyle}>
              <div className="h-6 w-6 rounded-lg border-2 border-current" />
            </StyleButton>
            <StyleButton styleKey="circle" currentStyle={borderStyle} onClick={setBorderStyle}>
              <Circle className="h-6 w-6" />
            </StyleButton>
            {/* Add more styles as placeholders */}
          </div>
        </div>

        {/* --- Center Style (Finder Center) --- */}
        <div className="space-y-3">
          <h3 className="font-medium">Center Style</h3>
          <div className="flex flex-wrap gap-3">
            <StyleButton styleKey="square" currentStyle={centerStyle} onClick={setCenterStyle}>
              <Square className="h-6 w-6 fill-current" />
            </StyleButton>
            <StyleButton styleKey="rounded" currentStyle={centerStyle} onClick={setCenterStyle}>
              <div className="h-6 w-6 rounded-md bg-current" />
            </StyleButton>
            <StyleButton styleKey="star" currentStyle={centerStyle} onClick={setCenterStyle}>
              <Star className="h-6 w-6 fill-current" />
            </StyleButton>
            <StyleButton styleKey="zap" currentStyle={centerStyle} onClick={setCenterStyle}>
              <Zap className="h-6 w-6 fill-current" />
            </StyleButton>
            {/* Add more styles as placeholders */}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Size: {size}px</Label>
          <Slider 
            value={[size]} 
            onValueChange={(v) => setSize(v[0])} 
            min={128} 
            max={1024} 
            step={8} 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Module Color (Pattern)</Label>
            <div className="flex items-center gap-2">
              <Input 
                type="color" 
                value={customPattern} 
                onChange={(e) => setCustomPattern(e.target.value)} 
                className="p-1 h-10 w-full" 
              />
              <Input 
                type="text" 
                value={customPattern} 
                onChange={(e) => setCustomPattern(e.target.value)} 
                placeholder="#000000" 
                className="w-24" 
              />
            </div>
            <div className="flex gap-2 mt-2">
              {colorPresets.map(preset => (
                <div
                  key={preset.value}
                  className={`w-6 h-6 rounded-full cursor-pointer border-2 ${customPattern === preset.value ? 'border-primary ring-2 ring-primary/50' : 'border-gray-300'}`}
                  style={{ backgroundColor: preset.value }}
                  onClick={() => setCustomPattern(preset.value)}
                  title={preset.name}
                />
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Background Color</Label>
            <div className="flex items-center gap-2">
              <Input 
                type="color" 
                value={bgColor} 
                onChange={(e) => setBgColor(e.target.value)} 
                className="p-1 h-10 w-full" 
              />
              <Input 
                type="text" 
                value={bgColor} 
                onChange={(e) => setBgColor(e.target.value)} 
                placeholder="#FFFFFF" 
                className="w-24" 
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Error Correction Level</Label>
          <Select onValueChange={(v: 'L'|'M'|'Q'|'H') => setLevel(v)} defaultValue={level}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="L">Low (7%)</SelectItem>
              <SelectItem value="M">Medium (15%)</SelectItem>
              <SelectItem value="Q">Quartile (25%)</SelectItem>
              <SelectItem value="H">High (30%)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};