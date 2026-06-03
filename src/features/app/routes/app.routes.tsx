import { lazy } from 'react';
import { ProtectedGuard } from '@config/routes/guards/ProtectedGuard';

import type { RouteObject } from 'react-router';

// Layouts
const AppLayout = lazy(() => import('@app/layout/app.layout'));
const ChatLayout = lazy(() => import('@chats/layout/chat.layout'));

// Pages
const AppPage = lazy(() => import('@app/pages/app.page'));
const ChatPage = lazy(() => import('@chats/pages/chats.page'));
const FriendsPage = lazy(() => import('@friends/pages/friends.page'));

export const appRouter: RouteObject = {
    path: '/',
    element: (
        <ProtectedGuard>
            <AppLayout />
        </ProtectedGuard>
    ),
    children: [
        {
            path: 'app',
            children: [
                {
                    element: <ChatLayout />,
                    children: [
                        { index: true, element: <AppPage /> },
                        { path: 'chat/:chatId', element: <ChatPage /> }
                    ]
                },
                { path: 'friends', element: <FriendsPage /> },
            ]
        },
        { path: '*', loader: () => { throw new Response(null, { status: 404 }); } }
    ]
};
