import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Alert } from '@/components/common/Alert';
import { resetPasswordSchema } from '@/lib/form-validation/validationSchemas';
import type { ResetPasswordFormData } from '@/lib/form-validation/validationSchemas';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/routing/routes';
import { useNavigate, Link } from 'react-router-dom';
import './ResetPassword.css';
import { 
  Key, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  XCircle,
  Shield,
  ArrowLeft,
  RefreshCw
} from 'lucide-react';

export const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { resetPassword, isLoading, error, clearError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const newPassword = watch('newPassword', '');
  const confirmPassword = watch('confirmPassword', '');

  const passwordRequirements = [
    { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
    { label: 'Uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
    { label: 'Lowercase letter', test: (p: string) => /[a-z]/.test(p) },
    { label: 'Number', test: (p: string) => /\d/.test(p) },
    { label: 'Special character', test: (p: string) => /[!@#$%^&*]/.test(p) },
  ];

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      await resetPassword({
        otpCode: data.otpCode,
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmPassword
      });
      setIsSuccess(true);
      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 3000);
    } catch (error) {
      // Error handled by hook
    }
  };

  if (isSuccess) {
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
            <Card.Body className="p-8 text-center">
              {/* Success Animation */}
              <div className="relative mb-6">
                <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 border-4 border-green-200 rounded-full animate-ping opacity-75"></div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Password Reset Successfully!
              </h2>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Your password has been updated. You'll be redirected to the login page.
              </p>

              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                <div className="bg-green-500 h-2 rounded-full animate-progress"></div>
              </div>

              <Link
                to={ROUTES.LOGIN}
                className="inline-block text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 transition-colors"
              >
                Click here if you're not redirected
              </Link>
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
        
        {/* Animated Locks */}
        <div className="absolute top-20 left-20 opacity-10">
          <Lock className="w-32 h-32 text-white animate-float" />
        </div>
        <div className="absolute bottom-20 right-20 opacity-10">
          <Key className="w-32 h-32 text-white animate-float animation-delay-2000" />
        </div>
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
                <RefreshCw className="w-8 h-8 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Set New Password</h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Enter the verification code and your new password
              </p>
            </div>

            {error && (
              <Alert
                variant="error"
                message={error}
                onClose={clearError}
                className="mb-6 animate-slideDown"
              />
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* OTP Code */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Verification Code
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    {...register('otpCode')}
                    className={`w-full pl-10 pr-4 py-3 border ${
                      errors.otpCode ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                  />
                </div>
                {errors.otpCode && (
                  <p className="text-sm text-red-600 mt-1 animate-shake">{errors.otpCode.message}</p>
                )}
              </div>

              {/* New Password */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    {...register('newPassword')}
                    className={`w-full pl-10 pr-12 py-3 border ${
                      errors.newPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-2">
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password requirements:
                </p>
                {passwordRequirements.map((req, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    {req.test(newPassword) ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-gray-300" />
                    )}
                    <span className={`text-xs ${req.test(newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...register('confirmPassword')}
                    className={`w-full pl-10 pr-12 py-3 border ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600 mt-1 animate-shake">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Password Match Indicator */}
              {newPassword && confirmPassword && newPassword !== confirmPassword && (
                <p className="text-sm text-red-600 animate-shake flex items-center">
                  <XCircle className="w-4 h-4 mr-1" />
                  Passwords do not match
                </p>
              )}

              {newPassword && confirmPassword && newPassword === confirmPassword && (
                <p className="text-sm text-green-600 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Passwords match
                </p>
              )}

              {/* Security Note */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 flex items-start space-x-3">
                <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  For your security, make sure your new password is strong and unique. We'll never ask for your password via email or phone.
                </p>
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={isLoading}
                disabled={!newPassword || !confirmPassword || newPassword !== confirmPassword}
                className="bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Resetting Password...' : 'Reset Password'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to={ROUTES.FORGOT_PASSWORD}
                className="text-sm font-medium text-accent-600 hover:text-accent-700 dark:text-accent-400 transition-colors"
              >
                Request a new verification code
              </Link>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;