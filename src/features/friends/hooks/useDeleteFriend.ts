import { useState } from 'react';
import { useValidAuth } from '@auth/hooks/useValidAuth';
import { useToast } from '@shared/hooks/useToast';
import { deleteFriend } from '@friends/lib/friendsActions';
import i18n from '@/lib/i18n';

import type { ActionHookState } from '@shared/types/global.types';
import type { DeleteFriendResponse } from '@friends/services/friends.service';

export function useDeleteFriend() {
    const { status: authStatus, user: { session } } = useValidAuth();
    const { success, danger } = useToast();

    if (authStatus !== 'valid' || !session)
        throw new Error('Cannot delete a friend without a valid user session.');

    const [ status, setStatus ] = useState<ActionHookState<DeleteFriendResponse>>({ status: 'idle' });

    async function remove(friendshipId: string) {
        setStatus({ status: 'loading' });
        const result = await deleteFriend(friendshipId);

        if (result.success) {
            success(i18n.t('friends:toast.friendDeleted'));
            return setStatus({
                status: 'success' as const,
                data: result.data
            });
        }

        danger(i18n.t('friends:toast.friendDeletedError'));
        setStatus({
            status: 'error' as const,
            message: i18n.t('friends:toast.friendDeletedStatusError')
        });
    }

    return {
        status,
        remove
    }
}
