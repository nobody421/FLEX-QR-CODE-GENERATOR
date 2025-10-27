import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AiQrForm } from '@/components/qr-forms/AiQrForm';
import { Sparkles } from 'lucide-react';

interface AiGeneratorProps {
  onGenerate: (url: string, prompt: string) => void;
  isGenerating: boolean;
  error: string | null;
}

export const AiGenerator: React.FC<AiGeneratorProps> = ({
  onGenerate,
  isGenerating,
  error
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          AI-Powered QR Code Generator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AiQrForm onGenerate={onGenerate} isGenerating={isGenerating} />
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">How it works:</h4>
          <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
            <li>Enter a URL and describe the visual style you want</li>
            <li>Our AI creates a unique QR code that matches your description</li>
            <li>The QR code maintains scannability while looking artistic</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};