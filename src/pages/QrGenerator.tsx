import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QRCodeCanvas } from 'qrcode.react';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link, FileText, Mail, MessageSquare, Wifi, Sparkles, Loader2, Save, Palette, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';
import { useNavigate } from 'react-router-dom';

import { UrlForm } from '@/components/qr-forms/UrlForm';
import { TextForm } from '@/components/qr-forms/TextForm';
import { EmailForm } from '@/components/qr-forms/EmailForm';
import { SmsForm } from '@/components/qr-forms/SmsForm';
import { WifiForm } from '@/components/qr-forms/WifiForm';
import { AiQrForm } from '@/components/qr-forms/AiQrForm';

const QrGenerator = () => {
  const qrRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const [qrValue, setQrValue] = useState('https://www.dyad.sh');
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [level, setLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [imageFormat, setImageFormat] = useState('png');
  const [logoImage, setLogoImage] = useState<string | undefined>(undefined);
  const [logoScale, setLogoScale] = useState(0.2);
  const [excavate, setExcavate] = useState(true);
  const [customPattern, setCustomPattern] = useState('#000000');
  const [qrName, setQrName] = useState('');
  const [scanLimit, setScanLimit] = useState<number | undefined>(undefined);
  
  // Campaign tracking
  const [campaignSource, setCampaignSource] = useState('');
  const [campaignMedium, setCampaignMedium] = useState('');
  const [campaignName, setCampaignName] = useState('');
  const [campaignTerm, setCampaignTerm] = useState('');
  const [campaignContent, setCampaignContent] = useState('');

  const [activeTab, setActiveTab] = useState('style');
  const [isGeneratingAiQr, setIsGeneratingAiQr] = useState(false);
  const [aiQrImageUrl, setAiQrImageUrl] = useState<string | null>(null);
  const [aiQrError, setAiQrError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState<'standard' | 'ai'>('standard');

  // Generate a unique short code
  const generateShortCode = () => {
    return Math.random().toString(36).substring(2, 8);
  };

  const handleDownload = async () => {
    if (previewMode === 'ai' && aiQrImageUrl) {
      try {
        const response = await fetch(aiQrImageUrl);
        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `ai-flexqr-code-${qrName || 'unnamed'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      } catch (error) {
        console.error("Failed to download AI QR code:", error);
        showError("Failed to download image.");
      }
      return;
    }

    if (qrRef.current) {
      const canvas = qrRef.current.querySelector('canvas');
      if (canvas) {
        const image = canvas.toDataURL(`image/${imageFormat}`);
        const link = document.createElement('a');
        link.href = image;
        link.download = `flexqr-code-${qrName || 'unnamed'}.${imageFormat}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setLogoImage(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleContentTypeChange = (type: string) => {
    switch (type) {
      case 'url': setQrValue('https://www.dyad.sh'); break;
      case 'text': setQrValue(''); break;
      case 'email': setQrValue('mailto:'); break;
      case 'sms': setQrValue('smsto:'); break;
      case 'wifi': setQrValue('WIFI:T:WPA;S:;P:;;'); break;
      default: setQrValue('');
    }
  };

  const handleGenerateAiQr = async (url: string, prompt: string) => {
    setIsGeneratingAiQr(true);
    setAiQrImageUrl(null);
    setAiQrError(null);
    try {
      const { data, error } = await supabase.functions.invoke('generate-ai-qr', {
        body: { qr_data: url, prompt: prompt },
      });
      if (error) throw new Error(error.message);
      if (data.error) throw new Error(data.error);
      setAiQrImageUrl(data.imageUrl);
      setPreviewMode('ai');
      showSuccess("AI QR Code generated successfully!");
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.message || 'An unknown error occurred.';
      setAiQrError(errorMessage);
      showError(`Error: ${errorMessage}`);
    } finally {
      setIsGeneratingAiQr(false);
    }
  };

  const handleSaveQrCode = async () => {
    setSaving(true);
    try {
      // Generate a unique short code
      const shortCode = generateShortCode();
      
      // Add campaign parameters to destination URL if any are set
      let finalDestinationUrl = qrValue;
      if (campaignSource || campaignMedium || campaignName || campaignTerm || campaignContent) {
        const url = new URL(qrValue);
        if (campaignSource) url.searchParams.set('utm_source', campaignSource);
        if (campaignMedium) url.searchParams.set('utm_medium', campaignMedium);
        if (campaignName) url.searchParams.set('utm_campaign', campaignName);
        if (campaignTerm) url.searchParams.set('utm_term', campaignTerm);
        if (campaignContent) url.searchParams.set('utm_content', campaignContent);
        finalDestinationUrl = url.toString();
      }
      
      const { data, error } = await supabase
        .from('qr_codes')
        .insert({
          name: qrName || 'Untitled QR Code',
          destination_url: finalDestinationUrl,
          short_code: shortCode,
          scan_limit: scanLimit,
          campaign_source: campaignSource,
          campaign_medium: campaignMedium,
          campaign_name: campaignName,
          campaign_term: campaignTerm,
          campaign_content: campaignContent,
          custom_pattern: customPattern
        })
        .select()
        .single();

      if (error) throw error;
      
      showSuccess('QR code saved successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving QR code:', error);
      showError('Failed to save QR code');
    } finally {
      setSaving(false);
    }
  };

  const imageSettings = logoImage ? {
    src: logoImage,
    height: size * logoScale,
    width: size * logoScale,
    excavate: excavate,
  } : undefined;

  return (
    <div className="w-full max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">QR Generator</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="style" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="style">Content & Style</TabsTrigger>
              <TabsTrigger value="logo">Logo</TabsTrigger>
              <TabsTrigger value="ai">AI</TabsTrigger>
              <TabsTrigger value="tracking">Tracking</TabsTrigger>
              <TabsTrigger value="download">Download</TabsTrigger>
            </TabsList>
            <TabsContent value="style" className="space-y-6 mt-6">
              <Card>
                <CardHeader><CardTitle>Content Type</CardTitle></CardHeader>
                <CardContent>
                  <Tabs defaultValue="url" className="w-full" onValueChange={handleContentTypeChange}>
                    <TabsList className="grid w-full grid-cols-5">
                      <TabsTrigger value="url"><Link className="h-4 w-4" /></TabsTrigger>
                      <TabsTrigger value="text"><FileText className="h-4 w-4" /></TabsTrigger>
                      <TabsTrigger value="email"><Mail className="h-4 w-4" /></TabsTrigger>
                      <TabsTrigger value="sms"><MessageSquare className="h-4 w-4" /></TabsTrigger>
                      <TabsTrigger value="wifi"><Wifi className="h-4 w-4" /></TabsTrigger>
                    </TabsList>
                    <TabsContent value="url" className="mt-4"><UrlForm onValueChange={setQrValue} initialValue="https://www.dyad.sh" /></TabsContent>
                    <TabsContent value="text" className="mt-4"><TextForm onValueChange={setQrValue} /></TabsContent>
                    <TabsContent value="email" className="mt-4"><EmailForm onValueChange={setQrValue} /></TabsContent>
                    <TabsContent value="sms" className="mt-4"><SmsForm onValueChange={setQrValue} /></TabsContent>
                    <TabsContent value="wifi" className="mt-4"><WifiForm onValueChange={setQrValue} /></TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
              <Card>
                  <CardHeader><CardTitle>Style Customization</CardTitle></CardHeader>
                  <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label>Size: {size}px</Label>
                        <Slider 
                          value={[size]} 
                          onValueChange={(v) => setSize(v[0])} 
                          min={128} 
                          max={1024} 
                          step={8} 
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Foreground Color</Label>
                          <div className="flex items-center gap-2">
                            <Input 
                              type="color" 
                              value={fgColor} 
                              onChange={(e) => setFgColor(e.target.value)} 
                              className="p-1 h-10 w-full" 
                            />
                            <Input 
                              type="text" 
                              value={fgColor} 
                              onChange={(e) => setFgColor(e.target.value)} 
                              placeholder="#000000" 
                              className="w-24" 
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Background Color</Label>
                          <div className="flex items-center gap-2">
                            <Input 
                              type="color" 
                              value={bgColor} 
                              onChange={(e) => setBgColor(e.target.value)} 
                              className="p-1 h-10 w-full" 
                            />
                            <Input 
                              type="text" 
                              value={bgColor} 
                              onChange={(e) => setBgColor(e.target.value)} 
                              placeholder="#FFFFFF" 
                              className="w-24" 
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Custom Pattern Color</Label>
                          <div className="flex items-center gap-2">
                            <Palette className="h-5 w-5" />
                            <Input 
                              type="color" 
                              value={customPattern} 
                              onChange={(e) => setCustomPattern(e.target.value)} 
                              className="p-1 h-10 w-full" 
                            />
                            <Input 
                              type="text" 
                              value={customPattern} 
                              onChange={(e) => setCustomPattern(e.target.value)} 
                              placeholder="#000000" 
                              className="w-24" 
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Error Correction Level</Label>
                          <Select onValueChange={(v: 'L'|'M'|'Q'|'H') => setLevel(v)} defaultValue={level}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="L">Low (7%)</SelectItem>
                              <SelectItem value="M">Medium (15%)</SelectItem>
                              <SelectItem value="Q">Quartile (25%)</SelectItem>
                              <SelectItem value="H">High (30%)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                  </CardContent>
              </Card>
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
                  <Button onClick={handleSaveQrCode} className="w-full" disabled={saving}>
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    {saving ? 'Saving...' : 'Save QR Code'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="logo" className="mt-6">
               <Card>
                  <CardHeader><CardTitle>Logo Integration</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="logo">Upload Logo</Label>
                        <Input id="logo" type="file" accept="image/*" onChange={handleLogoUpload} />
                      </div>
                      {logoImage && (<>
                        <div className="space-y-2">
                          <Label>Logo Scale: {Math.round(logoScale * 100)}%</Label>
                          <Slider 
                            value={[logoScale]} 
                            onValueChange={(v) => setLogoScale(v[0])} 
                            min={0.05} 
                            max={0.3} 
                            step={0.01} 
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="excavate" 
                            checked={excavate} 
                            onCheckedChange={(checked) => setExcavate(!!checked)} 
                          />
                          <Label htmlFor="excavate">Clear space for logo (recommended)</Label>
                        </div>
                      </>)}
                  </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="ai" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-yellow-500" />
                    AI-Powered QR Code Generator
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AiQrForm onGenerate={handleGenerateAiQr} isGenerating={isGeneratingAiQr} />
                  {aiQrError && <p className="text-red-500 text-sm mt-4">{aiQrError}</p>}
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
            </TabsContent>
            <TabsContent value="tracking" className="mt-6">
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
            </TabsContent>
            <TabsContent value="download" className="mt-6">
              <Card>
                  <CardHeader><CardTitle>Export Options</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                      <div className="space-y-2">
                          <Label>Image Format</Label>
                          <Select 
                            onValueChange={(v: 'png'|'jpeg'|'webp') => setImageFormat(v)} 
                            defaultValue={imageFormat}
                            disabled={previewMode === 'ai'}
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
                          {previewMode === 'ai' && (
                            <p className="text-xs text-muted-foreground">AI QR codes are downloaded as PNGs.</p>
                          )}
                      </div>
                      <Button onClick={handleDownload} className="w-full">
                        Download QR Code
                      </Button>
                  </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg p-6 min-h-[400px]">
                {previewMode === 'ai' ? (
                  <>
                    {isGeneratingAiQr && (
                      <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-16 w-16 animate-spin text-primary" />
                        <p className="text-muted-foreground">Generating your masterpiece...</p>
                      </div>
                    )}
                    {!isGeneratingAiQr && aiQrImageUrl && (
                      <img 
                        src={aiQrImageUrl} 
                        alt="AI Generated QR Code" 
                        className="w-full max-w-[300px] rounded-lg shadow-lg" 
                      />
                    )}
                    {!isGeneratingAiQr && !aiQrImageUrl && (
                      <div className="text-center text-gray-500">
                        <Sparkles className="mx-auto h-12 w-12 mb-4" />
                        <p>Your generated AI QR code will appear here.</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div ref={qrRef} className="bg-white p-4 rounded-lg shadow-lg">
                    <QRCodeCanvas 
                      value={qrValue} 
                      size={size > 300 ? 300 : size} 
                      fgColor={customPattern} 
                      bgColor={bgColor} 
                      level={level} 
                      imageSettings={imageSettings} 
                    />
                  </div>
                )}
                
                <div className="flex gap-2 mt-4">
                  <Button 
                    variant={previewMode === 'standard' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setPreviewMode('standard')}
                  >
                    Standard
                  </Button>
                  <Button 
                    variant={previewMode === 'ai' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setPreviewMode('ai')}
                    disabled={!aiQrImageUrl}
                  >
                    AI Version
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
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
        </div>
      </div>
    </div>
  );
};

export default QrGenerator;