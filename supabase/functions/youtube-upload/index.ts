import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // 1. Authenticate user
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    // 2. Get user's YouTube tokens from their profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('youtube_access_token, youtube_refresh_token')
      .eq('id', user.id)
      .single();

    if (profileError || !profile || !profile.youtube_access_token) {
      throw new Error('YouTube tokens not found for user.');
    }

    let accessToken = profile.youtube_access_token;
    const refreshToken = profile.youtube_refresh_token;

    // 3. Parse form data from the request
    const formData = await req.formData();
    const videoFile = formData.get('video');
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    if (!videoFile || !(videoFile instanceof File)) {
        throw new Error('Video file not provided or is in the wrong format.');
    }

    // 4. Define the upload function
    const uploadVideo = async (token: string) => {
      const metadata = {
        snippet: {
          title,
          description,
        },
        status: {
          privacyStatus: 'private',
        },
      };

      const youtubeApiUrl = 'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=multipart&part=snippet,status';
      
      const body = new FormData();
      body.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      body.append('video', videoFile);

      const response = await fetch(youtubeApiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body,
      });

      return response;
    };

    // 5. Try to upload with the current access token
    let uploadResponse = await uploadVideo(accessToken);

    // 6. If token is expired (401), refresh it and retry
    if (uploadResponse.status === 401 && refreshToken) {
      console.log('Access token expired. Refreshing...');
      
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: Deno.env.get('GOOGLE_CLIENT_ID')!,
          client_secret: Deno.env.get('GOOGLE_CLIENT_SECRET')!,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        }),
      });

      const tokenData = await tokenResponse.json();
      if (tokenData.error) {
        throw new Error(`Failed to refresh token: ${tokenData.error_description}`);
      }

      const newAccessToken = tokenData.access_token;

      const supabaseAdmin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
      await supabaseAdmin
        .from('profiles')
        .update({ youtube_access_token: newAccessToken })
        .eq('id', user.id);
      
      console.log('Token refreshed. Retrying upload...');
      accessToken = newAccessToken;
      uploadResponse = await uploadVideo(accessToken);
    }

    const responseData = await uploadResponse.json();

    if (!uploadResponse.ok) {
      console.error('YouTube API Error:', responseData);
      throw new Error(responseData.error?.message || 'Failed to upload video to YouTube.');
    }

    return new Response(JSON.stringify({ message: 'Video uploaded successfully!', video: responseData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
})