import React, { useEffect, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface TextFormProps {
  onValueChange: (value: string) => void;
}

export const TextForm: React.FC<TextFormProps> = ({ onValueChange }) => {
  const [text, setText] = useState('');

  useEffect(() => {
    onValueChange(text);
  }, [text, onValueChange]);

  return (
    <div className="space-y-2">
      <Label htmlFor="text">Text</Label>
      <Textarea 
        id="text" 
        value={text} 
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter your text here"
      />
    </div>
  );
};