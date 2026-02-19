import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { ROUTES } from '@/routing/routes';

export const ServerError: React.FC = () => {
  return (
    <div className="min-h-screen bg-white px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
      <div className="max-w-max mx-auto">
        <main className="sm:flex">
          <p className="text-4xl font-bold text-red-600 sm:text-5xl">500</p>
          <div className="sm:ml-6">
            <div className="sm:border-l sm:border-gray-200 sm:pl-6">
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl">
                Server Error
              </h1>
              <p className="mt-1 text-base text-gray-500">
                Something went wrong on our end. Please try again later.
              </p>
            </div>
            <div className="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
              <Link to={ROUTES.DASHBOARD}>
                <Button variant="primary">Refresh page</Button>
              </Link>
              <Link to={ROUTES.CONTACT}>
                <Button variant="outline">Report issue</Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ServerError;