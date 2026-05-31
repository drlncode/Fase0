import type { AuthContextTypeWithoutMethods, AuthValidUser } from '@auth/types/auth.types';
import type { ActiveUser } from '@users/types/user.types';

export type AuthAction = 
    | { type: 'SET_AS_VALID', payload: AuthValidUser }
    | { type: 'SET_AS_PRE_VALID', payload: { session: string } }
    | { type: 'SET_AS_INVALID' }
    | { type: 'SET_AS_PENDING' }
    | { type: 'UPDATE_USER', payload: Partial<ActiveUser> };

export const initialState: AuthContextTypeWithoutMethods = {
    status: 'pending'
}

export function authReducer(state: AuthContextTypeWithoutMethods, action: AuthAction) {
    const { type } = action;

    switch (type) {
        case 'SET_AS_VALID': {
            const newState: AuthContextTypeWithoutMethods = {
                status: 'valid',
                user: {
                    ...action.payload
                }
            }

            return newState;
        }

        case 'SET_AS_PRE_VALID': {
            const newState: AuthContextTypeWithoutMethods = {
                status: 'pre-valid',
                user: { ...action.payload }
            }

            return newState;
        }

        case 'SET_AS_INVALID': {
            const newState: AuthContextTypeWithoutMethods = {
                status: 'invalid'
            }

            return newState;
        }

        case 'SET_AS_PENDING': {
            const newState: AuthContextTypeWithoutMethods = {
                status: 'pending'
            }

            return newState;
        }

        case 'UPDATE_USER': {
            if (state.status !== 'valid') return state;

            const newState: AuthContextTypeWithoutMethods = {
                status: 'valid',
                user: {
                    ...state.user,
                    ...action.payload
                }
            };

            return newState;
        }

        default: return state;
    }
}
