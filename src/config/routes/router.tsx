import { lazy } from 'react';
import { createBrowserRouter, isRouteErrorResponse, RouterProvider, useRouteError } from 'react-router';
import { RootLayout } from '@config/routes/layouts/root.layout';
import { authRouter } from '@auth/routes/auth.routes';
import { appRouter } from '@app/routes/app.routes';

const LandingPage = lazy(() => import('@/features/landing/pages/LandingPage'));
const Error = lazy(() => import('@/shared/pages/Error'));
const NotFound = lazy(() => import('@/shared/pages/NotFound'));

const notFoundLoader = () => {
    throw new Response(null, { status: 404 });
};

function RouteErrorBoundary() {
    const error = useRouteError();
    if (isRouteErrorResponse(error) && error.status === 404) {
        return <NotFound />;
    }
    return <Error />;
}

const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        errorElement: <RouteErrorBoundary />,
        children: [
            {
                index: true,
                element: <LandingPage />
            },
            authRouter,
            appRouter,
            {
                path: '*',
                loader: notFoundLoader
            }
        ]
    }
]);

export const AppRouter = () => <RouterProvider router={ router } />;
