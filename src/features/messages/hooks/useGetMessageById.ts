import { useState } from 'react';
import { useValidAuth } from '@auth/hooks/useValidAuth';
import { getMessageById } from '@messages/lib/messageActions';
import i18n from '@/lib/i18n';

import type { ActionHookState } from '@shared/types/global.types';
import type { VisibleMessage } from '@messages/types/message.types';

export function useGetMessageById() {
    const { status: authStatus, user: { session } } = useValidAuth();

    if (authStatus !== 'valid' || !session)
        throw new Error('Cannot get a message without a valid user session.');

    const [status, setStatus] = useState<ActionHookState<VisibleMessage>>({ status: 'idle' });

    async function get(chatId: string, messageId: string) {
        setStatus({ status: 'loading' });
        const result = await getMessageById(chatId, messageId);

        if (result.success) {
            return setStatus({
                status: 'success' as const,
                data: result.data
            });
        }

        setStatus({
            status: 'error' as const,
            message: i18n.t('messages:errors.messageNotFound')
        });
    }

    return {
        status,
        get
    }
}