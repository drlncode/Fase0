import { useReducer, useState } from 'react';
import { useLocalStorage } from '@shared/hooks/useLocalStorage';
import { authReducer, initialState } from '@auth/reducers/auth.reducer';
import { authApiService } from '@auth/services/auth.service';
import { SESSION_KEY } from '@auth/constants/auth.constants';
import * as authActions from '@auth/lib/authActions';

import type {
    AuthContextType,
    SignInParams,
    SignUpParams,
    SignOutParams,
    InitPwRecoveryParams,
    VerifyPwRecoveryCodeParams,
    RecoverPwParams,
    IsEmailAvailableParams
} from '@auth/types/auth.types';
import type { ActiveUser } from '@users/types/user.types';

export type useAuthReducerReturnType = AuthContextType & {
    isVerifying: boolean;
    checkSession: (params: { session: string }) => Promise<void>;
    setAsInvalid: () => void;
};

export function useAuthReducer(): useAuthReducerReturnType {
    const [state, dispatch] = useReducer(authReducer, initialState);
    const [isVerifying, setIsVerifying] = useState(false);
    const storage = useLocalStorage();

    const setAsInvalid = () => dispatch({ type: 'SET_AS_INVALID' });
    const setAsPreValid = (session: string) => dispatch({ type: 'SET_AS_PRE_VALID', payload: { session } });
    const resetGlobalState = () => dispatch({ type: 'SET_AS_PENDING' });
    const updateUser = (payload: Partial<ActiveUser>) => dispatch({ type: 'UPDATE_USER', payload });

    const checkSession = async ({ session }: { session: string }) => {
        if (isVerifying) return;
        setIsVerifying(true);

        const result = await authApiService.authVerifySession({ session });

        if (!result.success) {
            if (!result.error || result.error.status === 401) {
                storage.clearItem(SESSION_KEY);
                setAsInvalid();
            }

            if (result.error && result.error.status === 403) {
                setAsPreValid(session);
            }
            
            setIsVerifying(false);
            
            throw new Error(
                result.error?.message || 'An error occurred while verifying the session.'
            );
        }

        dispatch({ type: 'SET_AS_VALID', payload: { ...result.data, session } });
        setIsVerifying(false);
    };

    const actions = {
        signin: (p: SignInParams) => authActions.signin(p, dispatch, storage),
        signup: (p: SignUpParams) => authActions.signup(p, dispatch, storage),
        signout: (p: SignOutParams) => authActions.signout(p, dispatch, storage),
        isEmailAvailable: (p: IsEmailAvailableParams) => authActions.isEmailAvailable(p),
        initPwRecovery: (p: InitPwRecoveryParams) => authActions.initPwRecovery(p),
        verifyPwRecoveryCode: (p: VerifyPwRecoveryCodeParams) => authActions.verifyPwRecoveryCode(p),
        recoverPw: (p: RecoverPwParams) => authActions.recoverPw(p)
    };

    switch (state.status) {
        case 'valid':
            return {
                status: 'valid',
                user: state.user,
                isVerifying,
                checkSession,
                setAsInvalid,
                signout: actions.signout,
                resetGlobalState,
                updateUser
            };

        case 'invalid':
            return {
                status: 'invalid',
                isVerifying,
                checkSession,
                setAsInvalid,
                resetGlobalState,
                ...actions
            };

        case 'pre-valid':
            return {
                status: 'pre-valid',
                user: state.user,
                isVerifying,
                checkSession,
                setAsInvalid,
                resetGlobalState
            };
            
        case 'pending':
        default: return {
            status: 'pending',
            isVerifying,
            checkSession,
            setAsInvalid,
            resetGlobalState
        };
    }
}
