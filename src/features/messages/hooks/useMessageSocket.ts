import { useEffect } from 'react';
import { useValidAuth } from '@features/auth/hooks/useValidAuth';
import { useSocket } from '@/shared/hooks/useSocket';
import { useNotificationAudio } from '@shared/hooks/useNotificationAudio';
import { useMessageStore } from '@messages/store/useMessageStore';

import type { MessageCreatedEvent, MessageUpdatedEvent, MessageRemovedEvent } from '@shared/types/socketEvent.types';

export function useMessageSocket() {
    const { user: { _id: userId } } = useValidAuth();
    const { socket } = useSocket();
    const { playAudio } = useNotificationAudio();

    useEffect(() => {
        if (!socket) return;

        const handleMessageCreated = ({ message, temp_id }: MessageCreatedEvent) => {
            const store = useMessageStore.getState();

            if (temp_id) {
                store.replaceOptimisticMessage(message.chatId, temp_id, message);
            } else {
                store.addMessage(message.chatId, message);
            }

            if (message.senderId !== userId) {
                playAudio();
            }
        };

        const handleMessageUpdated = ({ message }: MessageUpdatedEvent) => {
            if (!message) return;
            useMessageStore.getState().updateMessage(message.chatId, message._id, message);
        };

        const handleMessageRemoved = ({ chatId, messageId }: MessageRemovedEvent) => {
            useMessageStore.getState().removeMessage(chatId, messageId);
        };

        socket.on('message:created', handleMessageCreated);
        socket.on('message:updated', handleMessageUpdated);
        socket.on('message:removed', handleMessageRemoved);

        return () => {
            socket.off('message:created', handleMessageCreated);
            socket.off('message:updated', handleMessageUpdated);
            socket.off('message:removed', handleMessageRemoved);
        };
    }, [socket, playAudio, userId]);
}
