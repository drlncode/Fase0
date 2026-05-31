import { useState } from 'react';
import { useLocalStorage } from '@shared/hooks/useLocalStorage';
import { refreshUserSession } from '@auth/lib/authActions';
import { SESSION_KEY } from '@auth/constants/auth.constants';

import type { ActionHookState } from '@shared/types/global.types';

export function useRefreshSession() {
    const [ state, setState ] = useState<ActionHookState<'OK'>>({ status: 'idle' });
    const { getItem } = useLocalStorage();
    const refreshState = () => setState({ status: 'idle' });

    async function refresh(code: number) {
        setState({ status: 'loading' });
        const session = getItem(SESSION_KEY);

        if (!session) {
            setState({
                status: 'error' as const,
                message: 'NO_SESSION_FOUND'
            });
            return;
        }

        const result = await refreshUserSession({ session, code });

        if (result.success) {
            setState({ status: 'success' as const, data: 'OK' });
        } else {
            setState({
                status: 'error' as const,
                message: typeof result.error === 'string' ? result.error : result.error.message
            });
        }
    }

    return {
        state,
        refresh,
        refreshState
    }
}
