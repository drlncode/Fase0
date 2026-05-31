import { Navigate } from 'react-router';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { FullScreenLoader } from '@shared/components/FullScreenLoader';

export function ProtectedGuard({ children }: { children: React.ReactNode }) {
    const { status } = useAuth();

    if (status === 'pending') return <FullScreenLoader />;
    if (status === 'pre-valid') return null;
    if (status === 'invalid') return <Navigate to='/auth' replace />;

    return (
        children
    );
}
