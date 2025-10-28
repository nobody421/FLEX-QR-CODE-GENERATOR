import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface YoutubeFormProps {
  onValueChange: (value: string) => void;
}

export const YoutubeForm: React.FC<YoutubeFormProps> = ({ onValueChange }) => {
  const [url, setUrl] = useState('');

  useEffect(() => {
    onValueChange(url);
  }, [url, onValueChange]);

  return (
    <div className="space-y-2">
      <Label htmlFor="youtube-url">YouTube URL</Label>
      <Input 
        id="youtube-url" 
        value={url} 
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://www.youtube.com/watch?v=..."
      />
    </div>
  );
};