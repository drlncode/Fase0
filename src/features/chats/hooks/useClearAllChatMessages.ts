import { useState } from 'react';
import { useValidAuth } from '@auth/hooks/useValidAuth';
import { useChatStore } from '@chats/store/useChatStore';
import { useMessageStore } from '@messages/store/useMessageStore';
import { useToast } from '@/shared/hooks/useToast';
import { clearAllChatMessages } from '@chats/lib/chatActions';

import type { ActionHookState } from '@shared/types/global.types';

export function useClearAllChatMessages() {
    const { status: authStatus, user: { session } } = useValidAuth();
    const findChat = useChatStore(state => state.findChat);
    const setChat = useChatStore(state => state.setChat);
    const clearChatMessages = useMessageStore(state => state.clearChatMessages);
    const { success, danger } = useToast();

    if (authStatus !== 'valid' || !session)
        throw new Error('Cannot clear all chat messages without a valid user session.');

    const [ status, setStatus ] = useState<ActionHookState<null>>({ status: 'idle' });

    async function clearMessages(chatId: string) {
        const previousChat = findChat(chatId);
        if (!previousChat) return;

        const optimisticChat = {
            ...previousChat,
            chatInfo: {
                ...previousChat.chatInfo,
                unreadMessages: 0,
                lastMessage: null
            }
        };

        setChat(optimisticChat);
        clearChatMessages(chatId);
        setStatus({ status: 'loading' });

        const result = await clearAllChatMessages(session, chatId);

        if (result.success) {
            success('Mensajes eliminados correctamente.');
            return setStatus({
                status: 'success' as const,
                data: null
            });
        }

        setChat(previousChat);
        danger(`Error al limpiar los mensajes del chat. Intenta de nuevo más tarde.`);
        setStatus({
            status: 'error' as const,
            message: 'No fue posible limpiar todos los mensajes.'
        });
    }

    return {
        status,
        clearMessages
    }
}
