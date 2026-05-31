import { useState } from 'react';
import { useValidAuth } from '@auth/hooks/useValidAuth';
import { useToast } from '@shared/hooks/useToast';
import { deleteFriend } from '@friends/lib/friendsActions';

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
        const result = await deleteFriend(session, friendshipId);

        if (result.success) {
            success('Amigo eliminado correctamente.');
            return setStatus({
                status: 'success' as const,
                data: result.data
            });
        }

        danger('No fue posible eliminar el amigo. Inténtalo de nuevo.');
        setStatus({
            status: 'error' as const,
            message: 'No fue posible eliminar el amigo.'
        });
    }

    return {
        status,
        remove
    }
}
