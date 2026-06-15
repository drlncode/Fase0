import { useState } from 'react';
import { useValidAuth } from '@auth/hooks/useValidAuth';
import { useToast } from '@shared/hooks/useToast';
import { sendFriendRequest } from '@friends/lib/friendsActions';
import i18n from '@/lib/i18n';

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
        const result = await sendFriendRequest(userId);

        if (result.success) {
            success(i18n.t('friends:toast.friendRequestSent'));
            return setStatus({
                status: 'success' as const,
                data: result.data
            });
        }

        danger(i18n.t('friends:toast.friendRequestSentError'));
        setStatus({
            status: 'error' as const,
            message: i18n.t('friends:toast.friendRequestSentStatusError')
        });
    }

    return {
        status,
        send
    }
}
