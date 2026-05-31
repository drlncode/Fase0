import { Outlet } from 'react-router';
import { useAuth } from '@auth/hooks/useAuth';
import { AuthFlowContextProvider } from '@auth/providers/AuthFlowContextProvider';
import { FullScreenLoader } from '@shared/components/FullScreenLoader';

export default function AuthLayout() {
    const { status } = useAuth();

    if (status === 'pending') return <FullScreenLoader />;

    return (
        <AuthFlowContextProvider>
            <div className='flex min-h-screen w-screen flex-col items-center justify-center p-2 pr-3 pb-3 select-none dark:bg-surface dark:text-secondary'>
                <title>Autenticación | Fase0</title>
                <Outlet />
            </div>
        </AuthFlowContextProvider>
    );
}
