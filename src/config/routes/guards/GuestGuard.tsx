import { Navigate } from 'react-router';
import { useAuth } from '@/features/auth/hooks/useAuth';

export function GuestGuard({ children }: { children: React.ReactNode }) {
    const { status } = useAuth();

    if (status === 'valid') return <Navigate to='/app' replace />;

    return (
        children
    );
}
