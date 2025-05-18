import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create a Supabase client with admin privileges
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
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

    // Get total count of embeddings
    const { count: totalCount, error: totalError } = await supabaseAdmin
      .from('embeddings')
      .select('*', { count: 'exact', head: true });
    
    if (totalError) {
      console.error('Error getting total count:', totalError);
      return NextResponse.json({ error: 'Failed to get embedding stats' }, { status: 500 });
    }

    // Get count of embeddings with vectors
    const { count: withEmbeddingsCount, error: withError } = await supabaseAdmin
      .from('embeddings')
      .select('*', { count: 'exact', head: true })
      .not('vector', 'is', null);
    
    if (withError) {
      console.error('Error getting with embeddings count:', withError);
      return NextResponse.json({ error: 'Failed to get embedding stats' }, { status: 500 });
    }

    // Get count of embeddings without vectors
    const { count: withoutEmbeddingsCount, error: withoutError } = await supabaseAdmin
      .from('embeddings')
      .select('*', { count: 'exact', head: true })
      .is('vector', null);
    
    if (withoutError) {
      console.error('Error getting without embeddings count:', withoutError);
      return NextResponse.json({ error: 'Failed to get embedding stats' }, { status: 500 });
    }

    return NextResponse.json({
      total: totalCount || 0,
      withEmbeddings: withEmbeddingsCount || 0,
      withoutEmbeddings: withoutEmbeddingsCount || 0
    });
    
  } catch (err) {
    const error = err as Error;
    console.error('Unhandled error getting embedding stats:', error);
    return NextResponse.json({
      error: `Internal server error: ${error.message || 'Unknown error'}`
    }, { status: 500 });
  }
}
