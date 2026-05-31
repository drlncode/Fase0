import { useEffect } from 'react';
import { useSocket } from '@/shared/hooks/useSocket';
import { useChatStore } from '@chats/store/useChatStore';
import { useMessageStore } from '@messages/store/useMessageStore';
import { useValidAuth } from '@auth/hooks/useValidAuth';

import type { ChatCreatedEvent, ChatUpdatedEvent, ChatReadAllEvent } from '@shared/types/socketEvent.types';

export function useChatSocket() {
    const { socket } = useSocket();
    const { user: { _id: currentUserId } } = useValidAuth();

    useEffect(() => {
        if (!socket) return;

        const handleChatCreated = ({ chat }: ChatCreatedEvent) => {
            if (chat.participant._id === currentUserId) return;
            const store = useChatStore.getState();
            store.setChat(chat);
            store.incrementChatsFetchTotal();
        };
        
        const handleChatUpdated = ({ chat }: ChatUpdatedEvent) => {
            if (!chat) return;
            // if (chat.participant._id === currentUserId) return;
            useChatStore.getState().updateChat(chat);
        };

        const handleChatReadAll = ({ chatId, messageIds }: ChatReadAllEvent) => {
            useMessageStore.getState().setChatMessagesAsRead(chatId, messageIds);
        };

        socket.on('chat:created', handleChatCreated);
        socket.on('chat:updated', handleChatUpdated);
        socket.on('chat:readAll', handleChatReadAll);

        return () => {
            socket.off('chat:created', handleChatCreated);
            socket.off('chat:updated', handleChatUpdated);
            socket.off('chat:readAll', handleChatReadAll);
        }
    }, [socket, currentUserId]);
}
