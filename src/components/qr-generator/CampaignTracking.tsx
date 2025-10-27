import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CampaignTrackingProps {
  scanLimit: number | undefined;
  setScanLimit: (limit: number | undefined) => void;
  campaignSource: string;
  setCampaignSource: (source: string) => void;
  campaignMedium: string;
  setCampaignMedium: (medium: string) => void;
  campaignName: string;
  setCampaignName: (name: string) => void;
  campaignTerm: string;
  setCampaignTerm: (term: string) => void;
  campaignContent: string;
  setCampaignContent: (content: string) => void;
}

export const CampaignTracking: React.FC<CampaignTrackingProps> = ({
  scanLimit,
  setScanLimit,
  campaignSource,
  setCampaignSource,
  campaignMedium,
  setCampaignMedium,
  campaignName,
  setCampaignName,
  campaignTerm,
  setCampaignTerm,
  campaignContent,
  setCampaignContent
}) => {
  return (
    <Card>
      <CardHeader><CardTitle>Campaign Tracking & Limits</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="scan-limit">Scan Limit (optional)</Label>
          <Input 
            id="scan-limit" 
            type="number" 
            value={scanLimit || ''} 
            onChange={(e) => setScanLimit(e.target.value ? parseInt(e.target.value) : undefined)} 
            placeholder="Unlimited scans" 
          />
          <p className="text-xs text-muted-foreground">QR code will stop working after reaching this limit</p>
        </div>
        
        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-medium">UTM Campaign Parameters</h3>
          <div className="space-y-2">
            <Label htmlFor="campaign-source">Campaign Source</Label>
            <Input 
              id="campaign-source" 
              value={campaignSource} 
              onChange={(e) => setCampaignSource(e.target.value)} 
              placeholder="e.g., newsletter, social" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="campaign-medium">Campaign Medium</Label>
            <Input 
              id="campaign-medium" 
              value={campaignMedium} 
              onChange={(e) => setCampaignMedium(e.target.value)} 
              placeholder="e.g., email, cpc" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="campaign-name">Campaign Name</Label>
            <Input 
              id="campaign-name" 
              value={campaignName} 
              onChange={(e) => setCampaignName(e.target.value)} 
              placeholder="e.g., summer-sale" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="campaign-term">Campaign Term</Label>
            <Input 
              id="campaign-term" 
              value={campaignTerm} 
              onChange={(e) => setCampaignTerm(e.target.value)} 
              placeholder="e.g., paid keywords" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="campaign-content">Campaign Content</Label>
            <Input 
              id="campaign-content" 
              value={campaignContent} 
              onChange={(e) => setCampaignContent(e.target.value)} 
              placeholder="e.g., call-to-action" 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};