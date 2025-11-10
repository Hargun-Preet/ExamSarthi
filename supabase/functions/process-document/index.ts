import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { encode as b64encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { fileName, fileType } = await req.json();

    // Normalized extension detection (handles both extension and MIME types)
    const nameExt = (fileName?.split('.')?.pop() || '').toLowerCase();
    const mime = (fileType || '').toLowerCase();
    const mimeToExt: Record<string, string> = {
      'application/pdf': 'pdf',
      'application/msword': 'doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
      'application/vnd.ms-powerpoint': 'ppt',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
      'application/vnd.ms-excel': 'xls',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
      'image/png': 'png',
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/webp': 'webp',
      'text/plain': 'txt',
    };

    const guessedFromMime = mimeToExt[mime] || '';
    const ext = (nameExt || guessedFromMime).toLowerCase();

    // Download file from storage
    const { data: fileData, error: downloadError } = await supabaseClient.storage
      .from('study-materials')
      .download(fileName);

    if (downloadError) throw downloadError;

    // For supported document formats, prefer Lovable's Document Parser. Fallbacks:
    // - Images: OCR via Lovable AI (Gemini 2.5)
    // - TXT: direct text read
    const docParserExts = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'];
    const imageExts = ['png', 'jpg', 'jpeg', 'webp'];

    // Small helper: robust parser call with retry
    const parseWithLovableParser = async (): Promise<string> => {
      const formData = new FormData();
      formData.append('file', fileData, fileName);

      // Try up to 2 times in case of transient DNS/network hiccups
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const parseResponse = await fetch('https://document-parser.lovable.dev/parse', {
            method: 'POST',
            body: formData,
          });
          if (parseResponse.ok) {
            const parseResult = await parseResponse.json();
            return parseResult.content || '';
          } else {
            console.error('Parser API error:', await parseResponse.text());
          }
        } catch (err) {
          console.error(`Parser call failed (attempt ${attempt}):`, err);
          // brief delay before retry
          if (attempt === 1) await new Promise((r) => setTimeout(r, 800));
        }
      }
      return '';
    };

    let content = '';

    try {
      if (docParserExts.includes(ext)) {
        // Use Lovable's parser service (correct endpoint)
        const formData = new FormData();
        formData.append('file', fileData, fileName);

        const parseResponse = await fetch('https://document-parser.lovable.dev/parse', {
          method: 'POST',
          body: formData,
        });

        if (parseResponse.ok) {
          const parseResult = await parseResponse.json();
          content = parseResult.content || '';
        } else {
          console.error('Parser API error:', await parseResponse.text());
          // Fallback to naive text extraction
          content = await fileData.text();
        }
      } else if (imageExts.includes(ext)) {
        // OCR via Lovable AI (Gemini 2.5)
        const buf = new Uint8Array(await fileData.arrayBuffer());
        const base64 = b64encode(buf.buffer);
        const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : ext === 'png' ? 'image/png' : 'image/webp';
        const dataUrl = `data:${mime};base64,${base64}`;

        const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
        if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY is not configured');

        const aiResp = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              { role: 'system', content: 'You are an OCR engine. Extract all visible text from the provided image. Return plain UTF-8 text only with reasonable line breaks. No extra commentary.' },
              {
                role: 'user',
                content: [
                  { type: 'text', text: 'Extract all text from this image. Return only the text.' },
                  { type: 'image_url', image_url: { url: dataUrl } },
                ]
              }
            ],
            temperature: 0.2,
            max_tokens: 2000,
          }),
        });

        if (!aiResp.ok) {
          const t = await aiResp.text();
          console.error('AI OCR error:', aiResp.status, t);
          content = await fileData.text();
        } else {
          const aiJson = await aiResp.json();
          content = aiJson.choices?.[0]?.message?.content || '';
        }
      } else if (ext === 'txt') {
        content = await fileData.text();
      } else {
        // Unknown format: try parser first, then fallback to text
        try {
          const parsed = await parseWithLovableParser();
          if (parsed) {
            content = parsed;
          } else {
            content = await fileData.text();
          }
        } catch (e) {
          console.error('Parser call failed (unknown format):', e);
          content = await fileData.text();
        }
      }
    } catch (e) {
      console.error('Processing error, using basic text extraction:', e);
      content = await fileData.text();
    }

    // Clean content to remove problematic Unicode characters
    let cleanedContent = content
      .replace(/\u0000/g, '') // Remove null bytes
      .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '') // Remove control characters
      .replace(/[\uD800-\uDFFF]/g, ''); // Remove unpaired surrogates

    // Limit content to first 50000 characters to avoid context limits
    const truncatedContent = cleanedContent.slice(0, 50000);

    return new Response(
      JSON.stringify({ 
        content: truncatedContent,
        message: 'Document processed successfully' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error processing document:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        content: '' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});