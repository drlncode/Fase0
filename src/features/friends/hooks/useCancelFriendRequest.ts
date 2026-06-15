import { useState } from 'react';
import { useValidAuth } from '@auth/hooks/useValidAuth';
import { useToast } from '@shared/hooks/useToast';
import { cancelFriendRequest } from '@friends/lib/friendsActions';
import i18n from '@/lib/i18n';

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
        const result = await cancelFriendRequest(requestId);

        if (result.success) {
            success(i18n.t('friends:toast.friendRequestCancelled'));
            return setStatus({
                status: 'success' as const,
                data: result.data
            });
        }

        danger(i18n.t('friends:toast.friendRequestCancelledError'));
        setStatus({
            status: 'error' as const,
            message: i18n.t('friends:toast.friendRequestCancelledStatusError')
        });
    }

    return {
        status,
        cancel
    }
}
