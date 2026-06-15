import i18n from '@/lib/i18n';
import { useLocalStorage } from '@shared/hooks/useLocalStorage';
import { authApiService } from '@auth/services/auth.service';
import { getErrorObject } from '../utils/getErrorObject';
import { SESSION_KEY } from '@auth/constants/auth.constants';
import { useAvatarCacheStore } from '@shared/store/useAvatarCacheStore';
import { useChatStore } from '@chats/store/useChatStore';
import { useMessageStore } from '@messages/store/useMessageStore';
import { useFriendsStore } from '@friends/store/useFriendsStore';
import { useModalStore } from '@shared/store/useModalStore';
import { useToastStore } from '@shared/store/useToastStore';
import { useDropdownStore } from '@shared/store/useDropdownStore';
import { resetSocket } from '@/lib/socket';

import type {
    AuthHookMethodsReturn,
    InitPwRecoveryParams,
    RecoverPwParams,
    SignInParams,
    SignUpParams,
    IsEmailAvailableParams,
    VerifyPwRecoveryCodeParams,
    IsEmailAvailableReturn
} from '@auth/types/auth.types';
import type { AuthAction } from '@auth/reducers/auth.reducer';
import { isAxiosError } from 'axios';

type DispatchType = React.ActionDispatch<[action: AuthAction]>;
type StorageType = ReturnType<typeof useLocalStorage>;

export async function signin(
    params: SignInParams,
    dispatch: DispatchType,
    storage: StorageType
): Promise<AuthHookMethodsReturn> {
    const result = await authApiService.authSignIn(params);

    if (!result.success) {
        const { error } = result;

        if (!error) return {
            success: false,
            error: getErrorObject(error).error
        }

        return {
            success: false,
            error: {
                status: error.status!,
                message: getErrorObject(error).error
            }
        };
    }

    const { sessionId } = result.data;

    storage.setItem(SESSION_KEY, sessionId);

    dispatch({
        type: 'SET_AS_PENDING'
    });

    return {
        success: true
    }
};

export async function signup(
    params: SignUpParams,
    dispatch: DispatchType,
    storage: StorageType
): Promise<AuthHookMethodsReturn> {
    const creationResult = await authApiService.authSignUp(params);

    if (!creationResult.success) {
        const { error } = creationResult;
        return getErrorObject(error);
    }

    const { sessionId } = creationResult.data;

    storage.setItem(SESSION_KEY, sessionId);

    dispatch({
        type: 'SET_AS_PENDING'
    });

    return {
        success: true
    }
};

export async function signout(
    dispatch: DispatchType,
    storage: StorageType
): Promise<AuthHookMethodsReturn> {
    const result = await authApiService.authSignOut();

    if (!result.success) {
        const { error } = result;
        return getErrorObject(error);
    }

    storage.clearItem(SESSION_KEY);
    useAvatarCacheStore.getState().clearAll();
    useChatStore.getState().reset();
    useMessageStore.getState().reset();
    useFriendsStore.getState().reset();
    useModalStore.getState().closeAll();
    useToastStore.getState().clearAll();
    useDropdownStore.getState().close();
    resetSocket();
    dispatch({ type: 'SET_AS_PENDING' });

    return {
        success: true
    }
};

export async function refreshUserSession({ code }: {
    code: number;
}): Promise<AuthHookMethodsReturn> {
    try {
        await authApiService.authConfirmSession({ code });

        return {
            success: true
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            const { status } = error.response;

            if (status === 400) return {
                success: false,
                error: i18n.t('errors.invalidCode', { ns: 'auth' })
            }
        }
    }

    return {
        success: false,
        error: i18n.t('errors.confirmSessionFailed', { ns: 'auth' })
    }
}

export async function isEmailAvailable({ email }: IsEmailAvailableParams): Promise<IsEmailAvailableReturn> {
    const result = await authApiService.authVerifyEmailExistence({ email });

    if (!result.success) {
        if (result.error) {
            const { error } = result;

            return getErrorObject(error);
        }
    }

    if (result.success) return {
        success: true,
        isAvailable: result.data.isAvailable
    }

    return {
        success: false,
        error: {
            status: 500,
            message: i18n.t('errors.emailAvailabilityFailed', { ns: 'auth' })
        }
    }
};

export async function initPwRecovery({ email }: InitPwRecoveryParams): Promise<AuthHookMethodsReturn> {
    try {
        await authApiService.authInitPasswordRecovery({ email });

        return {
            success: true
        }
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                success: false,
                error: i18n.t('errors.initRecoveryFailed', { ns: 'auth' })
            }
        }
    }

    return {
        success: false,
        error: i18n.t('errors.initRecoveryFailed', { ns: 'auth' })
    }
};

export async function verifyPwRecoveryCode({ code }: VerifyPwRecoveryCodeParams): Promise<AuthHookMethodsReturn> {
    try {
        await authApiService.authVerifyPasswordRecoveryCode({ code });

        return {
            success: true
        }
    } catch (error) {
        if (isAxiosError(error)) {
            if (error.status === 400) return {
                success: false,
                error: i18n.t('errors.invalidRecoveryCodeFormat', { ns: 'auth' })
            }

            if (error.status === 422) return {
                success: false,
                error: i18n.t('errors.invalidRecoveryCode', { ns: 'auth' })
            }
        }
    }

    return {
        success: false,
        error: i18n.t('errors.verifyRecoveryFailed', { ns: 'auth' })
    }
};

export async function recoverPw({ code, password }: RecoverPwParams): Promise<AuthHookMethodsReturn> {
    try {
        await authApiService.authRecoverPassword({ code, password });

        return {
            success: true
        }
    } catch (error) {
        if (isAxiosError(error)) {
            if (error.status === 400) return {
                success: false,
                error: i18n.t('errors.invalidPasswordFormat', { ns: 'auth' })
            }

            if (error.status === 422) return {
                success: false,
                error: i18n.t('errors.invalidRecoveryCode', { ns: 'auth' })
            }
        }
    }

    return {
        success: false,
        error: i18n.t('errors.recoveryFailed', { ns: 'auth' })
    }
};
