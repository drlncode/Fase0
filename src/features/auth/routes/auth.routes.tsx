import { lazy } from 'react';
import { GuestGuard } from '@config/routes/guards/GuestGuard';
import type { RouteObject } from 'react-router';

// Layouts
const AuthLayout = lazy(() => import('@auth/layouts/auth.layout'));

// Pages
const AuthPage = lazy(() => import('@/features/auth/pages/auth.page'));

export const authRouter: RouteObject = {
    path: '/auth',
    element: (
        <GuestGuard>
            <AuthLayout />
        </GuestGuard>
    ),
    children: [
        { index: true, element: <AuthPage /> },
        { path: 'confirm', element: <AuthPage /> },
        { path: '*', loader: () => { throw new Response(null, { status: 404 }); } }
    ]
};
