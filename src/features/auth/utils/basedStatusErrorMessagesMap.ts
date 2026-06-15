import i18n from '@/lib/i18n';

export function getStatusErrorMessage(status: number): string {
    const keyMap: Record<number, string> = {
        400: 'errors.400',
        401: 'errors.401',
        403: 'errors.403',
        409: 'errors.409',
        500: 'errors.500',
        0: 'errors.0',
    };
    return i18n.t(keyMap[status] ?? keyMap[0], { ns: 'auth' });
}
