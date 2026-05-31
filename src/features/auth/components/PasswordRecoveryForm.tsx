import { useAuthFlow } from '@auth/hooks/useAuthFlow';
import { usePasswordRecoveryFlow } from '@auth/hooks/usePasswordRecoveryFlow';
import { FormContainer } from '@auth/components/FormContainer';
import { EmailStep, CodeStep, PasswordStep } from '@auth/components/password-recovery';

const STEP_CONFIG = {
    'pw-recovery-init': {
        title: 'Recuperar contraseña',
        label: 'Ingrese su correo electrónico para recuperar su cuenta.'
    },
    'pw-recovery-code-verify': {
        title: 'Verificar código',
        label: 'Ingrese el código que se le envió a su correo.'
    },
    'pw-reset': {
        title: 'Nueva contraseña',
        label: 'Cree una nueva contraseña para su cuenta.'
    }
} as const;

export default function PasswordRecoveryForm() {
    const { goToStep } = useAuthFlow();
    const { step, forms, actions, states } = usePasswordRecoveryFlow();

    const config = STEP_CONFIG[step as keyof typeof STEP_CONFIG];

    if (!config) return null;

    const showBackButton = step !== 'done';

    return (
        <FormContainer
            title={config.title}
            label={config.label}
            backButton={showBackButton ? { label: 'Cancelar', handleBack: () => goToStep('login') } : undefined}
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
