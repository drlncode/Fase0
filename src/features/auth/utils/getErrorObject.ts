import { getStatusErrorMessage } from '@auth/utils/basedStatusErrorMessagesMap';
import type { AxiosError } from 'axios';

export function getErrorObject(error?: AxiosError): { success: false, error: string } {
    const status = error?.status ?? 0;
    return {
        success: false,
        error: getStatusErrorMessage(status)
    }
}
