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
import { Link, FileText, Mail, MessageSquare, Wifi, Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';

import { UrlForm } from '@/components/qr-forms/UrlForm';
import { TextForm } from '@/components/qr-forms/TextForm';
import { EmailForm } from '@/components/qr-forms/EmailForm';
import { SmsForm } from '@/components/qr-forms/SmsForm';
import { WifiForm } from '@/components/qr-forms/WifiForm';
import { AiQrForm } from '@/components/qr-forms/AiQrForm';

const QrGenerator = () => {
  const qrRef = useRef<HTMLDivElement>(null);
  
  const [qrValue, setQrValue] = useState('https://www.dyad.sh');
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [level, setLevel] = useState<'L' | 'M' | 'Q' | 'H'>('L');
  const [imageFormat, setImageFormat] = useState('png');
  const [logoImage, setLogoImage] = useState<string | undefined>(undefined);
  const [logoScale, setLogoScale] = useState(0.25);
  const [excavate, setExcavate] = useState(true);

  const [activeTab, setActiveTab] = useState('style');
  const [isGeneratingAiQr, setIsGeneratingAiQr] = useState(false);
  const [aiQrImageUrl, setAiQrImageUrl] = useState<string | null>(null);
  const [aiQrError, setAiQrError] = useState<string | null>(null);

  const handleDownload = async () => {
    if (activeTab === 'ai' && aiQrImageUrl) {
      try {
        const response = await fetch(aiQrImageUrl);
        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `ai-flexqr-code.png`;
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
        link.download = `flexqr-code.${imageFormat}`;
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

  const imageSettings = logoImage ? {
    src: logoImage,
    height: size * logoScale,
    width: size * logoScale,
    excavate: excavate,
  } : undefined;

  return (
    <div className="w-full max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">QR Generator</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Tabs defaultValue="style" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="style">Content & Style</TabsTrigger>
              <TabsTrigger value="logo">Logo</TabsTrigger>
              <TabsTrigger value="ai">AI</TabsTrigger>
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
                  <CardHeader><CardTitle>Style</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                      <div className="space-y-2"><Label>Size: {size}px</Label><Slider value={[size]} onValueChange={(v) => setSize(v[0])} min={64} max={1024} step={8} /></div>
                      <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2"><Label htmlFor="fgColor">Foreground</Label><Input id="fgColor" type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="p-1 h-10 w-full" /></div>
                          <div className="space-y-2"><Label htmlFor="bgColor">Background</Label><Input id="bgColor" type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="p-1 h-10 w-full" /></div>
                      </div>
                      <div className="space-y-2"><Label>Error Correction</Label><Select onValueChange={(v: 'L'|'M'|'Q'|'H') => setLevel(v)} defaultValue={level}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="L">Low</SelectItem><SelectItem value="M">Medium</SelectItem><SelectItem value="Q">Quartile</SelectItem><SelectItem value="H">High</SelectItem></SelectContent></Select></div>
                  </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="logo" className="mt-6">
               <Card>
                  <CardHeader><CardTitle>Logo</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                      <div className="space-y-2"><Label htmlFor="logo">Upload Logo</Label><Input id="logo" type="file" accept="image/*" onChange={handleLogoUpload} /></div>
                      {logoImage && (<>
                        <div className="space-y-2"><Label>Logo Scale: {Math.round(logoScale * 100)}%</Label><Slider value={[logoScale]} onValueChange={(v) => setLogoScale(v[0])} min={0.1} max={0.4} step={0.01} /></div>
                        <div className="flex items-center space-x-2"><Checkbox id="excavate" checked={excavate} onCheckedChange={(checked) => setExcavate(!!checked)} /><Label htmlFor="excavate">Clear space for logo</Label></div>
                      </>)}
                  </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="ai" className="mt-6">
              <Card>
                <CardHeader><CardTitle className="flex items-center">AI QR Code <Sparkles className="ml-2 h-5 w-5 text-yellow-500" /></CardTitle></CardHeader>
                <CardContent>
                  <AiQrForm onGenerate={handleGenerateAiQr} isGenerating={isGeneratingAiQr} />
                  {aiQrError && <p className="text-red-500 text-sm mt-4">{aiQrError}</p>}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="download" className="mt-6">
              <Card>
                  <CardHeader><CardTitle>Download</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                      <div className="space-y-2">
                          <Label>Image Format</Label>
                          <Select onValueChange={(v: 'png'|'jpeg'|'webp') => setImageFormat(v)} defaultValue={imageFormat} disabled={activeTab === 'ai'}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent><SelectItem value="png">PNG</SelectItem><SelectItem value="jpeg">JPEG</SelectItem><SelectItem value="webp">WEBP</SelectItem></SelectContent>
                          </Select>
                          {activeTab === 'ai' && <p className="text-xs text-muted-foreground">AI QR codes are downloaded as PNGs.</p>}
                      </div>
                      <Button onClick={handleDownload} className="w-full">Download QR Code</Button>
                  </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg p-4 h-full min-h-[400px]">
            {activeTab === 'ai' ? (
              <>
                {isGeneratingAiQr && <div className="flex flex-col items-center gap-4"><Loader2 className="h-16 w-16 animate-spin text-primary" /><p className="text-muted-foreground">Generating your masterpiece...</p></div>}
                {!isGeneratingAiQr && aiQrImageUrl && (<img src={aiQrImageUrl} alt="AI Generated QR Code" className="w-full max-w-[400px] rounded-lg" />)}
                {!isGeneratingAiQr && !aiQrImageUrl && (<div className="text-center text-gray-500"><Sparkles className="mx-auto h-12 w-12 mb-4" /><p>Your generated AI QR code will appear here.</p></div>)}
              </>
            ) : (
              <div ref={qrRef}><QRCodeCanvas value={qrValue} size={size} fgColor={fgColor} bgColor={bgColor} level={level} imageSettings={imageSettings} /></div>
            )}
          </div>
      </div>
    </div>
  );
};

export default QrGenerator;