import { useState } from 'react';
import { useValidAuth } from '@auth/hooks/useValidAuth';
import { useToast } from '@shared/hooks/useToast';
import { useAvatarCacheStore } from '@shared/store/useAvatarCacheStore';
import { deleteAvatar } from '@media/lib/mediaActions';
import i18n from '@/lib/i18n';

import type { ActionHookState } from '@shared/types/global.types';

export function useDeleteAvatar() {
    const { status: authStatus, user: { session, _id }, updateUser } = useValidAuth();
    const { success, danger } = useToast();

    if (authStatus !== 'valid' || !session)
        throw new Error('Cannot delete an avatar without a valid user session.');

    const [status, setStatus] = useState<ActionHookState<void>>({ status: 'idle' });

    async function remove(): Promise<boolean> {
        setStatus({ status: 'loading' });

        const result = await deleteAvatar();

        if (result.success) {
            useAvatarCacheStore.getState().removeAvatar(_id);
            updateUser({ avatar: null });
            success(i18n.t('media:toast.avatarDeleted'));

            setStatus({
                status: 'success' as const,
                data: undefined
            });

            return true;
        }

        danger(i18n.t('media:toast.avatarDeleteError'));
        setStatus({
            status: 'error' as const,
            message: i18n.t('media:errors.avatarDelete')
        });

        return false;
    }

    return {
        status,
        remove
    };
}
