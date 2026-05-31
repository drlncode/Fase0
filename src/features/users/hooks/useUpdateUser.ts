import { useState } from 'react';
import { useValidAuth } from '@auth/hooks/useValidAuth';
import { useToast } from '@shared/hooks/useToast';
import { updateUserAction } from '@users/lib/usersActions';

import type { ActionHookState } from '@shared/types/global.types';
import type { ActiveUser, UpdateUserBody } from '@users/types/user.types';

export function useUpdateUser() {
    const { status: authStatus, user: { session }, updateUser } = useValidAuth();
    const { success, danger } = useToast();

    if (authStatus !== 'valid' || !session)
        throw new Error('Cannot update a user without a valid user session.');

    const [status, setStatus] = useState<ActionHookState<ActiveUser>>({ status: 'idle' });

    async function update(body: UpdateUserBody): Promise<ActiveUser | null> {
        setStatus({ status: 'loading' });

        const result = await updateUserAction(session, body);

        if (result.success) {
            updateUser(result.data);
            success('Perfil actualizado correctamente.');

            setStatus({
                status: 'success' as const,
                data: result.data
            });

            return result.data;
        }

        danger('No fue posible actualizar el perfil. Inténtalo de nuevo.');
        setStatus({
            status: 'error' as const,
            message: 'No fue posible actualizar el perfil.'
        });

        return null;
    }

    return {
        status,
        update
    };
}
