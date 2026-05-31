import { useReducer } from 'react';
import { authFlowReducer, authFlowInitialState } from '@auth/reducers/authFlow.reducer';

import type { AuthFlowContextType } from '@auth/types/auth.types';

export function useAuthFlowReducer(initialStep: AuthFlowContextType['step'] = 'email-input'): AuthFlowContextType {
    const [ state, dispatch ] = useReducer(authFlowReducer, {
        ...authFlowInitialState,
        step: initialStep
    });

    const setEmail = (email: string) => {
        dispatch({ type: 'SET_EMAIL', payload: { email } });
    };

    const setCode = (code: number) => {
        dispatch({ type: 'SET_CODE', payload: { code } });
    };

    const goToStep = (step: AuthFlowContextType['step']) => {
        dispatch({ type: 'SET_STEP', payload: { step } });
    };

    return {
        ...state,
        setEmail,
        setCode,
        goToStep
    }
}
