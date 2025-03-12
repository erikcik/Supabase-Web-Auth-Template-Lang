'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import OTPInput from '@/components/OTPInput';
import Link from 'next/link';

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0 && !canResend) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, canResend]);

  const handleVerify = async (otp: string) => {
    if (!email) {
      toast.error('Email is required');
      return;
    }

    setIsVerifying(true);
    
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email'
      });
      
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Email verified successfully');
        router.push('/');
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('An error occurred during verification');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email) {
      toast.error('Email is required');
      return;
    }

    setIsResending(true);
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Verification code resent');
        setCountdown(60);
        setCanResend(false);
      }
    } catch (error) {
      console.error('Resend error:', error);
      toast.error('An error occurred while resending the code');
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6 text-center">
          <h2 className="text-3xl font-bold">Invalid Verification Link</h2>
          <p className="text-muted-foreground">
            This verification link is invalid or has expired.
          </p>
          <Button asChild>
            <Link href="/auth/signin">Return to Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Verify Your Email</h2>
          <p className="mt-2 text-muted-foreground">
            We've sent a verification code to {email}. Please enter the code below.
          </p>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow-sm">
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="block text-center text-sm font-medium mb-4">
                Enter the 6-digit code
              </label>
              <OTPInput length={6} onComplete={handleVerify} />
            </div>
            
            <div className="text-center">
              {canResend ? (
                <Button 
                  variant="outline" 
                  onClick={handleResendOTP} 
                  disabled={isResending}
                >
                  {isResending ? 'Resending...' : 'Resend Code'}
                </Button>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Resend code in {countdown} seconds
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <Link 
            href="/auth/signin" 
            className="text-sm font-medium text-primary hover:underline"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
} 