import { NextResponse } from 'next/server';
import { getTokensFromCode, storeTokens } from '@/lib/auth/googleAuth';

/**
 * Handles the OAuth callback from Google
 * Exchanges the authorization code for tokens and stores them
 */
export async function GET(request: Request) {
  try {
    // Get the URL and extract the code parameter
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    
    if (!code) {
      return NextResponse.json({ error: 'Authorization code not provided' }, { status: 400 });
    }
    
    // Exchange the code for tokens
    const tokens = await getTokensFromCode(code);
    
    // Store the tokens in the database
    await storeTokens(tokens);
    
    // Redirect to a success page or dashboard
    return NextResponse.redirect(new URL('/auth/success', request.url));
  } catch (error) {
    console.error('Error handling OAuth callback:', error);
    
    // Redirect to an error page
    return NextResponse.redirect(new URL('/auth/error', request.url));
  }
}
