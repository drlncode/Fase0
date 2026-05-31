import { AUTH_FLOW_STEPS } from '@auth/constants/authFlow.constants';
import type { ActiveUser } from '@users/types/user.types';

// * AuthContext Types
export type AuthStatus = 'valid' | 'pre-valid' | 'invalid' | 'pending';

export type SignInParams = InitPwRecoveryParams & {
    password: string;
}

export type SignUpParams = SignInParams & {
    name: string;
    username: string;
}

export type SignOutParams = {
    session: string;
}

export type IsEmailAvailableParams = {
    email: string;
}

export type IsEmailAvailableReturn =
    | { success: true, isAvailable: boolean }
    | { success: false, error: string | { status: number, message: string } };

export type InitPwRecoveryParams = {
    email: string;
}

export type VerifyPwRecoveryCodeParams = {
    code: number;
}

export type RecoverPwParams = VerifyPwRecoveryCodeParams & Pick<SignInParams, 'password'>;

export type AuthHookMethodsReturn = 
    | { success: true }
    | { success: false, error: string | { status: number, message: string } };

export type AuthValidUser = ActiveUser & {
    session: string
}

export type AuthValid = {
    status: 'valid';
    user: AuthValidUser;
    signout: ({ session }: SignOutParams) => Promise<AuthHookMethodsReturn>;
    resetGlobalState: () => void;
    updateUser: (payload: Partial<ActiveUser>) => void;
};

export type AuthValidWithoutMethods = Omit<AuthValid, 'signout' | 'resetGlobalState' | 'updateUser'>;

export type AuthInvalid = {
    status: 'invalid';
    signin: ({ email, password }: SignInParams) => Promise<AuthHookMethodsReturn>;
    signup: ({ name, username, email, password }: SignUpParams) => Promise<AuthHookMethodsReturn>;
    isEmailAvailable: ({ email }: IsEmailAvailableParams) => Promise<IsEmailAvailableReturn>;
    initPwRecovery: ({ email }: InitPwRecoveryParams) => Promise<AuthHookMethodsReturn>;
    verifyPwRecoveryCode: ({ code }: VerifyPwRecoveryCodeParams) => Promise<AuthHookMethodsReturn>;
    recoverPw: ({ code, password }: RecoverPwParams) => Promise<AuthHookMethodsReturn>;
    resetGlobalState: () => void;
};

export type AuthInvalidWithoutMethods = Pick<AuthInvalid, 'status'>;

export type AuthPreValid = {
    status: 'pre-valid';
    user: {
        session: string;
    }
    resetGlobalState: () => void;
}

export type AuthPreValidWithoutMethods = Omit<AuthPreValid, 'signout' | 'resetGlobalState'>;

export type AuthPending = {
    status: 'pending';
    resetGlobalState: () => void;
};

export type AuthPendingWithoutMethods = Omit<AuthPending, 'resetGlobalState'>;

export type AuthContextType = 
    | AuthValid
    | AuthInvalid
    | AuthPreValid
    | AuthPending;

export type AuthContextTypeWithoutMethods = 
    | AuthValidWithoutMethods
    | AuthInvalidWithoutMethods
    | AuthPreValidWithoutMethods
    | AuthPendingWithoutMethods;

// * AuthFlowContext Types

export type AuthFlowStep = typeof AUTH_FLOW_STEPS[number];

export interface AuthFlowContextState {
    step: AuthFlowStep;
    code?: number;
    email?: string;
}

export interface AuthFlowContextMethods {
    goToStep: (step: AuthFlowStep) => void;
    setEmail: (email: string) => void;
    setCode: (code: number) => void;
}

export type AuthFlowContextType = AuthFlowContextState & AuthFlowContextMethods;
