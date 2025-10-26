import React, { useState } from 'react';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QRCodeCanvas } from 'qrcode.react';

const QrGenerator = () => {
  const { session, loading, supabase } = useSupabaseAuth();
  const navigate = useNavigate();
  const [url, setUrl] = useState('https://www.dyad.sh');

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
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>QR Code Content</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="url">URL</Label>
                                <Input 
                                    id="url" 
                                    value={url} 
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="https://example.com"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="flex flex-col items-center justify-center">
                <Card className="p-4">
                    <QRCodeCanvas value={url} size={256} />
                </Card>
            </div>
        </div>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default QrGenerator;