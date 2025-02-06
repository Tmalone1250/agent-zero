import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from '@supabase/supabase-js'
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()
    const mainDocument = formData.get('mainDocument')
    const referenceDocument = formData.get('referenceDocument')

    if (!mainDocument) {
      return new Response(
        JSON.stringify({ error: 'No main document uploaded' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Upload documents to storage
    const mainDocPath = `${crypto.randomUUID()}-${mainDocument.name}`
    const { error: mainUploadError } = await supabase.storage
      .from('document_formatting')
      .upload(mainDocPath, mainDocument)

    if (mainUploadError) {
      throw new Error(`Failed to upload main document: ${mainUploadError.message}`)
    }

    let referenceDocPath = null
    if (referenceDocument) {
      referenceDocPath = `${crypto.randomUUID()}-${referenceDocument.name}`
      const { error: refUploadError } = await supabase.storage
        .from('document_formatting')
        .upload(referenceDocPath, referenceDocument)

      if (refUploadError) {
        throw new Error(`Failed to upload reference document: ${refUploadError.message}`)
      }
    }

    // TODO: Implement document formatting logic here
    // For now, we'll just return the original document
    const { data: mainDocData, error: mainDocError } = await supabase.storage
      .from('document_formatting')
      .download(mainDocPath)

    if (mainDocError) {
      throw new Error(`Failed to retrieve formatted document: ${mainDocError.message}`)
    }

    return new Response(
      mainDocData,
      {
        headers: {
          ...corsHeaders,
          'Content-Type': mainDocument.type,
          'Content-Disposition': `attachment; filename="formatted_${mainDocument.name}"`,
        },
      }
    )
  } catch (error) {
    console.error('Error in format-document function:', error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})