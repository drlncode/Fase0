import { lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { RootLayout } from '@config/routes/layouts/root.layout';
import { authRouter } from '@auth/routes/auth.routes';
import { appRouter } from '@app/routes/app.routes';

const LandingPage = lazy(() => import('@/features/landing/pages/LandingPage'));
const NotFoundPage = lazy(() => import('@/shared/pages/not-found.page'));
const ErrorPage = lazy(() => import('@/shared/pages/error.page'));

const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <LandingPage />
            },
            authRouter,
            appRouter,
            {
                path: '*',
                element: <NotFoundPage />
            }
        ]
    }
]);

export const AppRouter = () => <RouterProvider router={ router } />;
