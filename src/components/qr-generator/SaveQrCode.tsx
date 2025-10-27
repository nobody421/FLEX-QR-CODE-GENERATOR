import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save } from 'lucide-react';

interface SaveQrCodeProps {
  qrName: string;
  setQrName: (name: string) => void;
  saving: boolean;
  onSave: () => void;
}

export const SaveQrCode: React.FC<SaveQrCodeProps> = ({
  qrName,
  setQrName,
  saving,
  onSave
}) => {
  return (
    <Card>
      <CardHeader><CardTitle>Save QR Code</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="qr-name">Name</Label>
          <Input 
            id="qr-name" 
            value={qrName} 
            onChange={(e) => setQrName(e.target.value)} 
            placeholder="My QR Code" 
          />
        </div>
        <Button onClick={onSave} className="w-full" disabled={saving}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {saving ? 'Saving...' : 'Save QR Code'}
        </Button>
      </CardContent>
    </Card>
  );
};