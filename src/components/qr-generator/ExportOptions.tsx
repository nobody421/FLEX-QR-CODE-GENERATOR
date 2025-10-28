import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ExportOptionsProps {
  imageFormat: string;
  setImageFormat: (format: 'png' | 'jpeg' | 'webp') => void;
  onDownload: () => void;
  autoSaveToDrive: boolean;
  setAutoSaveToDrive: (enabled: boolean) => void;
}

export const ExportOptions: React.FC<ExportOptionsProps> = ({
  imageFormat,
  setImageFormat,
  onDownload,
  autoSaveToDrive,
  setAutoSaveToDrive,
}) => {
  return (
    <Card>
      <CardHeader><CardTitle>Export Options</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Image Format</Label>
          <Select 
            onValueChange={(v: 'png'|'jpeg'|'webp') => setImageFormat(v)} 
            defaultValue={imageFormat}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="png">PNG (Recommended)</SelectItem>
              <SelectItem value="jpeg">JPEG</SelectItem>
              <SelectItem value="webp">WebP</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center justify-between space-x-2 border-t pt-4">
          <Label htmlFor="auto-save-drive" className="flex flex-col space-y-1">
            <span>Auto Save to Google Drive</span>
            <span className="font-normal leading-snug text-muted-foreground text-sm">
              Automatically save this QR code image when you save the code.
            </span>
          </Label>
          <Switch 
            id="auto-save-drive" 
            checked={autoSaveToDrive} 
            onCheckedChange={setAutoSaveToDrive} 
          />
        </div>

        <Button onClick={onDownload} className="w-full">
          Download QR Code
        </Button>
      </CardContent>
    </Card>
  );
};