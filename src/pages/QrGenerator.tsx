import React, { useState } from 'react';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
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

const QrGenerator = () => {
  const { session, loading, supabase } = useSupabaseAuth();
  const navigate = useNavigate();
  
  // State for QR code content and customization
  const [url, setUrl] = useState('https://www.dyad.sh');
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [level, setLevel] = useState<'L' | 'M' | 'Q' | 'H'>('L');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-300">Loading...</p>
      </div>
    );
  }

  if (!session) {
    navigate('/login');
    return null;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">FlexQR Generator</h1>
            <Button onClick={handleLogout} variant="destructive">
                Logout
            </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>QR Code Content</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Label htmlFor="url">URL</Label>
                            <Input 
                                id="url" 
                                value={url} 
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://example.com"
                            />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Customization</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Size: {size}px</Label>
                            <Slider
                                value={[size]}
                                onValueChange={(value) => setSize(value[0])}
                                min={64}
                                max={1024}
                                step={8}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="fgColor">Foreground Color</Label>
                                <Input 
                                    id="fgColor"
                                    type="color"
                                    value={fgColor}
                                    onChange={(e) => setFgColor(e.target.value)}
                                    className="p-1 h-10 w-full"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bgColor">Background Color</Label>
                                <Input 
                                    id="bgColor"
                                    type="color"
                                    value={bgColor}
                                    onChange={(e) => setBgColor(e.target.value)}
                                    className="p-1 h-10 w-full"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Error Correction</Label>
                            <Select onValueChange={(value: 'L' | 'M' | 'Q' | 'H') => setLevel(value)} defaultValue={level}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="L">Low (L)</SelectItem>
                                    <SelectItem value="M">Medium (M)</SelectItem>
                                    <SelectItem value="Q">Quartile (Q)</SelectItem>
                                    <SelectItem value="H">High (H)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <Card className="p-4" style={{ backgroundColor: bgColor }}>
                    <QRCodeCanvas 
                        value={url} 
                        size={size}
                        fgColor={fgColor}
                        bgColor={bgColor}
                        level={level}
                    />
                </Card>
            </div>
        </div>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default QrGenerator;