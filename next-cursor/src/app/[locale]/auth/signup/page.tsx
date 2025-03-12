'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Github, Mail } from 'lucide-react';
import Link from 'next/link';

export default function SignUp() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const supabase = createClientComponentClient();

  const validatePassword = (password: string) => {
    const errors = [];
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    return errors;
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      passwordErrors.forEach(error => toast.error(error));
      setIsLoading(false);
      return;
    }

    try {
      // First, check if the username is already taken in the profiles table
      const { data: existingUsername, error: usernameError } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .maybeSingle();

      if (existingUsername) {
        toast.error('This username is already taken. Please choose another one.');
        setIsLoading(false);
        return;
      }

      // Proceed with the sign-up if username is available
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        // Handle specific error cases
        if (error.message.includes('already registered') || 
            error.message.includes('already in use') ||
            error.message.includes('already exists')) {
          toast.error('This email is already registered. Please sign in instead.');
        } else if (error.message.includes('constraint') || 
                  error.message.includes('duplicate') || 
                  error.message.toLowerCase().includes('unique')) {
          toast.error('This username is already taken. Please choose another one.');
        } else {
          // Log the error for debugging but show a user-friendly message
          console.error('Signup error:', error);
          toast.error('There was a problem creating your account. Please try again.');
        }
        setIsLoading(false);
        return;
      }

      // If this is a duplicate email that requires confirmation,
      // Supabase might return a user object but with no session
      if (data.user && !data.session) {
        // Check if we have a specific email confirmation status
        if (data.user.identities && data.user.identities.length === 0) {
          toast.error('This email is already registered. Please sign in instead.');
          setIsLoading(false);
          return;
        }
        
        // Otherwise proceed to verification page
        toast.success('Verification email sent. Please check your inbox.');
        router.push(`/auth/verify?email=${encodeURIComponent(email)}`);
      } else if (!data.user) {
        toast.error('Failed to create account. Please try again.');
      } else {
        toast.success('Account created successfully!');
        router.push('/');
      }
    } catch (error) {
      // Log the error for debugging
      console.error('Unexpected signup error:', error);
      toast.error('An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignUp = async (provider: 'github' | 'google') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?provider=${provider}`,
        },
      });

      if (error) {
        console.error(`OAuth sign-up error with ${provider}:`, error);
        toast.error(error.message);
      }
    } catch (error) {
      console.error(`Unexpected OAuth sign-up error with ${provider}:`, error);
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleEmailSignUp} className="space-y-6">
            <div>
              <Label htmlFor="username">Username</Label>
              <div className="mt-2">
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email address</Label>
              <div className="mt-2">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="mt-2">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Must be at least 8 characters with uppercase, lowercase, number, and special character
              </p>
            </div>

            <div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating account...' : 'Sign up'}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => handleOAuthSignUp('github')}
              >
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
              <Button
                variant="outline"
                onClick={() => handleOAuthSignUp('google')}
              >
                <Mail className="mr-2 h-4 w-4" />
                Google
              </Button>
            </div>
          </div>
          
          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <Link href="/auth/signin" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 