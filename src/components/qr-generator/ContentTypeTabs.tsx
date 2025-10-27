import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link, FileText, Mail, MessageSquare, Wifi } from 'lucide-react';
import { UrlForm } from '@/components/qr-forms/UrlForm';
import { TextForm } from '@/components/qr-forms/TextForm';
import { EmailForm } from '@/components/qr-forms/EmailForm';
import { SmsForm } from '@/components/qr-forms/SmsForm';
import { WifiForm } from '@/components/qr-forms/WifiForm';

interface ContentTypeTabsProps {
  onValueChange: (value: string) => void;
  qrValue: string;
  setQrValue: (value: string) => void;
}

export const ContentTypeTabs: React.FC<ContentTypeTabsProps> = ({
  onValueChange,
  qrValue,
  setQrValue
}) => {
  const handleContentTypeChange = (type: string) => {
    onValueChange(type);
    switch (type) {
      case 'url': setQrValue('https://www.dyad.sh'); break;
      case 'text': setQrValue(''); break;
      case 'email': setQrValue('mailto:'); break;
      case 'sms': setQrValue('smsto:'); break;
      case 'wifi': setQrValue('WIFI:T:WPA;S:;P:;;'); break;
      default: setQrValue('');
    }
  };

  return (
    <Tabs defaultValue="url" className="w-full" onValueChange={handleContentTypeChange}>
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="url"><Link className="h-4 w-4" /></TabsTrigger>
        <TabsTrigger value="text"><FileText className="h-4 w-4" /></TabsTrigger>
        <TabsTrigger value="email"><Mail className="h-4 w-4" /></TabsTrigger>
        <TabsTrigger value="sms"><MessageSquare className="h-4 w-4" /></TabsTrigger>
        <TabsTrigger value="wifi"><Wifi className="h-4 w-4" /></TabsTrigger>
      </TabsList>
      <TabsContent value="url" className="mt-4">
        <UrlForm onValueChange={setQrValue} initialValue="https://www.dyad.sh" />
      </TabsContent>
      <TabsContent value="text" className="mt-4">
        <TextForm onValueChange={setQrValue} />
      </TabsContent>
      <TabsContent value="email" className="mt-4">
        <EmailForm onValueChange={setQrValue} />
      </TabsContent>
      <TabsContent value="sms" className="mt-4">
        <SmsForm onValueChange={setQrValue} />
      </TabsContent>
      <TabsContent value="wifi" className="mt-4">
        <WifiForm onValueChange={setQrValue} />
      </TabsContent>
    </Tabs>
  );
};