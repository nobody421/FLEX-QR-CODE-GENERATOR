import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const shortCode = url.pathname.split('/').pop()
    
    if (!shortCode) {
      return new Response('Invalid QR code', { status: 400, headers: corsHeaders })
    }

    // Get Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Find QR code by short code
    const { data: qrCode, error } = await supabaseClient
      .from('qr_codes')
      .select('*')
      .eq('short_code', shortCode)
      .single()

    if (error || !qrCode) {
      return new Response('QR code not found', { status: 404, headers: corsHeaders })
    }

    // Check scan limit
    if (qrCode.scan_limit !== null) {
      const { count, error: countError } = await supabaseClient
        .from('qr_scans')
        .select('*', { count: 'exact', head: true })
        .eq('qr_code_id', qrCode.id)

      if (countError) {
        console.error('Error counting scans:', countError)
      } else if (count && count >= qrCode.scan_limit) {
        return new Response('Scan limit reached', { status: 403, headers: corsHeaders })
      }
    }

    // Log scan data
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    const userAgent = req.headers.get('user-agent') || 'unknown'
    const referrer = req.headers.get('referer') || 'unknown'
    
    // Simple geolocation based on IP (in a real app, you'd use a geolocation service)
    const geolocation = {
      country: 'unknown',
      region: 'unknown',
      city: 'unknown'
    }

    await supabaseClient.from('qr_scans').insert({
      qr_code_id: qrCode.id,
      ip_address: ipAddress,
      user_agent: userAgent,
      referrer: referrer,
      geolocation: geolocation
    })

    // Build redirect URL with campaign tags
    const redirectUrl = new URL(qrCode.destination_url)
    
    if (qrCode.campaign_source) redirectUrl.searchParams.set('utm_source', qrCode.campaign_source)
    if (qrCode.campaign_medium) redirectUrl.searchParams.set('utm_medium', qrCode.campaign_medium)
    if (qrCode.campaign_name) redirectUrl.searchParams.set('utm_campaign', qrCode.campaign_name)
    if (qrCode.campaign_term) redirectUrl.searchParams.set('utm_term', qrCode.campaign_term)
    if (qrCode.campaign_content) redirectUrl.searchParams.set('utm_content', qrCode.campaign_content)

    // Redirect to destination
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        'Location': redirectUrl.toString()
      }
    })
  } catch (error) {
    console.error('Error in QR redirect function:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})