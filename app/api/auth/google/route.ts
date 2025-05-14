import { NextResponse } from 'next/server';
import { getAuthUrl } from '@/lib/auth/googleAuth';

/**
 * Redirects the user to the Google OAuth consent screen
 */
export async function GET() {
  try {
    // Generate the authorization URL
    const authUrl = getAuthUrl();
    
    // Redirect the user to the Google OAuth consent screen
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Error generating auth URL:', error);
    return NextResponse.json({ error: 'Failed to generate authentication URL' }, { status: 500 });
  }
}
