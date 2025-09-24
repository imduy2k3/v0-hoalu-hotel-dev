import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if accessing admin routes
  if (pathname.startsWith('/admin')) {
    // Check if accessing user management (admin only)
    if (pathname.startsWith('/admin/users')) {
      // In a real app, you would check the user's role from the token/session
      // For now, we'll let the page component handle the permission check
      return NextResponse.next()
    }
    
    return NextResponse.next()
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}
