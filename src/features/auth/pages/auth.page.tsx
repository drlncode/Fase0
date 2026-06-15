import { useTranslation } from 'react-i18next';
import { useAuthFlow } from '@auth/hooks/useAuthFlow';
import { AUTH_FLOW_COMPONENTS } from '@auth/config/auth-flow.config';
import type { AuthFlowStep } from '@auth/types/auth.types';

const STEP_TITLE_KEYS: Record<AuthFlowStep, string> = {
    'email-input': 'stepTitles.emailInput',
    'login': 'stepTitles.login',
    'register': 'stepTitles.register',
    'pw-recovery-init': 'stepTitles.pwRecoveryInit',
    'pw-recovery-code-verify': 'stepTitles.pwRecoveryCodeVerify',
    'pw-reset': 'stepTitles.pwReset',
    'pw-reset-success': 'stepTitles.pwResetSuccess',
    'confirm': 'stepTitles.confirm',
    'done': 'stepTitles.done',
};

export default function AuthPage() {
    const { t } = useTranslation('auth');
    const { step } = useAuthFlow();
    const StepComponent = AUTH_FLOW_COMPONENTS[step];

    return (
        <div>
            <title>{`${t(STEP_TITLE_KEYS[step])} | Fase0`}</title>
            <StepComponent />
        </div>
    );
}
