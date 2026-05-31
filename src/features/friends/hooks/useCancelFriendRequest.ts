import { useState } from 'react';
import { useValidAuth } from '@auth/hooks/useValidAuth';
import { useToast } from '@shared/hooks/useToast';
import { cancelFriendRequest } from '@friends/lib/friendsActions';

import type { ActionHookState } from '@shared/types/global.types';
import type { CancelFriendRequestResponse } from '@friends/services/friends.service';

export function useCancelFriendRequest() {
    const { status: authStatus, user: { session } } = useValidAuth();
    const { success, danger } = useToast();

    if (authStatus !== 'valid' || !session)
        throw new Error('Cannot cancel a friend request without a valid user session.');

    const [ status, setStatus ] = useState<ActionHookState<CancelFriendRequestResponse>>({ status: 'idle' });

    async function cancel(requestId: string) {
        setStatus({ status: 'loading' });
        const result = await cancelFriendRequest(session, requestId);

        if (result.success) {
            success('Solicitud de amistad cancelada.');
            return setStatus({
                status: 'success' as const,
                data: result.data
            });
        }

        danger('No fue posible cancelar la solicitud de amistad. Inténtalo de nuevo.');
        setStatus({
            status: 'error' as const,
            message: 'No fue posible cancelar la solicitud de amistad.'
        });
    }

    return {
        status,
        cancel
    }
}
