import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Alert } from '@/components/common/Alert';
import { registerSchema } from '@/lib/form-validation/validationSchemas';
import type { RegisterFormData } from '@/lib/form-validation/validationSchemas';
import { ROUTES } from '@/routing/routes';
import './Register.css';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  XCircle,
  ChevronRight,
  UserCircle,
  Stethoscope,
  Shield,
  ArrowLeft
} from 'lucide-react';

type UserRole = 'PARENT' | 'HEALTH_WORKER';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser, isLoading, error, clearError } = useAuth();
  const [role, setRole] = useState<UserRole>('PARENT');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'PARENT',
      termsAccepted: false,
    },
  });

  const password = watch('password', '');
  const confirmPassword = watch('confirmPassword', '');

  const passwordRequirements = [
    { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
    { label: 'Uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
    { label: 'Lowercase letter', test: (p: string) => /[a-z]/.test(p) },
    { label: 'Number', test: (p: string) => /\d/.test(p) },
    { label: 'Special character', test: (p: string) => /[!@#$%^&*]/.test(p) },
  ];

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data);
      navigate(ROUTES.VERIFY_EMAIL, { state: { email: data.email } });
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && (!watch('fullName') || !watch('email'))) {
      return;
    }
    setCurrentStep(2);
  };

  const prevStep = () => {
    setCurrentStep(1);
  };

  useEffect(() => {
    setValue('role', role);
  }, [role, setValue]);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-accent-900 py-8 px-4 sm:px-6 lg:px-8">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-primary-800/90 to-accent-900/90"></div>
        
        {/* Animated Elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-accent-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-2000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute -top-12 left-0 text-white/80 hover:text-white transition-colors flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    currentStep >= step
                      ? 'bg-accent-400 text-primary-900'
                      : 'bg-white/20 text-white'
                  }`}
                >
                  {step}
                </div>
                {step === 1 && (
                  <div
                    className={`w-16 h-1 mx-2 transition-all duration-300 ${
                      currentStep > 1 ? 'bg-accent-400' : 'bg-white/20'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-white/80">Account Details</span>
            <span className="text-xs text-white/80">Verification</span>
          </div>
        </div>

        <Card className="w-full backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 shadow-2xl border-0 rounded-2xl overflow-hidden">
          {/* Decorative Header */}
          <div className="h-2 bg-gradient-to-r from-accent-400 via-primary-500 to-accent-400"></div>
          
          <Card.Body className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentStep === 1 ? 'Create Account' : 'Almost There!'}
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {currentStep === 1 
                  ? 'Join KingaYetu to protect your child\'s health'
                  : 'Complete your registration'}
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

            {currentStep === 1 ? (
              <div className="space-y-6 animate-fadeIn">
                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    I am registering as
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setRole('PARENT')}
                      className={`
                        relative p-4 border-2 rounded-xl text-center transition-all duration-200 group overflow-hidden
                        ${role === 'PARENT'
                          ? 'border-accent-400 bg-accent-50 dark:bg-accent-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'}
                      `}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r from-accent-400/10 to-primary-400/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left ${role === 'PARENT' ? 'scale-x-100' : ''}`}></div>
                      <UserCircle className={`w-8 h-8 mx-auto mb-2 ${role === 'PARENT' ? 'text-accent-500' : 'text-gray-400'}`} />
                      <span className={`block font-medium ${role === 'PARENT' ? 'text-accent-600' : 'text-gray-700 dark:text-gray-300'}`}>Parent</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Track your child's vaccines</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setRole('HEALTH_WORKER')}
                      className={`
                        relative p-4 border-2 rounded-xl text-center transition-all duration-200 group overflow-hidden
                        ${role === 'HEALTH_WORKER'
                          ? 'border-accent-400 bg-accent-50 dark:bg-accent-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'}
                      `}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r from-accent-400/10 to-primary-400/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left ${role === 'HEALTH_WORKER' ? 'scale-x-100' : ''}`}></div>
                      <Stethoscope className={`w-8 h-8 mx-auto mb-2 ${role === 'HEALTH_WORKER' ? 'text-accent-500' : 'text-gray-400'}`} />
                      <span className={`block font-medium ${role === 'HEALTH_WORKER' ? 'text-accent-600' : 'text-gray-700 dark:text-gray-300'}`}>Health Worker</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Manage vaccinations</span>
                    </button>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        {...register('fullName')}
                        className={`w-full pl-10 pr-4 py-3 border ${
                          errors.fullName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        } rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                        placeholder="Enter your full name"
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-sm text-red-600 mt-1 animate-shake">{errors.fullName.message}</p>
                    )}
                  </div>

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
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-600 mt-1 animate-shake">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Phone Number (Optional)
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        {...register('phoneNumber')}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="+254 XXX XXX XXX"
                      />
                    </div>
                    {errors.phoneNumber && (
                      <p className="text-sm text-red-600 mt-1 animate-shake">{errors.phoneNumber.message}</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-fadeIn">
                {/* Password Fields */}
                <div className="space-y-4">
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
                        placeholder="Create a password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Password Requirements */}
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-2">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Password requirements:</p>
                    {passwordRequirements.map((req, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        {req.test(password) ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-gray-300" />
                        )}
                        <span className={`text-xs ${req.test(password) ? 'text-green-600' : 'text-gray-500'}`}>
                          {req.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        {...register('confirmPassword')}
                        className={`w-full pl-10 pr-12 py-3 border ${
                          errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        } rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                        placeholder="Confirm your password"
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

                  {password && confirmPassword && password !== confirmPassword && (
                    <p className="text-sm text-red-600 animate-shake">Passwords do not match</p>
                  )}
                </div>

                {/* Terms Acceptance */}
                <div className="space-y-3">
                  <label className="flex items-start space-x-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      {...register('termsAccepted')}
                      className="mt-1 w-4 h-4 text-accent-600 rounded border-gray-300 focus:ring-accent-500 transition-colors"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                      I agree to the{' '}
                      <Link to="/terms" className="text-accent-600 hover:text-accent-700 font-medium">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-accent-600 hover:text-accent-700 font-medium">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                  {errors.termsAccepted && (
                    <p className="text-sm text-red-600 animate-shake">{errors.termsAccepted.message}</p>
                  )}
                </div>

                {/* Security Notice */}
                <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-4 flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-primary-700 dark:text-primary-300">
                    Your information is protected by industry-standard encryption and will never be shared with third parties.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-8 space-y-4">
              {currentStep === 1 ? (
                <Button
                  onClick={nextStep}
                  variant="primary"
                  fullWidth
                  className="bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 py-3"
                >
                  Continue
                  <ChevronRight className="w-5 h-5 ml-2 inline-block" />
                </Button>
              ) : (
                <div className="space-y-3">
                  <Button
                    onClick={handleSubmit(onSubmit)}
                    variant="primary"
                    fullWidth
                    loading={isLoading}
                    className="bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 py-3"
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                  
                  <Button
                    onClick={prevStep}
                    variant="outline"
                    fullWidth
                    className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all py-3"
                  >
                    Back
                  </Button>
                </div>
              )}
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link
                  to={ROUTES.LOGIN}
                  className="font-medium text-accent-600 hover:text-accent-700 dark:text-accent-400 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Register;