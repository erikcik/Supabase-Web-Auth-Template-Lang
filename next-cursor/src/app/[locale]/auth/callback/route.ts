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


  // If there was an OAuth error, redirect to sign-in
  if (error) {
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

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      return NextResponse.redirect(new URL('/auth/auth-error', requestUrl.origin));
    }

    // Session exchange successful, now check if user has a username
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL('/auth/auth-error', requestUrl.origin));
    }


    // Check if user was created via OAuth
    const authProvider = user.app_metadata?.provider || 'unknown';
    const isOAuthProvider = ['github', 'google'].includes(authProvider);
    
    
    if (isOAuthProvider) {
      
      // Check if username exists in user metadata
      const hasUsernameInMetadata = !!user.user_metadata?.username;
      
      // Always look up the profile for OAuth users as a double-check
      try {
        // Check profiles table
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single();


        // If there's no username in the profile, redirect to set-username
        if (!profile?.username) {
          return NextResponse.redirect(
            new URL(`/auth/set-username?provider=${authProvider}`, requestUrl.origin)
          );
        }
        
      } catch (error) {
        // On error, redirect to set username as a fallback
        return NextResponse.redirect(
          new URL(`/auth/set-username?provider=${authProvider}`, requestUrl.origin)
        );
      }
    }

    // Default redirect to the next page
    return NextResponse.redirect(new URL(next, requestUrl.origin));
  }

  // No code provided, return error
  return NextResponse.redirect(new URL('/auth/auth-error', requestUrl.origin));
} 