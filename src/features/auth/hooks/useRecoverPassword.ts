import { useState } from 'react';
import { recoverPw } from '@auth/lib/authActions';

import type { ActionHookState } from '@/shared/types/global.types';

export function useRecoverPassword() {
    const [ state, setState ] = useState<ActionHookState<'OK'>>({ status: 'idle' });

    const resetState = () => setState({ status: 'idle' });

    async function recoverPassword({ code, password }: {
        code: number;
        password: string;
    }) {
        setState({ status: 'loading' });
        const result = await recoverPw({ code, password });

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
        recoverPassword
    }
}
