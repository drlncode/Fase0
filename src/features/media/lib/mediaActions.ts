import { MediaService } from '@media/service/media.service';
import { isAxiosError } from 'axios';

import type { ServiceResponse } from '@shared/types/global.types';
import type {
    UploadAvatarReturnType,
    DeleteAvatarReturnType
} from '@media/service/media.service';

export async function uploadAvatar(
    session: string,
    file: File
): Promise<ServiceResponse<UploadAvatarReturnType>> {
    try {
        const data = await MediaService.uploadAvatar({ session, file });

        return {
            success: true,
            data
        }
    } catch (error) {
        if (isAxiosError(error)) return {
            success: false,
            error
        }
    }

    return {
        success: false
    }
}

export async function deleteAvatar(
    session: string
): Promise<ServiceResponse<DeleteAvatarReturnType>> {
    try {
        await MediaService.deleteAvatar({ session });

        return {
            success: true,
            data: undefined
        }
    } catch (error) {
        if (isAxiosError(error)) return {
            success: false,
            error
        }
    }

    return {
        success: false
    }
}
