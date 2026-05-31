import { useContext } from 'react';
import { AuthContext } from '@auth/contexts/authContext';

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('You need a AuthContextProvider for use this hook: useAuth().');
    }

    return context;
}
