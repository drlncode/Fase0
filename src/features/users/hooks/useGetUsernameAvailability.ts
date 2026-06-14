import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getUsernameAvailabilityAction } from '@users/lib/usersActions';

import type { ActionHookState } from '@shared/types/global.types';

type UsernameAvailability = {
    isAvailable: boolean;
};

export function useGetUsernameAvailability() {
    const { t } = useTranslation('users');
    const [ state, setState ] = useState<ActionHookState<UsernameAvailability>>({ status: 'idle' });

    const resetState = useCallback(() => {
        if (state.status !== 'idle') setState({ status: 'idle' });
    }, [state.status]);

    const checkUsernameAvailability = useCallback(async (username: string): Promise<{ isAvailable: boolean } | null> => {
        if (!username) return null;

        setState({ status: 'loading' });

        const result = await getUsernameAvailabilityAction(username);

        if (!result.success) {
            setState({
                status: 'error',
                message: t('api.checkAvailabilityError')
            });

            return null;
        }

        const data = { isAvailable: result.data.isAvailable };

        setState({
            status: 'success',
            data
        });

        return data;
    }, [t]);

    return {
        state,
        resetState,
        checkUsernameAvailability
    };
}
