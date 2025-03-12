'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AuthError() {
  console.log('Auth error page loaded');
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
          Authentication Error
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          There was a problem with your authentication request.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <p className="text-center">
              This could be due to an expired link, invalid token, or a misconfiguration.
            </p>
            <div className="flex space-x-4 justify-center">
              <Button asChild>
                <Link href="/auth/signin">
                  Sign In
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/auth/signup">
                  Sign Up
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 