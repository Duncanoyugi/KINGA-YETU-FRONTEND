import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Card } from '@/components/common/Card';
import { Alert } from '@/components/common/Alert';
import { registerSchema } from '@/lib/form-validation/validationSchemas';
import type { RegisterFormData } from '@/lib/form-validation/validationSchemas';
import { ROUTES } from '@/routing/routes';

type UserRole = 'PARENT' | 'HEALTH_WORKER';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser, isLoading, error, clearError } = useAuth();
  const [role, setRole] = useState<UserRole>('PARENT');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'PARENT',
      termsAccepted: false,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data);
      navigate(ROUTES.VERIFY_EMAIL);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full">
        <Card.Body>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Join ImmuniTrack Kenya to track your child's immunizations
            </p>
          </div>

          {error && (
            <Alert
              variant="error"
              message={error}
              onClose={clearError}
              className="mb-6"
            />
          )}

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              I am registering as
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('PARENT')}
                className={`
                  p-3 border rounded-lg text-center transition-colors
                  ${role === 'PARENT'
                    ? 'bg-primary-50 border-primary-500 text-primary-700'
                    : 'border-gray-200 hover:bg-gray-50'
                  }
                `}
              >
                <span className="block font-medium">Parent</span>
                <span className="text-xs text-gray-500">Register your children</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('HEALTH_WORKER')}
                className={`
                  p-3 border rounded-lg text-center transition-colors
                  ${role === 'HEALTH_WORKER'
                    ? 'bg-primary-50 border-primary-500 text-primary-700'
                    : 'border-gray-200 hover:bg-gray-50'
                  }
                `}
              >
                <span className="block font-medium">Health Worker</span>
                <span className="text-xs text-gray-500">Manage vaccinations</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Name"
              {...register('fullName')}
              error={errors.fullName?.message}
              placeholder="Enter your full name"
            />

            <Input
              label="Email Address"
              type="email"
              {...register('email')}
              error={errors.email?.message}
              placeholder="Enter your email"
            />

            <Input
              label="Phone Number (Optional)"
              type="tel"
              {...register('phoneNumber')}
              error={errors.phoneNumber?.message}
              placeholder="+254 XXX XXX XXX"
            />

            <Input
              label="Password"
              type="password"
              {...register('password')}
              error={errors.password?.message}
              placeholder="Create a password"
              helperText="Must be at least 8 characters with uppercase, lowercase, number and special character"
            />

            <Input
              label="Confirm Password"
              type="password"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
              placeholder="Confirm your password"
            />

            <input type="hidden" {...register('role')} value={role} />

            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('termsAccepted')}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-600">
                I agree to the{' '}
                <Link to="/terms" className="text-primary-600 hover:text-primary-500">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-primary-600 hover:text-primary-500">
                  Privacy Policy
                </Link>
              </label>
            </div>
            {errors.termsAccepted && (
              <p className="text-sm text-red-600">{errors.termsAccepted.message}</p>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={isLoading}
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to={ROUTES.LOGIN}
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Sign in
              </Link>
            </p>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Register;