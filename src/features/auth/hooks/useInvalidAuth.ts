import { useContext } from 'react';
import { AuthContext } from '@auth/contexts/authContext';

export function useInvalidAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('You need a AuthContextProvider for use this hook: useAuth().');
    }

    if (context.status !== 'invalid') {
        throw new Error('useValidAuth only can be used with a invalid auth state.');
    }

    return context;
}
