import api from '@/lib/axios';

import type {
    UploadAvatarParams,
    UploadAvatarData
} from '@media/types/media.types';

export class MediaService {
    static async uploadAvatar({ file }: UploadAvatarParams): Promise<UploadAvatarData> {
        const formData = new FormData();
        formData.append('avatar', file);

        const { data: { data } } = await api.post<{ data: { fileName: string } }>(
            '/media/avatars',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );

        return data;
    }

    static async deleteAvatar(): Promise<void> {
        await api.delete('/media/avatars');
    }
}

export type UploadAvatarReturnType = Awaited<ReturnType<typeof MediaService.uploadAvatar>>;
export type DeleteAvatarReturnType = Awaited<ReturnType<typeof MediaService.deleteAvatar>>;
