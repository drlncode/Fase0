import { useEffect, useRef } from 'react';
import { Outlet } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useValidAuth } from '@auth/hooks/useValidAuth';
import { useGetChats } from '@chats/hooks/useGetChats';
import { useGetFriends } from '@friends/hooks/useGetFriends';
import { useGetFriendsRequests } from '@friends/hooks/useGetFriendsRequests';
import { useGetFriendsSentRequests } from '@friends/hooks/useGetFriendsSentRequests';
import { useChatSocket } from '@chats/hooks/useChatSocket';
import { useFriendsSocket } from '@friends/hooks/useFriendsSocket';
import { useMessageSocket } from '@messages/hooks/useMessageSocket';
import { useMessageSync } from '@messages/hooks/useMessageSync';
import { useUserSocket } from '@users/hooks/useUserSocket';
import { useModal } from '@shared/hooks/useModal';
import { useIsCoarsePointer } from '@shared/hooks/useMediaQuery';
import { useSwipeHintSeen } from '@shared/hooks/useSwipeHintSeen';
import { SwipeHintContent } from '@shared/components/SwipeHintContent';
import { Header } from '@app/components/Header';
import { Aside } from '@app/components/Aside';
import { MobileNav } from '@app/components/MobileNav';

export default function AppLayout() {
    const { t } = useTranslation();
    const { user: { session } } = useValidAuth();
    const { loadChats } = useGetChats();
    const { loadFriends } = useGetFriends();
    const { loadFriendsRequests } = useGetFriendsRequests();
    const { loadFriendsSentRequests } = useGetFriendsSentRequests();

    useChatSocket();
    useFriendsSocket();
    useMessageSocket();
    useMessageSync();
    useUserSocket();

    const { openInfo } = useModal();
    const isTouch = useIsCoarsePointer();
    const { seen: swipeHintSeen, markSeen: markSwipeHintSeen } = useSwipeHintSeen();
    const swipeHintScheduledRef = useRef(false);

    useEffect(() => {
        if (!session) return;

        loadChats();
        loadFriends();
        loadFriendsRequests();
        loadFriendsSentRequests();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session]); // las funciones load deben ser estables en sus hooks

    // One-time swipe gestures onboarding: only on touch devices, only if never shown.
    useEffect(() => {
        if (!session || !isTouch || swipeHintSeen || swipeHintScheduledRef.current) return;
        swipeHintScheduledRef.current = true;

        const timer = window.setTimeout(() => {
            openInfo({
                title: t('swipeHint.title'),
                content: <SwipeHintContent />,
                onDismiss: markSwipeHintSeen,
            });
        }, 900);

        return () => window.clearTimeout(timer);
    }, [session, isTouch, swipeHintSeen, openInfo, markSwipeHintSeen, t]);

    return (
        <div className='flex h-dvh max-h-dvh w-full flex-col overflow-hidden p-1.5 select-none md:p-2 md:pr-3 md:pb-3 dark:bg-overlay dark:text-secondary'>
            <Header />
            <main className='flex h-full min-h-0 w-full flex-1 overflow-hidden rounded-lg transition-all duration-150 ease-in-out md:rounded-xl dark:bg-overlay'>
                <Aside />
                <div className='h-full w-full min-w-0 overflow-hidden rounded-lg border border-default bg-surface md:rounded-xl'>
                    <Outlet />
                </div>
            </main>
            <MobileNav />
        </div>
    );
}
