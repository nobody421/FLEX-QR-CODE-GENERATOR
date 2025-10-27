import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const QuickTips: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Tips</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="text-sm text-muted-foreground space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>Use high contrast colors for better scannability</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>Test your QR code after customization</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>Add UTM parameters to track campaign performance</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>Set scan limits for time-sensitive promotions</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};