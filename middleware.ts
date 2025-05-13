
// We're removing the middleware-based auth check
// Each protected page will handle its own auth check
// This simplifies the authentication flow

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(_req: NextRequest) {
  // Just pass through all requests
  return NextResponse.next()
}

// Keep an empty matcher to avoid errors
export const config = {
  matcher: [],
}


