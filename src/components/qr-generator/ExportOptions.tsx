import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
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
  // Removed previewMode prop
  onDownload: () => void;
}

export const ExportOptions: React.FC<ExportOptionsProps> = ({
  imageFormat,
  setImageFormat,
  onDownload
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
            // Removed disabled logic based on previewMode
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
        <Button onClick={onDownload} className="w-full">
          Download QR Code
        </Button>
      </CardContent>
    </Card>
  );
};