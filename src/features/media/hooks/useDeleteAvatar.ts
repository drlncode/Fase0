import { useState } from 'react';
import { useValidAuth } from '@auth/hooks/useValidAuth';
import { useToast } from '@shared/hooks/useToast';
import { useAvatarCacheStore } from '@shared/store/useAvatarCacheStore';
import { deleteAvatar } from '@media/lib/mediaActions';

import type { ActionHookState } from '@shared/types/global.types';

export function useDeleteAvatar() {
    const { status: authStatus, user: { session, _id }, updateUser } = useValidAuth();
    const { success, danger } = useToast();

    if (authStatus !== 'valid' || !session)
        throw new Error('Cannot delete an avatar without a valid user session.');

    const [status, setStatus] = useState<ActionHookState<void>>({ status: 'idle' });

    async function remove(): Promise<boolean> {
        setStatus({ status: 'loading' });

        const result = await deleteAvatar(session);

        if (result.success) {
            useAvatarCacheStore.getState().removeAvatar(_id);
            updateUser({ avatar: null });
            success('Avatar eliminado correctamente.');

            setStatus({
                status: 'success' as const,
                data: undefined
            });

            return true;
        }

        danger('No fue posible eliminar el avatar. Inténtalo de nuevo.');
        setStatus({
            status: 'error' as const,
            message: 'No fue posible eliminar el avatar.'
        });

        return false;
    }

    return {
        status,
        remove
    };
}
