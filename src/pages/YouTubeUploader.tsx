import React, { useState, useEffect, useCallback } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Youtube } from 'lucide-react';
import { showError, showSuccess } from '@/utils/toast';
import { FileUpload } from '@/components/FileUpload';

const YouTubeUploader = () => {
  const { session, loading, supabase } = useSupabaseAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  const checkConnectionStatus = useCallback(async () => {
    if (!session) {
      setIsCheckingStatus(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('youtube_access_token')
        .eq('id', session.user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (data?.youtube_access_token) {
        setIsConnected(true);
      } else {
        if (session.provider_token) {
          await storeTokens();
        } else {
          setIsConnected(false);
        }
      }
    } catch (error) {
      console.error('Error checking YouTube connection status:', error);
      showError('Could not verify YouTube connection.');
      setIsConnected(false);
    } finally {
      setIsCheckingStatus(false);
    }
  }, [session, supabase]);

  useEffect(() => {
    checkConnectionStatus();
  }, [checkConnectionStatus]);

  const storeTokens = async () => {
    try {
      const { error } = await supabase.functions.invoke('store-youtube-tokens');
      if (error) throw error;
      setIsConnected(true);
      showSuccess('Successfully connected to YouTube!');
    } catch (error) {
      console.error('Error storing tokens:', error);
      showError('Failed to store YouTube connection details.');
    }
  };

  const handleConnectYouTube = async () => {
    setIsConnecting(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/youtube.upload',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        redirectTo: window.location.href,
      },
    });
    if (error) {
      console.error('Error during sign-in:', error);
      showError('Failed to connect with Google.');
      setIsConnecting(false);
    }
  };

  if (loading || isCheckingStatus) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">YouTube Uploader</h1>
      {isConnected ? (
        <FileUpload />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Connect to YouTube</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                To upload videos, you need to connect your YouTube account.
              </p>
              <Button onClick={handleConnectYouTube} disabled={isConnecting}>
                {isConnecting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Youtube className="mr-2 h-4 w-4" />
                )}
                {isConnecting ? 'Redirecting...' : 'Connect with YouTube'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default YouTubeUploader;