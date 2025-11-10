// components/ProtectedRoute.tsx
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import { useEffect, ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[]; // Optional: specific roles allowed
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      // Optionally redirect to unauthorized page
      router.push('/'); // Redirect to home if not authorized
    }
  }, [isAuthenticated, user, router, allowedRoles]);

  if (!isAuthenticated) {
    // You can return a loading spinner or null while redirecting
    return <div>Redirecting to login...</div>;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <div>Unauthorized access</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;