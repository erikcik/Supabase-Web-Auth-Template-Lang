import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/';
  // Extract provider information if available
  const provider = requestUrl.searchParams.get('provider') || '';
  // Check if there was an error
  const error = requestUrl.searchParams.get('error');
  const error_description = requestUrl.searchParams.get('error_description');

  console.log('Auth callback received:', { 
    code: !!code, 
    next, 
    provider,
    error,
    error_description 
  });

  // If there was an OAuth error, redirect to sign-in
  if (error) {
    console.error('OAuth error:', error, error_description);
    return NextResponse.redirect(new URL('/auth/signin', requestUrl.origin));
  }

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            try {
              cookieStore.set({ name, value, ...options });
            } catch (error) {
              console.error('Error setting cookie:', error);
            }
          },
          remove(name: string, options: any) {
            try {
              cookieStore.delete({ name, ...options });
            } catch (error) {
              console.error('Error removing cookie:', error);
            }
          },
        },
      }
    );

    console.log('Exchanging code for session');
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Error exchanging code for session:', error);
      return NextResponse.redirect(new URL('/auth/auth-error', requestUrl.origin));
    }

    // Session exchange successful, now check if user has a username
    console.log('Session established, checking user data');
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.error('No user found after authentication');
      return NextResponse.redirect(new URL('/auth/auth-error', requestUrl.origin));
    }

    console.log('User authenticated:', user.id);

    // Check if user was created via OAuth
    const authProvider = user.app_metadata?.provider || 'unknown';
    const isOAuthProvider = ['github', 'google'].includes(authProvider);
    
    console.log('Auth provider:', authProvider);
    
    if (isOAuthProvider) {
      console.log('OAuth provider detected, checking for username');
      
      // Check if username exists in user metadata
      const hasUsernameInMetadata = !!user.user_metadata?.username;
      console.log('Username in metadata:', hasUsernameInMetadata ? user.user_metadata.username : 'none');
      
      // Always look up the profile for OAuth users as a double-check
      try {
        // Check profiles table
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single();

        console.log('Profile lookup result:', { 
          hasProfile: !!profile,
          username: profile?.username || null, 
          error: profileError?.message 
        });

        // If there's no username in the profile, redirect to set-username
        if (!profile?.username) {
          console.log('No username found in profile, redirecting to set-username page');
          return NextResponse.redirect(
            new URL(`/auth/set-username?provider=${authProvider}`, requestUrl.origin)
          );
        }
        
        console.log('Username found in profile:', profile.username);
      } catch (error) {
        console.error('Unexpected error checking profile:', error);
        // On error, redirect to set username as a fallback
        return NextResponse.redirect(
          new URL(`/auth/set-username?provider=${authProvider}`, requestUrl.origin)
        );
      }
    }

    // Default redirect to the next page
    console.log('Authentication complete, redirecting to:', next);
    return NextResponse.redirect(new URL(next, requestUrl.origin));
  }

  // No code provided, return error
  console.error('No code provided to callback route');
  return NextResponse.redirect(new URL('/auth/auth-error', requestUrl.origin));
} 