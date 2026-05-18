import { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children }: { children?: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-12 text-white/80">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Prefer Outlet behavior for react-router route wrapping.
  if (children) return <>{children}</>;
  return <Outlet />;
}
