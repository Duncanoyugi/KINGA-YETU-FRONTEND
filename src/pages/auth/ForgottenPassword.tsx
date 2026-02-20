import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Card } from '@/components/common/Card';
import { Alert } from '@/components/common/Alert';
import { forgotPasswordSchema } from '@/lib/form-validation/validationSchemas';
import type { ForgotPasswordFormData } from '@/lib/form-validation/validationSchemas';
import { usePasswordManagement } from '@/features/auth/authHooks';
import { ROUTES } from '@/routing/routes';
import { Mail, ArrowLeft, CheckCircle, Shield, Send, Loader2 } from 'lucide-react';

export const ForgottenPassword: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const { forgotPassword } = usePasswordManagement();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);
      await forgotPassword(data.email);
      setSubmittedEmail(data.email);
      setIsSubmitted(true);
    } catch (error) {
      // Error handled by hook
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-accent-900 py-12 px-4 sm:px-6 lg:px-8">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-primary-800/90 to-accent-900/90"></div>
        </div>

        <div className="relative z-10 w-full max-w-md mx-auto">
          <Card className="w-full backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 shadow-2xl border-0 rounded-2xl overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-green-400 to-accent-400"></div>
            <Card.Body className="p-8">
              <div className="text-center">
                {/* Success Animation */}
                <div className="relative mb-6">
                  <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 border-4 border-green-200 rounded-full animate-ping opacity-75"></div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Check Your Email
                </h2>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  We've sent a password reset link to:
                </p>
                
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-6">
                  <p className="font-medium text-primary-600 dark:text-primary-400">
                    {submittedEmail}
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6 text-left">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-700 dark:text-blue-300">
                      <p className="font-medium mb-1">Next steps:</p>
                      <ol className="list-decimal list-inside space-y-1 text-xs">
                        <li>Open the email from KingaYetu</li>
                        <li>Click the reset password link</li>
                        <li>Enter your new password</li>
                        <li>Sign in with your new credentials</li>
                      </ol>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Didn't receive the email? Check your spam folder or try again.
                </p>

                <div className="space-y-3">
                  <Link
                    to={ROUTES.LOGIN}
                    className="block w-full px-4 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors text-center"
                  >
                    Return to Login
                  </Link>
                  
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="block w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Try a different email
                  </button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-accent-900 py-12 px-4 sm:px-6 lg:px-8">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-primary-800/90 to-accent-900/90"></div>
        
        {/* Animated Circles */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-accent-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto">
        {/* Back Button */}
        <Link
          to={ROUTES.LOGIN}
          className="absolute -top-12 left-0 text-white/80 hover:text-white transition-colors flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Login</span>
        </Link>

        <Card className="w-full backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 shadow-2xl border-0 rounded-2xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-accent-400 via-primary-500 to-accent-400"></div>
          
          <Card.Body className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-accent-100 to-primary-100 mb-4">
                <Send className="w-8 h-8 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reset Password</h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Enter your email address and we'll send you a link to reset your password
              </p>
            </div>

            <Alert
              variant="info"
              message="You will receive an email with instructions if the email is registered in our system."
              className="mb-6"
            />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                {...register('email')}
                error={errors.email?.message}
                leftIcon={<Mail className="w-5 h-5" />}
                placeholder="Enter your email"
                disabled={isLoading}
                className="py-3 rounded-xl dark:bg-gray-800 dark:text-white"
              />

              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={isLoading}
                className="bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 py-3"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Sending...
                  </span>
                ) : (
                  'Send Reset Link'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to={ROUTES.LOGIN}
                className="text-sm font-medium text-accent-600 hover:text-accent-700 dark:text-accent-400 transition-colors"
              >
                ← Return to Login
              </Link>
            </div>
          </Card.Body>
        </Card>

        {/* Help Text */}
        <p className="mt-4 text-xs text-center text-primary-200">
          Having trouble? Contact support at support@kingayetu.co.ke
        </p>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.6s ease-in-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default ForgottenPassword;