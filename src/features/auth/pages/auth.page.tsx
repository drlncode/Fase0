import { useAuthFlow } from '@auth/hooks/useAuthFlow';
import { AUTH_FLOW_COMPONENTS } from '@auth/config/auth-flow.config';
import type { AuthFlowStep } from '@auth/types/auth.types';

const AUTH_STEP_TITLES: Record<AuthFlowStep, string> = {
    'email-input': 'Ingresar email',
    'login': 'Iniciar sesión',
    'register': 'Registrarse',
    'pw-recovery-init': 'Recuperar contraseña',
    'pw-recovery-code-verify': 'Verificar código',
    'pw-reset': 'Nueva contraseña',
    'pw-reset-success': 'Contraseña restablecida',
    'confirm': 'Confirmar sesión',
    'done': 'Sesión confirmada',
};

export default function AuthPage() {
    const { step } = useAuthFlow();
    const StepComponent = AUTH_FLOW_COMPONENTS[step];

    return (
        <div>
            <title>{`${AUTH_STEP_TITLES[step]} | Fase0`}</title>
            <StepComponent />
        </div>
    );
}
