import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const user = request.cookies.get('user')?.value;
  
  if (!user && !request.nextUrl.pathname.startsWith('/auth')) {
    
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (user) {
    const userData = JSON.parse(user);
    
    if (request.nextUrl.pathname.startsWith('/doctor') && userData.role !== 'doctor') {
      return NextResponse.redirect(new URL('/patient/dashboard', request.url));
    }
    
    if (request.nextUrl.pathname.startsWith('/patient') && userData.role !== 'patient') {
      return NextResponse.redirect(new URL('/doctor/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/doctor/:path*', '/patient/:path*', '/auth/:path*'],
};