import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, examType, conversationHistory, userId, language = 'en' } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Create Supabase client to fetch user's documents
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch user's uploaded documents if userId is provided
    let documentContext = '';
    if (userId) {
      const { data: documents, error: docError } = await supabaseClient
        .from('documents')
        .select('content, filename')
        .eq('user_id', userId);

      if (!docError && documents && documents.length > 0) {
        documentContext = '\n\nREFERENCE MATERIALS:\n' + 
          documents.map(doc => `\n--- ${doc.filename} ---\n${doc.content}`).join('\n');
      }
    }

    // Build system prompt based on exam type, language, and capabilities
    const languageInstruction = language !== 'en' 
      ? `\n\nIMPORTANT: Respond in ${language === 'es' ? 'Spanish' : language === 'fr' ? 'French' : language === 'de' ? 'German' : language === 'hi' ? 'Hindi' : language === 'zh' ? 'Chinese' : language === 'ja' ? 'Japanese' : language === 'ar' ? 'Arabic' : language === 'pt' ? 'Portuguese' : language === 'ru' ? 'Russian' : 'English'}. All your responses should be in this language unless the user specifically requests otherwise.`
      : '';
    
    const systemPrompt = `You are ExamSarthi, an expert AI tutor specializing in exam preparation${examType ? ` for ${examType.toUpperCase()}` : ''}. Your role is to:

1. Answer questions based on the uploaded study materials (if provided)
2. Generate practice tests and questions from the uploaded content
3. Create personalized study plans
4. Generate flashcards for efficient revision - when asked, return them in a special format
5. Generate interactive mind maps - when asked, return them in a special format
6. Recommend relevant YouTube video lectures with links and thumbnails
7. Explain concepts clearly and thoroughly
8. Summarize topics or explain specific questions/problems
9. Provide study tips and strategies
10. Offer motivation and encouragement

IMPORTANT INSTRUCTIONS:
- When the user has uploaded study materials, prioritize using that content to answer questions and generate tests
- When asked to generate flashcards, you MUST respond with a JSON block in this EXACT format, and mention in your response that flashcards have been created:
  \`\`\`flashcards
  [
    {"question": "What is photosynthesis?", "answer": "The process by which plants convert light energy into chemical energy"},
    {"question": "What is the formula for water?", "answer": "H2O - two hydrogen atoms bonded to one oxygen atom"}
  ]
  \`\`\`
- When asked to create a mind map for a topic, you MUST respond with a JSON block in this EXACT format:
  \`\`\`mindmap
  {
    "topic": "Main Topic Name",
    "nodes": [
      {
        "id": "1",
        "label": "Node 1",
        "details": "Detailed explanation of this concept",
        "children": ["2", "3"]
      },
      {
        "id": "2",
        "label": "Child Node 1",
        "details": "More details about this subtopic",
        "children": []
      }
    ]
  }
  \`\`\`
- When formatting practice test MCQs, use proper markdown formatting with clear spacing:
  **Question X:**
  Question text here?
  
  A) Option A
  B) Option B
  C) Option C
  D) Option D
  
- When recommending YouTube videos, provide markdown links with search queries like: [Topic Name](https://www.youtube.com/results?search_query=your+search+terms)
- When asked to summarize or explain, provide clear, structured explanations with examples

Be concise, friendly, and educational. When creating study plans, be specific about topics, time allocation, and resources.${languageInstruction}${documentContext}`;

    // Prepare messages for the API
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-10), // Keep last 10 messages for context
      { role: 'user', content: message },
    ];

    console.log('Sending request to Lovable AI...');
    
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: messages,
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI service requires payment. Please contact support.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      throw new Error('Failed to get AI response');
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('AI response received successfully');

    // Check if response contains flashcards
    let flashcards = null;
    const flashcardMatch = aiResponse.match(/```flashcards\n([\s\S]*?)\n```/);
    if (flashcardMatch) {
      try {
        flashcards = JSON.parse(flashcardMatch[1]);
      } catch (e) {
        console.error('Failed to parse flashcards:', e);
      }
    }

    // Check if response contains mind map
    let mindmap = null;
    const mindmapMatch = aiResponse.match(/```mindmap\n([\s\S]*?)\n```/);
    if (mindmapMatch) {
      try {
        mindmap = JSON.parse(mindmapMatch[1]);
      } catch (e) {
        console.error('Failed to parse mindmap:', e);
      }
    }

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        flashcards: flashcards,
        mindmap: mindmap
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in chat function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
