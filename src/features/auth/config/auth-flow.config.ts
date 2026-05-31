import { lazy, type JSX } from 'react';
import type { AuthFlowStep } from '@auth/types/auth.types';

const ReceiveEmailForm = lazy(() => import('@auth/components/ReceiveEmailForm'));
const LoginForm = lazy(() => import('@auth/components/LoginForm'));
const RegisterForm = lazy(() => import('@auth/components/RegisterForm'));
const ConfirmSession = lazy(() => import('@auth/components/ConfirmSession'));
const PasswordRecoveryForm = lazy(() => import('@auth/components/PasswordRecoveryForm'));
const SuccessfullAuthConfirmation = lazy(() => import('@auth/components/SuccessfullAuthConfirmation'));
const PwResetSuccess = lazy(() => import('@auth/components/password-recovery/PasswordResetSuccess'));

export const AUTH_FLOW_COMPONENTS: Record<AuthFlowStep, React.LazyExoticComponent<() => JSX.Element | null>> = {
    'email-input': ReceiveEmailForm,
    'login': LoginForm,
    'register': RegisterForm,
    'pw-recovery-init': PasswordRecoveryForm,
    'pw-recovery-code-verify': PasswordRecoveryForm,
    'pw-reset': PasswordRecoveryForm,
    'pw-reset-success': PwResetSuccess,
    'confirm': ConfirmSession,
    'done': SuccessfullAuthConfirmation,
}
