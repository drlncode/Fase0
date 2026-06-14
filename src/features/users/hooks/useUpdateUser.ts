import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useValidAuth } from '@auth/hooks/useValidAuth';
import { useToast } from '@shared/hooks/useToast';
import { updateUserAction } from '@users/lib/usersActions';

import type { ActionHookState } from '@shared/types/global.types';
import type { ActiveUser, UpdateUserBody } from '@users/types/user.types';

export function useUpdateUser() {
    const { t } = useTranslation('users');
    const { status: authStatus, user: { session }, updateUser } = useValidAuth();
    const { success, danger } = useToast();

    if (authStatus !== 'valid' || !session)
        throw new Error('Cannot update a user without a valid user session.');

    const [status, setStatus] = useState<ActionHookState<ActiveUser>>({ status: 'idle' });

    async function update(body: UpdateUserBody): Promise<ActiveUser | null> {
        setStatus({ status: 'loading' });

        const result = await updateUserAction(body);

        if (result.success) {
            updateUser(result.data);
            success(t('toast.profileUpdated'));

            setStatus({
                status: 'success' as const,
                data: result.data
            });

            return result.data;
        }

        danger(t('toast.profileUpdateError'));
        setStatus({
            status: 'error' as const,
            message: t('errors.updateProfile')
        });

        return null;
    }

    return {
        status,
        update
    };
}
