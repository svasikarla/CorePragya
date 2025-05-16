import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// Create a Supabase admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid authorization header' }, { status: 401 });
    }

    // Extract the token
    const token = authHeader.split(' ')[1];

    // Verify the token and get the user
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      console.error('Auth error:', authError);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json()
    const { knowledgeStats } = body

    if (!knowledgeStats) {
      return NextResponse.json({ error: 'Missing knowledge stats' }, { status: 400 })
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key is not configured');
      return NextResponse.json({ 
        error: 'OpenAI API key is not configured',
        insights: [
          "You're building a diverse knowledge base across multiple categories.",
          `Your strongest area is ${knowledgeStats.topCategory || 'None'}.`,
          "Consider exploring more content in underrepresented categories."
        ] 
      });
    }

    // Prepare prompt for OpenAI
    const prompt = `
      Analyze this knowledge base statistics and provide 3-5 insightful observations and recommendations:
      
      Total Entries: ${knowledgeStats.totalEntries}
      
      Category Distribution:
      ${Object.entries(knowledgeStats.categoryCounts || {})
        .map(([category, count]) => `- ${category}: ${count} entries`)
        .join('\n')}
      
      Top Category: ${knowledgeStats.topCategory || 'None'} (${(knowledgeStats.categoryCounts || {})[knowledgeStats.topCategory] || 0} entries)
      
      Recent Entries:
      ${(knowledgeStats.recentEntries || []).map(entry => 
        `- Title: ${entry.title || 'Untitled'}, Category: ${entry.category || 'Uncategorized'}`
      ).join('\n')}
      
      Provide insights about:
      1. Learning patterns and focus areas
      2. Knowledge gaps or areas to explore
      3. Recommendations for balancing knowledge
      4. Potential connections between topics
      
      Format your response as a JSON array of strings, each containing one insight or recommendation.
      Example: ["Insight 1", "Insight 2", "Insight 3"]
    `;

    console.log('Sending prompt to OpenAI:', prompt);

    // Call OpenAI API
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an analytics assistant that provides insightful observations about a user's knowledge collection patterns." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    console.log('OpenAI response:', aiResponse.choices[0]?.message?.content);

    // Parse the response
    const aiContent = aiResponse.choices[0]?.message?.content || '';
    let insights = [];
    
    try {
      // Extract JSON from the response
      const jsonMatch = aiContent.match(/\[[\s\S]*\]/);
      const jsonString = jsonMatch ? jsonMatch[0] : aiContent;
      insights = JSON.parse(jsonString);
    } catch (error) {
      console.error('Error parsing AI response:', error);
      // Fallback insights
      insights = [
        "You're building a diverse knowledge base across multiple categories.",
        `Your strongest area is ${knowledgeStats.topCategory || 'None'}.`,
        "Consider exploring more content in underrepresented categories."
      ];
    }

    return NextResponse.json({ insights });
  } catch (error) {
    console.error('Error generating insights:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate insights',
        message: error.message,
        insights: [
          "You're building a knowledge collection across various topics.",
          "Consider adding more entries to get better insights.",
          "Explore different categories to diversify your knowledge."
        ]
      },
      { status: 500 }
    );
  }
}


