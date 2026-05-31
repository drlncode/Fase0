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
    { session }: { session: string },
    dispatch: DispatchType,
    storage: StorageType
): Promise<AuthHookMethodsReturn> {
    const result = await authApiService.authSignOut({ session });

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

export async function refreshUserSession({ session, code }: {
    session: string;
    code: number;
}): Promise<AuthHookMethodsReturn> {
    try {
        await authApiService.authConfirmSession({ session, code });

        return {
            success: true
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            const { status } = error.response;

            if (status === 400) return {
                success: false,
                error: 'Código de confirmación inválido.'
            }
        }
    }

    return {
        success: false,
        error: 'No se pudo confirmar la sesión.'
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
            message: 'No se pudo verificar la disponibilidad del correo.'
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
                error: 'Error: Algo salió mal al iniciar la recuperación.'
            }
        }
    }

    return {
        success: false,
        error: 'Error: No se pudo iniciar la recuperación.'
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
                error: 'El formato del codigo es incorrecto.'
            }

            if (error.status === 422) return {
                success: false,
                error: 'El código de recuperación no es válido.'
            }
        }
    }

    return {
        success: false,
        error: 'Error: No se pudo verificar la validez del codigo.'
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
                error: 'El formato de la contraseña es incorrecto.'
            }

            if (error.status === 422) return {
                success: false,
                error: 'Código de recuperación no válido.'
            }
        }
    }

    return {
        success: false,
        error: 'Error: No se pudo restablecer la contraseña.'
    }
};
