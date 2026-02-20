import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Alert } from '@/components/common/Alert';
import { loginSchema } from '@/lib/form-validation/validationSchemas';
import type { LoginFormData } from '@/lib/form-validation/validationSchemas';
import { ROUTES } from '@/routing/routes';
import { Mail, Lock, LogIn, Eye, EyeOff, Shield, ChevronRight } from 'lucide-react';
import './Login.css';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, clearError, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || ROUTES.DASHBOARD;
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
    } catch (error) {}
  };

  const fillDemoCredentials = (role: 'parent' | 'worker') => {
    if (role === 'parent') {
      setValue('email', 'parent@example.com');
      setValue('password', 'password123');
    } else {
      setValue('email', 'worker@example.com');
      setValue('password', 'password123');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-accent-900">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-primary-800/90 to-accent-900/90"></div>
        
        {/* Animated Circles */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-accent-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-primary-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-secondary-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md mx-auto px-4 sm:px-6">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
              Kinga<span className="text-accent-400">Yetu</span>
            </h1>
          </Link>
          <p className="text-primary-200 text-sm">
            Welcome back! Sign in to continue your journey
          </p>
        </div>

        <Card className="w-full backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 shadow-2xl border-0 rounded-2xl overflow-hidden">
          {/* Decorative Header */}
          <div className="h-2 bg-gradient-to-r from-accent-400 via-primary-500 to-accent-400"></div>
          
          <Card.Body className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary-100 to-accent-100 mb-4">
                <LogIn className="w-8 h-8 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sign In</h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Access your immunization dashboard
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

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    {...register('email')}
                    className={`w-full pl-10 pr-4 py-3 border ${
                      errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                    placeholder="Enter your email"
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1 animate-shake">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    className={`w-full pl-10 pr-12 py-3 border ${
                      errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 mt-1 animate-shake">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('rememberMe')}
                    className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500 transition-colors"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
                </label>

                <Link
                  to={ROUTES.FORGOT_PASSWORD}
                  className="text-sm font-medium text-accent-600 hover:text-accent-700 dark:text-accent-400 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={isLoading}
                className="bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 py-3"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Demo Accounts Toggle */}
            <div className="mt-6">
              <button
                onClick={() => setShowDemo(!showDemo)}
                className="w-full flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors"
              >
                <Shield className="w-4 h-4" />
                <span>Try demo accounts</span>
                <ChevronRight className={`w-4 h-4 transition-transform ${showDemo ? 'rotate-90' : ''}`} />
              </button>

              {showDemo && (
                <div className="mt-4 grid grid-cols-2 gap-3 animate-slideDown">
                  <button
                    type="button"
                    onClick={() => fillDemoCredentials('parent')}
                    className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors group"
                  >
                    <p className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600">Parent</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">parent@example.com</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">••••••••</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoCredentials('worker')}
                    className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors group"
                  >
                    <p className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600">Health Worker</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">worker@example.com</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">••••••••</p>
                  </button>
                </div>
              )}
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <Link
                  to={ROUTES.REGISTER}
                  className="font-medium text-accent-600 hover:text-accent-700 dark:text-accent-400 transition-colors"
                >
                  Create one now
                </Link>
              </p>
            </div>
          </Card.Body>
        </Card>

        {/* Footer Links */}
        <div className="mt-6 text-center text-sm text-primary-200">
          <Link to="/privacy" className="hover:text-white transition-colors mx-2">Privacy Policy</Link>
          <span className="mx-2">•</span>
          <Link to="/terms" className="hover:text-white transition-colors mx-2">Terms of Service</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;