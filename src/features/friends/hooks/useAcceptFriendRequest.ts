import { useState } from 'react';
import { useValidAuth } from '@auth/hooks/useValidAuth';
import { useToast } from '@shared/hooks/useToast';
import { acceptFriendRequest } from '@friends/lib/friendsActions';

import type { ActionHookState } from '@shared/types/global.types';
import type { AcceptFriendRequestResponse } from '@friends/services/friends.service';

export function useAcceptFriendRequest() {
    const { status: authStatus, user: { session } } = useValidAuth();
    const { success, danger } = useToast();

    if (authStatus !== 'valid' || !session)
        throw new Error('Cannot accept a friend request without a valid user session.');

    const [ status, setStatus ] = useState<ActionHookState<AcceptFriendRequestResponse>>({ status: 'idle' });

    async function accept(requestId: string) {
        setStatus({ status: 'loading' });
        const result = await acceptFriendRequest(session, requestId);

        if (result.success) {
            success('Solicitud de amistad aceptada.');
            return setStatus({
                status: 'success' as const,
                data: result.data
            });
        }

        danger('No fue posible aceptar la solicitud de amistad. Inténtalo de nuevo.');
        setStatus({
            status: 'error' as const,
            message: 'No fue posible aceptar la solicitud de amistad.'
        });
    }

    return {
        status,
        accept
    }
}
