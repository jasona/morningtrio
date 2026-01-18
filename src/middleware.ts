import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // For login/register: only redirect if actually logged in
  if (pathname === '/login' || pathname === '/register') {
    if (req.auth) {
      return NextResponse.redirect(new URL('/app', req.url));
    }
    return NextResponse.next();
  }

  // Protected routes (everything under /app)
  if (pathname.startsWith('/app')) {
    if (!req.auth) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Only run middleware on routes that need auth checks:
     * - /app/* (protected routes)
     * - /login, /register (to redirect logged-in users)
     */
    '/app/:path*',
    '/login',
    '/register',
  ],
};
