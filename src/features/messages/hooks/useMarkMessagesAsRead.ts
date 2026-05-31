import { useState } from 'react';
import { useValidAuth } from '@auth/hooks/useValidAuth';
import { markBatchAsRead } from '@messages/lib/messageActions';

import type { ActionHookState } from '@shared/types/global.types';

export function useMarkMessagesAsRead() {
    const { status: authStatus, user: { session } } = useValidAuth();

    if (authStatus !== 'valid' || !session)
        throw new Error('Cannot mark messages as read without a valid user session.');

    const [status, setStatus] = useState<ActionHookState<{ modifiedCount: number }>>({ status: 'idle' });

    async function markAsRead(messageIds: string[]) {
        if (messageIds.length === 0) return;

        setStatus({ status: 'loading' });
        const result = await markBatchAsRead(session, { messageIds });

        if (result.success) {
            return setStatus({
                status: 'success' as const,
                data: result.data
            });
        }

        setStatus({
            status: 'error' as const,
            message: 'No fue posible marcar los mensajes como leídos.'
        });
    }

    return {
        status,
        markAsRead
    }
}