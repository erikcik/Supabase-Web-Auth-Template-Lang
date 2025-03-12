import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from "./i18n/routing";

// Create the next-intl middleware
const intlMiddleware = createMiddleware({
  locales: routing.locales,
  defaultLocale: routing.defaultLocale,
  localeDetection: true,
  localePrefix: 'always'
});

export async function middleware(request: NextRequest) {
  // Handle root path redirect using next-intl
  if (request.nextUrl.pathname === '/') {
    return intlMiddleware(request);
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Initialize Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set({
              name,
              value,
              ...options,
            });
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set({
              name,
              value,
              ...options,
            });
          });
        },
      },
    }
  );

  // Get user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // List of paths that don't require authentication
  const publicPaths = [
    '/',
    '/auth/signin',
    '/auth/signup',
    '/auth/verify',
    '/auth/set-username',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/callback',
    '/auth/auth-error',
  ];
  
  const pathname = request.nextUrl.pathname;
  
  // Extract locale from URL or use default
  const locale = pathname.match(/^\/(tr|en)/)?.[1] || routing.defaultLocale;
  
  // Check if this is the home page (with locale prefix)
  const isHomePage = pathname === `/${locale}` || pathname === `/${locale}/`;
  
  // Even more permissive check that includes any path starting with /auth/
  const isAuthPath = pathname.startsWith(`/${locale}/auth/`);
  
  // Check if the current path is in the public paths list (considering locale prefixes)
  const isPublicPath = publicPaths.some(path => {
    const pathWithoutLocale = pathname.replace(/^\/(tr|en)/, '');
    return pathWithoutLocale === path || pathWithoutLocale.startsWith(path + '/');
  });

  // If user is not signed in and the path is not public/auth/home, redirect to signin
  if (!user && !isPublicPath && !isAuthPath && !isHomePage) {
    return NextResponse.redirect(new URL(`/${locale}/auth/signin`, request.url));
  }

  // If user is signed in and tries to access sign-in or sign-up pages, redirect to home
  if (
    user && 
    (pathname.endsWith('/auth/signin') ||
     pathname.endsWith('/auth/signup'))
  ) {
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  // Process the request through next-intl middleware
  const intlResponse = await intlMiddleware(request);

  // Copy over the Supabase auth cookies to the next-intl response
  const supabaseCookies = response.cookies.getAll();
  supabaseCookies.forEach(cookie => {
    intlResponse.cookies.set(cookie);
  });

  return intlResponse;
}

export const config = {
  matcher: [
    // Match all pathnames except static files
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}; 