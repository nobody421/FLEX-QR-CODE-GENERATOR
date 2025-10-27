import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface UrlFormProps {
  onValueChange: (value: string) => void;
  initialValue: string;
}

export const UrlForm: React.FC<UrlFormProps> = ({ onValueChange, initialValue }) => {
  const [url, setUrl] = useState(initialValue);

  useEffect(() => {
    onValueChange(url);
  }, [url, onValueChange]);

  return (
    <div className="space-y-2">
      <Label htmlFor="url">URL</Label>
      <Input 
        id="url" 
        value={url} 
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://example.com"
      />
    </div>
  );
};