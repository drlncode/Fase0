import { useContext } from 'react';
import { AuthContext } from '@auth/contexts/authContext';

export function usePreValidAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('You need a AuthContextProvider for use this hook: useAuth().');
    }

    if (context.status !== 'pre-valid') {
        throw new Error('usePreValidAuth only can be used with a pre-valid auth state.');
    }

    return context;
}
