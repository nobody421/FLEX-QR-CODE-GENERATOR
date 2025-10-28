import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { FileExtension } from 'qr-code-styling';

// Modular components
import { QRPreview } from '@/components/qr-generator/QRPreview';
import { QuickTips } from '@/components/qr-generator/QuickTips';
import { ContentTypeTabs } from '@/components/qr-generator/ContentTypeTabs';
import { StyleCustomization } from '@/components/qr-generator/StyleCustomization';
import { LogoIntegration } from '@/components/qr-generator/LogoIntegration';
import { CampaignTracking } from '@/components/qr-generator/CampaignTracking';
import { ExportOptions } from '@/components/qr-generator/ExportOptions';
import { SaveQrCode } from '@/components/qr-generator/SaveQrCode';
import { StyledQrCodeRef } from '@/components/qr-generator/StyledQrCode';

const QrEditor = () => {
  const { qrCodeId } = useParams<{ qrCodeId: string }>();
  const navigate = useNavigate();
  const qrRef = useRef<StyledQrCodeRef>(null);
  
  const [loading, setLoading] = useState(true);
  const [qrValue, setQrValue] = useState('');
  const [size, setSize] = useState(256);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [level, setLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [imageFormat, setImageFormat] = useState<FileExtension>('png');
  const [logoImage, setLogoImage] = useState<string | undefined>(undefined);
  const [logoScale, setLogoScale] = useState(0.2);
  const [excavate, setExcavate] = useState(true);
  const [customPattern, setCustomPattern] = useState('#000000');
  const [qrName, setQrName] = useState('');
  const [scanLimit, setScanLimit] = useState<number | undefined>(undefined);
  
  const [shapeStyle, setShapeStyle] = useState('square');
  const [borderStyle, setBorderStyle] = useState('square');
  const [centerStyle, setCenterStyle] = useState('square');
  
  const [campaignSource, setCampaignSource] = useState('');
  const [campaignMedium, setCampaignMedium] = useState('');
  const [campaignName, setCampaignName] = useState('');
  const [campaignTerm, setCampaignTerm] = useState('');
  const [campaignContent, setCampaignContent] = useState('');

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (qrCodeId) {
      fetchQrCodeData(qrCodeId);
    }
  }, [qrCodeId]);

  const fetchQrCodeData = async (id: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('qr_codes')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) throw new Error('QR Code not found.');

      setQrName(data.name || '');
      setQrValue(data.destination_url || '');
      setCustomPattern(data.custom_pattern || '#000000');
      setScanLimit(data.scan_limit || undefined);
      setCampaignSource(data.campaign_source || '');
      setCampaignMedium(data.campaign_medium || '');
      setCampaignName(data.campaign_name || '');
      setCampaignTerm(data.campaign_term || '');
      setCampaignContent(data.campaign_content || '');
      setShapeStyle(data.shape_style || 'square');
      setBorderStyle(data.border_style || 'square');
      setCenterStyle(data.center_style || 'square');
      
    } catch (error) {
      console.error('Error fetching QR code for editing:', error);
      showError('Failed to load QR code data.');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    qrRef.current?.download({
      name: `flexqr-code-${qrName || 'unnamed'}`,
      extension: imageFormat,
    });
  };

  const handleContentTypeChange = (type: string) => {
    console.warn(`Content type changed to ${type}. Only URL value is updated.`);
  };

  const handleUpdateQrCode = async () => {
    if (!qrCodeId) return;
    setSaving(true);
    try {
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
      
      const { error } = await supabase
        .from('qr_codes')
        .update({
          name: qrName || 'Untitled QR Code',
          destination_url: finalDestinationUrl,
          scan_limit: scanLimit,
          campaign_source: campaignSource,
          campaign_medium: campaignMedium,
          campaign_name: campaignName,
          campaign_term: campaignTerm,
          campaign_content: campaignContent,
          custom_pattern: customPattern,
          shape_style: shapeStyle,
          border_style: borderStyle,
          center_style: centerStyle,
        })
        .eq('id', qrCodeId);

      if (error) throw error;
      
      showSuccess('QR code updated successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating QR code:', error);
      showError('Failed to update QR code');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white ml-4">Edit QR Code: {qrName}</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="style" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="style">Content & Style</TabsTrigger>
              <TabsTrigger value="logo">Logo</TabsTrigger>
              <TabsTrigger value="tracking">Tracking</TabsTrigger>
              <TabsTrigger value="download">Download</TabsTrigger>
            </TabsList>
            <TabsContent value="style" className="space-y-6 mt-6">
              <Card>
                <CardHeader><CardTitle>Content Type</CardTitle></CardHeader>
                <CardContent>
                  <ContentTypeTabs 
                    onValueChange={handleContentTypeChange} 
                    qrValue={qrValue}
                    setQrValue={setQrValue}
                  />
                </CardContent>
              </Card>
              <StyleCustomization 
                size={size} setSize={setSize}
                bgColor={bgColor} setBgColor={setBgColor}
                customPattern={customPattern} setCustomPattern={setCustomPattern}
                level={level} setLevel={setLevel}
                shapeStyle={shapeStyle} setShapeStyle={setShapeStyle}
                borderStyle={borderStyle} setBorderStyle={setBorderStyle}
                centerStyle={centerStyle} setCenterStyle={setCenterStyle}
              />
              <SaveQrCode 
                qrName={qrName} setQrName={setQrName}
                saving={saving} onSave={handleUpdateQrCode}
              />
            </TabsContent>
            <TabsContent value="logo" className="mt-6">
              <LogoIntegration 
                logoImage={logoImage} setLogoImage={setLogoImage}
                logoScale={logoScale} setLogoScale={setLogoScale}
                excavate={excavate} setExcavate={setExcavate}
              />
            </TabsContent>
            <TabsContent value="tracking" className="mt-6">
              <CampaignTracking 
                scanLimit={scanLimit} setScanLimit={setScanLimit}
                campaignSource={campaignSource} setCampaignSource={setCampaignSource}
                campaignMedium={campaignMedium} setCampaignMedium={setCampaignMedium}
                campaignName={campaignName} setCampaignName={setCampaignName}
                campaignTerm={campaignTerm} setCampaignTerm={setCampaignTerm}
                campaignContent={campaignContent} setCampaignContent={setCampaignContent}
              />
            </TabsContent>
            <TabsContent value="download" className="mt-6">
              <ExportOptions 
                imageFormat={imageFormat as string}
                setImageFormat={(f) => setImageFormat(f as 'png' | 'jpeg' | 'webp')}
                onDownload={handleDownload}
              />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="flex flex-col gap-6">
          <QRPreview 
            ref={qrRef}
            qrValue={qrValue}
            size={size}
            fgColor={customPattern}
            bgColor={bgColor}
            level={level}
            logoImage={logoImage}
            logoScale={logoScale}
            excavate={excavate}
            shapeStyle={shapeStyle}
            borderStyle={borderStyle}
            centerStyle={centerStyle}
          />
          <QuickTips />
        </div>
      </div>
    </div>
  );
};

export default QrEditor;