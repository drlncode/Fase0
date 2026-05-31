import { Outlet } from 'react-router';
import { ModalsRenderer } from '@shared/components/ModalsRenderer';
import { PreValidGuard } from '@config/routes/guards/PreValidGuard';

export function RootLayout() {

    return (
        <PreValidGuard>
            <Outlet />
            <ModalsRenderer />
        </PreValidGuard>
    );
}
