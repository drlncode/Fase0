import { useState } from 'react';
import { useValidAuth } from '@auth/hooks/useValidAuth';
import { useToast } from '@shared/hooks/useToast';
import { sendFriendRequest } from '@friends/lib/friendsActions';

import type { ActionHookState } from '@shared/types/global.types';
import type { SendFriendRequestResponse } from '@friends/services/friends.service';

export function useSendFriendRequest() {
    const { status: authStatus, user: { session } } = useValidAuth();
    const { success, danger } = useToast();

    if (authStatus !== 'valid' || !session)
        throw new Error('Cannot send a friend request without a valid user session.');

    const [ status, setStatus ] = useState<ActionHookState<SendFriendRequestResponse>>({ status: 'idle' });

    async function send(userId: string) {
        setStatus({ status: 'loading' });
        const result = await sendFriendRequest(session, userId);

        if (result.success) {
            success('Solicitud de amistad enviada.');
            return setStatus({
                status: 'success' as const,
                data: result.data
            });
        }

        danger('No fue posible enviar la solicitud de amistad. Inténtalo de nuevo.');
        setStatus({
            status: 'error' as const,
            message: 'No fue posible enviar la solicitud de amistad.'
        });
    }

    return {
        status,
        send
    }
}
