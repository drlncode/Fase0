import { useState } from 'react';
import { useValidAuth } from '@auth/hooks/useValidAuth';
import { createChat } from '@chats/lib/chatActions';

import type { ActionHookState } from '@shared/types/global.types';
import type { Chat } from '@chats/types/chat.types';

export function useCreateChat() {
    const { status: authStatus, user: { session } } = useValidAuth();

    if (authStatus !== 'valid' || !session)
        throw new Error('Cannot create a chat without a valid user session.');

    const [status, setStatus] = useState<ActionHookState<Chat>>({ status: 'idle' });

    async function create(guestId: string, message: string) {
        setStatus({ status: 'loading' });
        const result = await createChat(session, guestId, message);

        if (result.success) {
            return setStatus({
                status: 'success' as const,
                data: result.data
            });
        }

        setStatus({
            status: 'error' as const,
            message: 'No fue posible crear el chat.'
        });
    }

    return {
        status,
        create
    }
}
