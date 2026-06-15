import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useValidAuth } from '@auth/hooks/useValidAuth';
import { useChatStore } from '@chats/store/useChatStore';
import { markAllAsRead } from '@chats/lib/chatActions';

import type { ActionHookState } from '@shared/types/global.types';

export function useMarkAllAsRead() {
    const { t } = useTranslation('chats');
    const { status: authStatus, user: { session } } = useValidAuth();
    const findChat = useChatStore(state => state.findChat);
    const setChat = useChatStore(state => state.setChat);

    if (authStatus !== 'valid' || !session)
        throw new Error('Cannot mark all messages as read without a valid user session.');

    const [ status, setStatus ] = useState<ActionHookState<null>>({ status: 'idle' });

    async function markAsRead(chatId: string) {
        const previousChat = findChat(chatId);
        if (!previousChat) return;

        const optimisticChat = {
            ...previousChat,
            chatInfo: {
                ...previousChat.chatInfo,
                unreadMessages: 0
            }
        };

        setChat(optimisticChat);
        setStatus({ status: 'loading' });

        const result = await markAllAsRead(chatId);

        if (result.success) {
            return setStatus({
                status: 'success' as const,
                data: null
            });
        }

        setChat(previousChat);
        setStatus({
            status: 'error' as const,
            message: t('errors.markRead')
        });
    }

    return {
        status,
        markAsRead
    }
}
