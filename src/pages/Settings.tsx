import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';
import { Chrome } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProfileForm } from '@/components/settings/ProfileForm';

const setAppTheme = (theme: string) => {
  const root = window.document.documentElement;
  // Remove all theme classes
  root.classList.remove('light', 'dark', 'theme-ocean', 'theme-sunset', 'theme-forest');
  
  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    root.classList.add(systemTheme);
  } else {
    root.classList.add(theme);
  }
  localStorage.setItem('theme', theme);
};

const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('theme') || 'system';
  }
  return 'system';
};

const Settings = () => {
  const [currentTheme, setCurrentTheme] = useState(getInitialTheme());
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
    setAppTheme(getInitialTheme());
  }, []);

  const handleThemeChange = (theme: string) => {
    setCurrentTheme(theme);
    setAppTheme(theme);
  };

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/dashboard',
        scopes: 'https://www.googleapis.com/auth/drive.file',
        skipBrowserRedirect: false,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      console.error('Google sign-in error:', error);
      showError('Failed to link Google account: ' + error.message);
    }
  };

  const isGoogleLinked = user?.app_metadata?.providers?.includes('google');

  const handleExportData = async () => {
    try {
      const { data: qrCodes, error } = await supabase
        .from('qr_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const csvContent = [
        ['Name', 'Short Code', 'Destination URL', 'Scan Count', 'Created At'],
        ...qrCodes.map(qr => [qr.name, qr.short_code, qr.destination_url, 'N/A', new Date(qr.created_at).toISOString()])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'flexqr-codes-export.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      showSuccess('Data exported successfully!');
    } catch (error) {
      console.error('Error exporting data:', error);
      showError('Failed to export data');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="grid grid-cols-1 gap-6">
        <ProfileForm />
        <Card>
          <CardHeader><CardTitle>Account Linking</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h3 className="font-medium">Google Account & Drive Access</h3>
                <p className="text-muted-foreground text-sm">
                  {isGoogleLinked ? 'Your Google account is linked.' : 'Link your Google account to enable sign-in and Google Drive saving.'}
                </p>
              </div>
              <Button onClick={handleGoogleSignIn} variant={isGoogleLinked ? 'secondary' : 'default'} disabled={isGoogleLinked}>
                <Chrome className="h-4 w-4 mr-2" />
                {isGoogleLinked ? 'Linked' : 'Link Account'}
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>App Customization</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>App Theme</Label>
              <Select onValueChange={handleThemeChange} defaultValue={currentTheme}>
                <SelectTrigger className="w-[180px]"><SelectValue placeholder="Select Theme" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="theme-ocean">Ocean</SelectItem>
                  <SelectItem value="theme-sunset">Sunset</SelectItem>
                  <SelectItem value="theme-forest">Forest</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Choose how the application looks.</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Data Export</CardTitle></CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Export all your QR codes and scan data as CSV files.</p>
            <Button onClick={handleExportData}>Export QR Codes</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Danger Zone</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Delete Account</h3>
                <p className="text-muted-foreground text-sm mb-4">Permanently delete your account and all associated data.</p>
                <Button variant="destructive">Delete Account</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;