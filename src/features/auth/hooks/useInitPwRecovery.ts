import { useState } from 'react';
import { initPwRecovery } from '@auth/lib/authActions';

import type { ActionHookState } from '@/shared/types/global.types';

export function useInitPasswordRecovery() {
    const [ state, setState ] = useState<ActionHookState<'OK'>>({ status: 'idle' });

    const resetState = () => setState({ status: 'idle' })

    async function initPasswordRecovery({ email }: { email: string }) {
        setState({ status: 'loading' });
        const result = await initPwRecovery({ email });

        if (!result.success) {
            if (typeof result.error === 'object') return setState({
                status: 'error' as const,
                message: result.error.message
            });

            return setState({
                status: 'error' as const,
                message: result.error
            });
        }

        setState({
            status: 'success' as const,
            data: 'OK'
        });
    }

    return {
        state,
        resetState,
        initPasswordRecovery
    }
}
