'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function SetUsername() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const provider = searchParams.get('provider') || 'oauth';
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [user, setUser] = useState<any>(null);
  const supabase = createClientComponentClient();

  // Fetch the current user
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          toast.error('Authentication error. Please try logging in again.');
          router.push('/auth/signin');
          return;
        }
        
        if (!user) {
          toast.error('You must be logged in to set a username.');
          router.push('/auth/signin');
          return;
        }


        setUser(user);
      } catch (error) {
        toast.error('An unexpected error occurred. Please try again.');
      }
    };

    checkUser();
  }, [supabase, router, provider]);

  const validateUsername = (value: string) => {
    // Reset error
    setUsernameError('');
    
    if (!value.trim()) {
      setUsernameError('Username cannot be empty');
      return false;
    }
    
    // Username should be 3-20 characters, alphanumeric and underscores only
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(value)) {
      setUsernameError('Username must be 3-20 characters and contain only letters, numbers, and underscores');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateUsername(username)) {
      toast.error(usernameError);
      return;
    }

    setIsLoading(true);

    try {
      // Check if username already exists
      const { data: existingUsername, error: usernameError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .maybeSingle();

      if (usernameError) {
        toast.error('Error checking username availability. Please try again.');
        setIsLoading(false);
        return;
      }

      if (existingUsername) {
        toast.error('This username is already taken. Please choose another one.');
        setUsernameError('This username is already taken. Please choose another one.');
        setIsLoading(false);
        return;
      }

      // Update the profile with the new username
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          username,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) {
        
        if (updateError.message.includes('duplicate key') || updateError.message.includes('unique constraint')) {
          toast.error('This username is already taken. Please choose another one.');
          setUsernameError('This username is already taken. Please choose another one.');
        } else {
          toast.error('Error setting username. Please try again.');
        }
        
        setIsLoading(false);
        return;
      }

      // Update user metadata
      const { error: metadataError } = await supabase.auth.updateUser({
        data: { username }
      });

      if (metadataError) {
        // We'll continue since the profile was updated successfully
      }

      toast.success('Username set successfully!');
      router.push('/');
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
          Set Your Username
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Thanks for signing up with {provider}! Please choose a username for your account.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="username">Username</Label>
              <div className="mt-2">
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                  autoFocus
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    validateUsername(e.target.value);
                  }}
                  placeholder="Choose a unique username"
                  className={usernameError ? "border-red-500" : ""}
                />
                {usernameError && (
                  <p className="mt-1 text-sm text-red-500">
                    {usernameError}
                  </p>
                )}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Username must be 3-20 characters and contain only letters, numbers, and underscores.
              </p>
            </div>

            <div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || !!usernameError}
              >
                {isLoading ? 'Setting Username...' : 'Continue'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 