import { Outlet } from 'react-router';
import { useAuth } from '@auth/hooks/useAuth';
import { AuthFlowContextProvider } from '@auth/providers/AuthFlowContextProvider';
import { FullScreenLoader } from '@shared/components/FullScreenLoader';
import { LangSelector } from '@auth/components/LangSelector';

export default function AuthLayout() {
    const { status } = useAuth();

    if (status === 'pending') return <FullScreenLoader />;

    return (
        <AuthFlowContextProvider>
            <div className='flex min-h-dvh w-full flex-col items-center justify-center overflow-x-hidden p-4 select-none sm:p-2 sm:pr-3 sm:pb-3 dark:bg-surface dark:text-secondary'>
                <title>Autenticación | Fase0</title>
                <div className='mb-4 flex w-full max-w-90 justify-end sm:fixed sm:top-4 sm:right-4 sm:mb-0 sm:w-auto'>
                    <LangSelector />
                </div>
                <Outlet />
            </div>
        </AuthFlowContextProvider>
    );
}
