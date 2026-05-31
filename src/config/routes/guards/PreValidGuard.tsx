import { Navigate, useLocation } from 'react-router';
import { useAuth } from '@/features/auth/hooks/useAuth';

export function PreValidGuard({ children }: { children: React.ReactNode }) {
    const { status } = useAuth();
    const { pathname } = useLocation();

    if (status !== 'pre-valid' && pathname === '/auth/confirm') {
        return <Navigate to='/auth' replace />;
    }

    if (status === 'pre-valid' && pathname !== '/auth/confirm') {
        return <Navigate to='/auth/confirm' replace />;
    }

    return children;
}
