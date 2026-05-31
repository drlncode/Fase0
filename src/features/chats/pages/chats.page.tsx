import { useState } from 'react';
import { useEffect } from 'react';
import { useChatStore } from '@chats/store/useChatStore';
import { useParams } from 'react-router';
import { Chat } from '@chats/components/Chat';
import { ChatSkeleton } from '@chats/components/ChatSkeleton';
import { MessagesContainerSkeleton } from '@messages/components/MessagesContainerSkeleton';
import { LoadDeferredChat } from '@/features/chats/components/LoadDeferredChat';

export default function ChatPage() {
    const [ isDeferredChat, setIsDeferredChat ] = useState(false);
    const findChat = useChatStore(state => state.findChat);
    const setActiveChat = useChatStore(state => state.setActiveChat);
    const activeChat = useChatStore(state => state.activeChat);
    const chatId = useParams<{ chatId: string }>().chatId!;
    const chatsStatus = useChatStore(state => state.chatsFetch.status.status);

    useEffect(() => {
        setIsDeferredChat(false);
        if (chatsStatus !== 'success') return;

        const chat = findChat(chatId!);
        if (!chat) {
            setIsDeferredChat(true);
            return;
        }

        setActiveChat(chat);
    }, [chatId, chatsStatus, findChat, setActiveChat]);

    if (isDeferredChat) return <LoadDeferredChat chatId={chatId} onLoaded={() => setIsDeferredChat(false)} />;
    if (!activeChat) {
        return (
            <section className='animate-page-enter flex h-full w-full flex-col'>
                <ChatSkeleton>
                    <MessagesContainerSkeleton />
                </ChatSkeleton>
            </section>
        );
    }
    return (
        <section className='animate-page-enter flex h-full w-full flex-col'>
            <Chat chat={activeChat} />
        </section>
    );
}
