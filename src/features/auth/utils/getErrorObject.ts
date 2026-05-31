import { errorMessagesMap } from '@auth/utils/basedStatusErrorMessagesMap';
import type { AxiosError } from 'axios';

export function getErrorObject(error?: AxiosError): { success: false, error: string } {
    if (!error) return {
        success: false,
        error: errorMessagesMap[0]
    }

    if (!error.status) return {
        success: false,
        error: errorMessagesMap[0]
    }

    const status = error.status as keyof typeof errorMessagesMap;

    return {
        success: false,
        error: errorMessagesMap[status] ?? errorMessagesMap[0]
    }
}
