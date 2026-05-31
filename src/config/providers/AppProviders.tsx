import { Suspense } from 'react';
import { AuthContextProvider } from '@auth/providers/AuthContextProvider';
import { FullScreenLoader } from '@shared/components/FullScreenLoader';
import { ToastsRenderer } from '@shared/components/ToastsRenderer';

interface ProvidersProps {
    children?: React.ReactNode;
}

export function AppProviders({ children }: ProvidersProps) {
    return (
        <Suspense fallback={<FullScreenLoader />}>
            <AuthContextProvider>
                { children }
                <ToastsRenderer />
            </AuthContextProvider>
        </Suspense>
    );
}
