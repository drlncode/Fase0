import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useValidAuth } from '@auth/hooks/useValidAuth';
import { getChatById } from '@chats/lib/chatActions';

import type { ActionHookState } from '@shared/types/global.types';
import type { Chat } from '@chats/types/chat.types';

export function useChatById() {
    const { t } = useTranslation('chats');
    const { status: authStatus, user: { session } } = useValidAuth();

    if (authStatus !== 'valid' || !session)
        throw new Error('Cannot get a chat without a valid user session.');

    const [ status, setStatus ] = useState<ActionHookState<Chat>>({ status: 'idle' });

    async function get(chatId: string) {
        setStatus({ status: 'loading' });
        const result = await getChatById(chatId);

        if (result.success) {
            return setStatus({
                status: 'success' as const,
                data: result.data
            });
        }

        setStatus({
            status: 'error' as const,
            message: t('errors.notFound')
        });
    }

    return {
        status,
        get
    }
}
