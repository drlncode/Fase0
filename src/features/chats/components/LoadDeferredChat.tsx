import { useEffect } from 'react';
import { useChatById } from '@chats/hooks/useChatById';
import { useChatStore } from '@chats/store/useChatStore';
import { Navigate } from 'react-router';
import { ChatListSkeleton } from '@chats/components/ChatListSkeleton';

export function LoadDeferredChat({ chatId, onLoaded }: { chatId: string; onLoaded: () => void }) {
    const { status, get } = useChatById();
    const setChat = useChatStore(state => state.setChat);
    const setActiveChat = useChatStore(state => state.setActiveChat);
    const fetchStatus = status.status;

    useEffect(() => {
        if (status.status === 'idle') {
            get(chatId);
        }
    }, [status.status, chatId, get]);

    useEffect(() => {
        if (fetchStatus === 'success') {
            setChat(status.data);
            setActiveChat(status.data);
            onLoaded();
        }
    }, [fetchStatus, onLoaded, setActiveChat, setChat, status]);

    if (fetchStatus === 'loading') return (
        <div className='flex h-full w-full items-center justify-center p-4'>
            <ChatListSkeleton />
        </div>
    );
    if (fetchStatus === 'error') return <Navigate to='/app' replace />;
}
