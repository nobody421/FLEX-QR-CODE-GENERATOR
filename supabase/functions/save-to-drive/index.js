import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Google Drive API endpoint for file upload
const DRIVE_UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', // Use Service Role Key for secure profile access
    {
      auth: {
        persistSession: false,
      },
    }
  )

  try {
    // 1. Authenticate user via JWT
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response('Unauthorized: Missing Authorization header', { status: 401, headers: corsHeaders })
    }
    const token = authHeader.replace('Bearer ', '')
    
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token)
    if (userError || !user) {
      return new Response('Unauthorized: Invalid token', { status: 401, headers: corsHeaders })
    }
    const userId = user.id

    // 2. Get request body (image data and metadata)
    const { base64Image, fileName } = await req.json()
    if (!base64Image || !fileName) {
      return new Response('Missing image data or file name', { status: 400, headers: corsHeaders })
    }

    // 3. Fetch Google Drive tokens from user profile (using Service Role Key)
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('google_drive_access_token, google_drive_refresh_token')
      .eq('id', userId)
      .single()

    if (profileError || !profile || !profile.google_drive_access_token) {
      return new Response('Google Drive not linked or tokens missing.', { status: 403, headers: corsHeaders })
    }

    let accessToken = profile.google_drive_access_token;
    // NOTE: Token refresh logic would be implemented here if the token expired.
    // For simplicity, we assume the token is valid for now.

    // 4. Prepare file data for Google Drive upload
    const metadata = {
      name: fileName,
      mimeType: 'image/png', // Assuming PNG format for QR codes
      parents: ['root'] // Save to the root folder of the user's Drive
    };

    const boundary = 'foo_bar_baz';
    const multipartBody = [
      `--${boundary}`,
      `Content-Type: application/json; charset=UTF-8`,
      '',
      JSON.stringify(metadata),
      `--${boundary}`,
      `Content-Type: image/png`,
      `Content-Transfer-Encoding: base64`,
      '',
      base64Image,
      `--${boundary}--`,
      ''
    ].join('\r\n');

    // 5. Upload to Google Drive
    const driveResponse = await fetch(DRIVE_UPLOAD_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
        'Content-Length': String(new TextEncoder().encode(multipartBody).length),
      },
      body: multipartBody,
    });

    if (!driveResponse.ok) {
      const errorText = await driveResponse.text();
      console.error('Google Drive Upload Failed:', errorText);
      return new Response(`Google Drive upload failed: ${driveResponse.statusText}`, { status: 500, headers: corsHeaders })
    }

    const driveData = await driveResponse.json();

    return new Response(JSON.stringify({ message: 'File uploaded successfully', driveId: driveData.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Edge Function Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})