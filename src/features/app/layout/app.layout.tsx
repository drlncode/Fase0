import { useEffect } from 'react';
import { Outlet } from 'react-router';
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
import { Header } from '@app/components/Header';
import { Aside } from '@app/components/Aside';

export default function AppLayout() {
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

    useEffect(() => {
        if (!session) return;
        
        loadChats();
        loadFriends();
        loadFriendsRequests();
        loadFriendsSentRequests();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session]); // las funciones load deben ser estables en sus hooks

    return (
        <div className='flex h-screen max-h-screen w-screen flex-col overflow-hidden p-2 pr-3 pb-3 select-none dark:bg-overlay dark:text-secondary'>
            <Header />
            <main className='flex h-full min-h-0 w-full overflow-hidden rounded-xl transition-all duration-150 ease-in-out dark:bg-overlay'>
                <Aside />
                <div className='h-full w-full overflow-hidden rounded-xl border border-default bg-surface'>
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
