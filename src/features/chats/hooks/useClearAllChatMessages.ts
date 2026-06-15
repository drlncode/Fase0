import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useValidAuth } from '@auth/hooks/useValidAuth';
import { useChatStore } from '@chats/store/useChatStore';
import { useMessageStore } from '@messages/store/useMessageStore';
import { useToast } from '@/shared/hooks/useToast';
import { clearAllChatMessages } from '@chats/lib/chatActions';

import type { ActionHookState } from '@shared/types/global.types';

export function useClearAllChatMessages() {
    const { t } = useTranslation('chats');
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

        const result = await clearAllChatMessages(chatId);

        if (result.success) {
            success(t('toast.messagesCleared'));
            return setStatus({
                status: 'success' as const,
                data: null
            });
        }

        setChat(previousChat);
        danger(t('toast.clearError'));
        setStatus({
            status: 'error' as const,
            message: t('errors.clear')
        });
    }

    return {
        status,
        clearMessages
    }
}
