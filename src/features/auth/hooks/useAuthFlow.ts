import { useContext } from 'react';
import { AuthFlowContext } from '@auth/contexts/authFlowContext';

export function useAuthFlow() {
    const context = useContext(AuthFlowContext);

    if (!context) {
        throw new Error('You need a AuthFlowContextProvider for use this hook: useAuthFlow().');
    }

    return context;
}
