import React, { useState } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, UploadCloud } from 'lucide-react';
import { showError, showSuccess } from '@/utils/toast';

export const FileUpload = () => {
  const { supabase } = useSupabaseAuth();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        showError('Please select a valid video file.');
        return;
      }
      setVideoFile(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!videoFile || !title) {
      showError('Please select a video file and provide a title.');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('video', videoFile);
      formData.append('title', title);
      formData.append('description', description);

      const { data, error } = await supabase.functions.invoke('youtube-upload', {
        body: formData,
      });

      if (error) {
        throw new Error(error.message);
      }
      
      showSuccess('Video uploaded successfully to YouTube!');
      setVideoFile(null);
      setTitle('');
      setDescription('');

    } catch (err: any) {
      console.error('Upload failed:', err);
      const errorMessage = err.context?.error?.error || err.message || 'An unknown error occurred.';
      showError(`Upload failed: ${errorMessage}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Video to YouTube</CardTitle>
        <CardDescription>
          Select a video file and provide a title and description. The video will be uploaded as 'private'.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title (Required)</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My Awesome Video"
              required
              disabled={isUploading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short description of the video content."
              disabled={isUploading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="videoFile">Video File (Required)</Label>
            <Input
              id="videoFile"
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              required
              disabled={isUploading}
            />
            {videoFile && <p className="text-sm text-muted-foreground">Selected: {videoFile.name}</p>}
          </div>
          <Button type="submit" disabled={isUploading || !videoFile || !title} className="w-full">
            {isUploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <UploadCloud className="mr-2 h-4 w-4" />
            )}
            {isUploading ? 'Uploading...' : 'Upload to YouTube'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};