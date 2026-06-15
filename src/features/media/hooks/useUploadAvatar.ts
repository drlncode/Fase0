import { useState } from 'react';
import { useValidAuth } from '@auth/hooks/useValidAuth';
import { useToast } from '@shared/hooks/useToast';
import { useAvatarCacheStore } from '@shared/store/useAvatarCacheStore';
import { uploadAvatar } from '@media/lib/mediaActions';
import i18n from '@/lib/i18n';

import type { ActionHookState } from '@shared/types/global.types';
import type { UploadAvatarData } from '@media/types/media.types';

export function useUploadAvatar() {
    const { status: authStatus, user: { session, _id }, updateUser } = useValidAuth();
    const { success, danger } = useToast();

    if (authStatus !== 'valid' || !session)
        throw new Error('Cannot upload an avatar without a valid user session.');

    const [status, setStatus] = useState<ActionHookState<UploadAvatarData>>({ status: 'idle' });

    async function upload(file: File): Promise<UploadAvatarData | null> {
        setStatus({ status: 'loading' });

        const result = await uploadAvatar(file);

        if (result.success) {
            const localUrl = URL.createObjectURL(file);
            useAvatarCacheStore.getState().setAvatar(_id, result.data.fileName, file, localUrl);
            updateUser({ avatar: result.data.fileName });
            success(i18n.t('media:toast.avatarUploaded'));

            setStatus({
                status: 'success' as const,
                data: result.data
            });

            return result.data;
        }

        danger(i18n.t('media:toast.avatarUploadError'));
        setStatus({
            status: 'error' as const,
            message: i18n.t('media:errors.avatarUpload')
        });

        return null;
    }

    return {
        status,
        upload
    };
}
