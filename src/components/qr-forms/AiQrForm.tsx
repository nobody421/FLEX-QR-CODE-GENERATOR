import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

interface AiQrFormProps {
  onGenerate: (url: string, prompt: string) => void;
  isGenerating: boolean;
}

export const AiQrForm: React.FC<AiQrFormProps> = ({ onGenerate, isGenerating }) => {
  const [url, setUrl] = useState('https://www.dyad.sh');
  const [prompt, setPrompt] = useState('A cinematic shot of a beautiful Japanese castle in the snow');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(url, prompt);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="ai-url">URL</Label>
        <Input 
          id="ai-url" 
          value={url} 
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          disabled={isGenerating}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="ai-prompt">Prompt</Label>
        <Textarea 
          id="ai-prompt" 
          value={prompt} 
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the image you want to create..."
          disabled={isGenerating}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isGenerating}>
        {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {isGenerating ? 'Generating...' : 'Generate AI QR Code'}
      </Button>
    </form>
  );
};