// components/DashboardWrapper.tsx
'use client';

import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

interface DashboardWrapperProps {
  children: ReactNode;
}

const DashboardWrapper = ({ children }: DashboardWrapperProps) => {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await fetch('/api/check-admin', {
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          setIsAdmin(data.isAdmin === true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } finally {
      router.push('/login');
    }
  };

  // Clean loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 size-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // Clean access denied state
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md text-center">
          {/* Icon */}
          <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-red-100">
            <svg className="size-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          {/* Message */}
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="mb-8 text-gray-600">You need administrator privileges to access this page.</p>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => router.push('/login')}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700"
            >
              Sign In as Admin
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Return Home
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full rounded-lg px-4 py-3 font-medium text-gray-600 transition-colors hover:text-gray-800"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Authorized - render children
  return <>{children}</>;
};

export default DashboardWrapper;