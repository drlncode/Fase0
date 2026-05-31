import type { AuthFlowContextState } from '@auth/types/auth.types';

export type AuthFlowActions =
    | { type: 'SET_EMAIL', payload: { email: string } }
    | { type: 'SET_CODE', payload: { code: number } }
    | { type: 'SET_ERROR_MESSAGE', payload: { errorMessage: string } }
    | { type: 'SET_STEP', payload: { step: AuthFlowContextState['step'] } };

export type AuthFlowActionsType = AuthFlowActions['type'];

export const authFlowInitialState: AuthFlowContextState = {
    step: 'email-input'
}

export function authFlowReducer(state: AuthFlowContextState, action: AuthFlowActions) {
    const { type, payload } = action;

    switch (type) {
        case 'SET_EMAIL': return {
            ...state,
            ...payload
        };

        case 'SET_CODE': return {
            ...state,
            ...payload
        };

        case 'SET_ERROR_MESSAGE': return {
            ...state,
            ...payload
        };

        case 'SET_STEP': return {
            ...state,
            ...payload
        };

        default: return state;
    }
}
