import { useState } from 'react';
import { useValidAuth } from '@auth/hooks/useValidAuth';
import { useToast } from '@shared/hooks/useToast';
import { useAvatarCacheStore } from '@shared/store/useAvatarCacheStore';
import { uploadAvatar } from '@media/lib/mediaActions';

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

        const result = await uploadAvatar(session, file);

        if (result.success) {
            // Seed the avatar cache with the freshly selected file so the UI can
            // keep showing it while the server-side asset becomes available.
            const localUrl = URL.createObjectURL(file);
            useAvatarCacheStore.getState().setAvatar(_id, result.data.fileName, file, localUrl);
            updateUser({ avatar: result.data.fileName });
            success('Avatar actualizado correctamente.');

            setStatus({
                status: 'success' as const,
                data: result.data
            });

            return result.data;
        }

        danger('No fue posible subir el avatar. Inténtalo de nuevo.');
        setStatus({
            status: 'error' as const,
            message: 'No fue posible subir el avatar.'
        });

        return null;
    }

    return {
        status,
        upload
    };
}
