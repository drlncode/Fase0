import api from '@/lib/axios';

import type {
    UploadAvatarParams,
    UploadAvatarData,
    DeleteAvatarParams
} from '@media/types/media.types';

export class MediaService {
    static async uploadAvatar({ session, file }: UploadAvatarParams): Promise<UploadAvatarData> {
        const formData = new FormData();
        formData.append('avatar', file);

        const { data: { data } } = await api.post<{ data: { fileName: string } }>(
            '/media/avatars',
            formData,
            {
                headers: {
                    Authorization: `Bearer ${session}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );

        return data;
    }

    static async deleteAvatar({ session }: DeleteAvatarParams): Promise<void> {
        await api.delete('/media/avatars', {
            headers: {
                Authorization: `Bearer ${session}`
            }
        });
    }
}

export type UploadAvatarReturnType = Awaited<ReturnType<typeof MediaService.uploadAvatar>>;
export type DeleteAvatarReturnType = Awaited<ReturnType<typeof MediaService.deleteAvatar>>;
