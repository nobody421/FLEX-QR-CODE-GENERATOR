import React from 'react';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const YouTubeUploader = () => {
  const { session, loading, supabase } = useSupabaseAuth();
  const navigate = useNavigate();

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
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">YouTube Uploader</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
          Welcome, {session.user?.email}! This is where you'll upload your videos.
        </p>
        <p className="text-md text-gray-600 dark:text-gray-400 mb-8">
          (The video upload functionality will be implemented in the next steps.)
        </p>
        <Button onClick={handleLogout} variant="destructive">
          Logout
        </Button>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default YouTubeUploader;