import { isAxiosError } from 'axios';
import api from '@/lib/axios';

import type { ServiceResponse } from '@shared/types/global.types';
import type {
    InitPwRecoveryParams,
    RecoverPwParams,
    SignInParams,
    SignUpParams,
    VerifyPwRecoveryCodeParams
} from '@auth/types/auth.types';
import type {
    ActiveUser
} from '@users/types/user.types';

type SignInReturnData = {
    data: { sessionId: string }
}

class AuthApiService {
    async authVerifySession({ session }: {
        session: string
    }): Promise<ServiceResponse<ActiveUser>> {
        try {
            const { data: { data } } = await api.post<{ data: { user: ActiveUser } }>('/auth/verify-session', null, {
                headers: {
                    Authorization: `Bearer ${session}`
                }
            });

            return {
                success: true,
                data: data.user
            }
        } catch (error) {
            if (isAxiosError(error)) return {
                success: false,
                error
            }

            console.error('An unexpected error occurred in authVerifySession:', error);
        }

        return {
            success: false
        }
    }

    async authVerifyEmailExistence({ email }: {
        email: string;
    }): Promise<ServiceResponse<{ isAvailable: boolean }>> {
        try {
            const { data: { data } } = await api.post<{ data: { isAvailable: boolean } }>(
                '/auth/availability/email',
                { email }
            );

            return {
                success: true,
                data: {
                    isAvailable: data.isAvailable
                }
            }
        } catch (error) {
            if (isAxiosError(error)) return {
                success: false,
                error
            }

            console.error('An unexpected error occurred while checking email availability:', error);
        }

        return {
            success: false
        }
    }

    async authSignIn({ email, password }:
        SignInParams
    ): Promise<ServiceResponse<SignInReturnData['data']>> {
        try {
            const response = await api.post<SignInReturnData>('/auth/signin', {
                email,
                password
            });
            const { data } = response.data;

            return {
                success: true,
                data
            }
        } catch (error) {
            if (isAxiosError(error)) return {
                success: false,
                error
            }

            console.error('An unexpected error occurred in authSignIn:', error);
        }

        return {
            success: false
        }
    }

    async authSignUp({ name, username, email, password }:
        SignUpParams
    ): Promise<ServiceResponse<SignInReturnData['data']>> {
        try {
            const response =await api.post('/auth/signup', {
                name,
                username,
                email,
                password
            });

            const { data } = response.data;

            return {
                success: true,
                data
            }
        } catch (error) {
            if (isAxiosError(error)) return {
                success: false,
                error
            }

            console.error('An unexpected error occurred in authSignUp:', error);
        }

        return {
            success: false
        }
    }

    async authSignOut({ session }: {
        session: string;
    }): Promise<ServiceResponse<null>> {
        try {
            await api.post('/auth/signout', null, {
                headers: {
                    Authorization: `Bearer ${session}`
                }
            });

            return {
                success: true,
                data: null
            }
        } catch (error) {
            if (isAxiosError(error)) return {
                success: false,
                error
            }

            console.error('An unexpected error occurred in authSignOut', error);
        }

        return {
            success: false
        }
    }

    async authConfirmSession({ code, session }: {
        code: number;
        session: string;
    }): Promise<'OK'> {
        await api.post('/auth/refresh-session', { code }, {
            headers: {
                Authorization: `Bearer ${session}`
            }
        });

        return 'OK';
    }

    async authInitPasswordRecovery({ email }:
        InitPwRecoveryParams
    ): Promise<void> {
        await api.post('/auth/password-recovery', { email });
    }

    async authVerifyPasswordRecoveryCode({ code }:
        VerifyPwRecoveryCodeParams
    ): Promise<void> {
        await api.post('/auth/password-recovery/validate', { code });
    }

    async authRecoverPassword({ code, password }:
        RecoverPwParams
    ): Promise<void> {
        await api.post('/auth/password-recovery/reset', {
            code,
            password
        });
    }
}

export const authApiService = new AuthApiService();
