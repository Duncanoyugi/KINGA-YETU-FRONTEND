import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Alert } from '@/components/common/Alert';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/routing/routes';
import { 
  Smartphone, 
  Shield, 
  Clock, 
  RotateCcw,
  CheckCircle,
  ArrowLeft 
} from 'lucide-react';

export const OTPVerification: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOTP, requestOTP, isLoading } = useAuth();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const email = location.state?.email || '';
  const phone = location.state?.phone || '';

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    let interval: number;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pasted = value.slice(0, 6).split('');
      const newOtp = [...otp];
      pasted.forEach((char, i) => {
        if (i < 6) newOtp[i] = char;
      });
      setOtp(newOtp);
      
      // Focus last filled input or next empty
      const lastFilledIndex = Math.min(pasted.length - 1, 5);
      inputRefs.current[lastFilledIndex]?.focus();
    } else {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to next input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }

      // Auto-submit when all digits are filled
      if (value && index === 5) {
        const code = [...newOtp.slice(0, 5), value].join('');
        handleSubmit(code);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Move to previous input on backspace
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      inputRefs.current[5]?.focus();
      handleSubmit(pastedData);
    }
  };

  const handleSubmit = async (code?: string) => {
    const verificationCode = code || otp.join('');
    if (verificationCode.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    try {
      setSuccess(true);
      await verifyOTP({ 
        code: verificationCode, 
        email, 
        phone, 
        type: 'EMAIL_VERIFICATION' 
      });
      
      // Show success message before redirect
      setTimeout(() => {
        navigate(ROUTES.DASHBOARD);
      }, 1500);
    } catch (error: any) {
      setSuccess(false);
      setError(error.message || 'Invalid verification code');
      // Clear OTP fields on error
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = async () => {
    try {
      await requestOTP({ email, phone, type: 'EMAIL_VERIFICATION' });
      setTimer(60);
      setCanResend(false);
      setError('');
      // Clear fields
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      
      // Show success message
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error: any) {
      setError(error.message || 'Failed to resend code');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-accent-900 py-12 px-4 sm:px-6 lg:px-8">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-primary-800/90 to-accent-900/90"></div>
        
        {/* Animated Dots */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-accent-400 rounded-full animate-ping"></div>
          <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-primary-400 rounded-full animate-ping animation-delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-2 h-2 bg-secondary-400 rounded-full animate-ping animation-delay-2000"></div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute -top-12 left-0 text-white/80 hover:text-white transition-colors flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>

        <Card className="w-full backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 shadow-2xl border-0 rounded-2xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-accent-400 via-primary-500 to-accent-400"></div>
          
          <Card.Body className="p-8">
            <div className="text-center mb-8">
              <div className="relative">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-accent-100 to-primary-100 mb-4 transition-all duration-500 ${
                  success ? 'scale-110' : ''
                }`}>
                  {success ? (
                    <CheckCircle className="w-10 h-10 text-green-600 animate-bounce" />
                  ) : (
                    <Smartphone className="w-10 h-10 text-primary-600" />
                  )}
                </div>
                {!success && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 border-4 border-primary-200 rounded-full animate-ping opacity-75"></div>
                  </div>
                )}
              </div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {success ? 'Verification Successful!' : 'Verify Your Email'}
              </h2>
              
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {success 
                  ? 'Redirecting to dashboard...'
                  : `We've sent a verification code to`}
              </p>
              
              {!success && (
                <p className="mt-1 font-medium text-primary-600 dark:text-primary-400">
                  {email || phone}
                </p>
              )}
            </div>

            {error && (
              <Alert
                variant="error"
                message={error}
                onClose={() => setError('')}
                className="mb-6 animate-slideDown"
              />
            )}

            {!success && (
              <>
                <div className="flex justify-center space-x-3 mb-8" onPaste={handlePaste}>
                  {otp.map((digit, index) => (
                    <div key={index} className="relative">
                      <input
                        ref={(el) => { inputRefs.current[index] = el; }}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        inputMode="numeric"
                        pattern="\d*"
                        disabled={isLoading}
                      />
                      {index === otp.findIndex((val, i) => !val && i === index) && (
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-400 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => handleSubmit()}
                  variant="primary"
                  fullWidth
                  loading={isLoading}
                  disabled={otp.some(digit => !digit)}
                  className="bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Verifying...' : 'Verify Email'}
                </Button>

                <div className="mt-6 text-center">
                  <div className="flex items-center justify-center space-x-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Code expires in {formatTime(timer)}
                    </span>
                  </div>
                  
                  <div className="mt-4">
                    {canResend ? (
                      <button
                        onClick={handleResend}
                        className="inline-flex items-center space-x-2 text-sm font-medium text-accent-600 hover:text-accent-700 dark:text-accent-400 transition-colors group"
                      >
                        <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                        <span>Resend verification code</span>
                      </button>
                    ) : (
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        Didn't receive the code? Wait {formatTime(timer)} to resend
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}

            {success && (
              <div className="text-center animate-fadeIn">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Your email has been verified successfully
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                  <div className="bg-green-500 h-2 rounded-full animate-progress"></div>
                </div>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Security Notice */}
        <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-primary-200">
          <Shield className="w-3 h-3" />
          <span>Your verification is protected by end-to-end encryption</span>
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 1.5s linear;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default OTPVerification;