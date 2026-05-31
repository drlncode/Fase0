import { useState } from 'react';
import { useValidAuth } from '@auth/hooks/useValidAuth';
import { useToast } from '@shared/hooks/useToast';
import { rejectFriendRequest } from '@friends/lib/friendsActions';

import type { ActionHookState } from '@shared/types/global.types';
import type { RejectFriendRequestResponse } from '@friends/services/friends.service';

export function useRejectFriendRequest() {
    const { status: authStatus, user: { session } } = useValidAuth();
    const { success, danger } = useToast();

    if (authStatus !== 'valid' || !session)
        throw new Error('Cannot reject a friend request without a valid user session.');

    const [ status, setStatus ] = useState<ActionHookState<RejectFriendRequestResponse>>({ status: 'idle' });

    async function reject(requestId: string) {
        setStatus({ status: 'loading' });
        const result = await rejectFriendRequest(session, requestId);

        if (result.success) {
            success('Solicitud de amistad rechazada.');
            return setStatus({
                status: 'success' as const,
                data: result.data
            });
        }

        danger('No fue posible rechazar la solicitud de amistad. Inténtalo de nuevo.');
        setStatus({
            status: 'error' as const,
            message: 'No fue posible rechazar la solicitud de amistad.'
        });
    }

    return {
        status,
        reject
    }
}
