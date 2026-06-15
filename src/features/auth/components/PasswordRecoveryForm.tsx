import { useTranslation } from 'react-i18next';
import { useAuthFlow } from '@auth/hooks/useAuthFlow';
import { usePasswordRecoveryFlow } from '@auth/hooks/usePasswordRecoveryFlow';
import { FormContainer } from '@auth/components/FormContainer';
import { EmailStep, CodeStep, PasswordStep } from '@auth/components/password-recovery';

const STEP_CONFIG: Record<string, { titleKey: string; labelKey: string }> = {
    'pw-recovery-init': {
        titleKey: 'pwRecovery.init.title',
        labelKey: 'pwRecovery.init.label'
    },
    'pw-recovery-code-verify': {
        titleKey: 'pwRecovery.codeVerify.title',
        labelKey: 'pwRecovery.codeVerify.label'
    },
    'pw-reset': {
        titleKey: 'pwRecovery.reset.title',
        labelKey: 'pwRecovery.reset.label'
    }
};

export default function PasswordRecoveryForm() {
    const { t } = useTranslation('auth');
    const { goToStep } = useAuthFlow();
    const { step, forms, actions, states } = usePasswordRecoveryFlow();

    const config = STEP_CONFIG[step];

    if (!config) return null;

    const showBackButton = step !== 'done';

    return (
        <FormContainer
            title={t(config.titleKey)}
            label={t(config.labelKey)}
            backButton={showBackButton ? { label: t('pwRecovery.cancel'), handleBack: () => goToStep('login') } : undefined}
        >
            {step === 'pw-recovery-init' && (
                <EmailStep
                    form={forms.email}
                    state={states.init}
                    onSubmit={actions.initRecovery}
                />
            )}

            {step === 'pw-recovery-code-verify' && (
                <CodeStep
                    form={forms.code}
                    state={states.verify}
                    onSubmit={actions.verifyCode}
                />
            )}

            {step === 'pw-reset' && (
                <PasswordStep
                    form={forms.password}
                    state={states.recover}
                    code={Number(forms.code.getValues('code'))}
                    onSubmit={actions.resetPassword}
                />
            )}
        </FormContainer>
    );
}
