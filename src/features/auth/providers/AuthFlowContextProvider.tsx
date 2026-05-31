import { useAuth } from '@auth/hooks/useAuth';
import { useAuthFlowReducer } from '@auth/hooks/useAuthFlowReducer';
import { AuthFlowContext } from '@auth/contexts/authFlowContext';

export function AuthFlowContextProvider({ children }: { children: React.ReactNode }) {
    const { status } = useAuth();
    const initialStep = status === 'pre-valid' ? 'confirm' : 'email-input';
    const ctxValue = useAuthFlowReducer(initialStep);

    return (
        <AuthFlowContext value={ ctxValue }>
            { children }
        </AuthFlowContext>
    );
}
