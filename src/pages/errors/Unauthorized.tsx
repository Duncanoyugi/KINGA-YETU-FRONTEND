import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { ROUTES } from '@/routing/routes';

export const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
      <div className="max-w-max mx-auto">
        <main className="sm:flex">
          <p className="text-4xl font-bold text-red-600 sm:text-5xl">403</p>
          <div className="sm:ml-6">
            <div className="sm:border-l sm:border-gray-200 sm:pl-6">
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl">
                Access Denied
              </h1>
              <p className="mt-1 text-base text-gray-500">
                You don't have permission to access this page.
              </p>
            </div>
            <div className="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
              <Button variant="primary" onClick={() => navigate(-1)}>
                Go back
              </Button>
              <Link to={ROUTES.LOGIN}>
                <Button variant="outline">Login as different user</Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Unauthorized;