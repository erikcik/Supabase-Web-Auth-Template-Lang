'use client';

import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';

interface OTPInputProps {
  length?: number;
  onComplete?: (otp: string) => void;
}

export default function OTPInput({ length = 6, onComplete }: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (
    element: HTMLInputElement,
    index: number
  ) => {
    if (isNaN(Number(element.value))) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Move to next input if current field is filled
    if (element.value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if OTP is complete
    const otpValue = newOtp.join('');
    if (otpValue.length === length && onComplete) {
      onComplete(otpValue);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // Move to previous input on backspace if current field is empty
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData('text')
      .slice(0, length)
      .split('');

    if (pastedData) {
      const newOtp = [...otp];
      pastedData.forEach((value, index) => {
        if (index < length && !isNaN(Number(value))) {
          newOtp[index] = value;
          inputRefs.current[index]?.setAttribute('value', value);
        }
      });
      setOtp(newOtp);

      // Move focus to the next empty input or the last input
      const focusIndex = Math.min(pastedData.length, length - 1);
      inputRefs.current[focusIndex]?.focus();

      // Check if OTP is complete
      const otpValue = newOtp.join('');
      if (otpValue.length === length && onComplete) {
        onComplete(otpValue);
      }
    }
  };

  return (
    <div className="flex gap-2 items-center justify-center">
      {otp.map((_, index) => (
        <Input
          key={index}
          type="text"
          maxLength={1}
          value={otp[index]}
          ref={(input) => (inputRefs.current[index] = input)}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className="w-12 h-12 text-center text-lg"
          inputMode="numeric"
          autoComplete="one-time-code"
        />
      ))}
    </div>
  );
} 