import { useContext } from 'react';
import { AuthContext } from '@auth/contexts/authContext';

export function useValidAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('You need a AuthContextProvider for use this hook: useAuth().');
    }

    if (context.status !== 'valid') {
        throw new Error('useValidAuth only can be used with a valid auth state.');
    }

    return context;
}
