import { useState } from 'react';
import { useValidAuth } from '@auth/hooks/useValidAuth';
import { useToast } from '@shared/hooks/useToast';
import { rejectFriendRequest } from '@friends/lib/friendsActions';
import i18n from '@/lib/i18n';

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
        const result = await rejectFriendRequest(requestId);

        if (result.success) {
            success(i18n.t('friends:toast.friendRequestRejected'));
            return setStatus({
                status: 'success' as const,
                data: result.data
            });
        }

        danger(i18n.t('friends:toast.friendRequestRejectedError'));
        setStatus({
            status: 'error' as const,
            message: i18n.t('friends:toast.friendRequestRejectedStatusError')
        });
    }

    return {
        status,
        reject
    }
}
