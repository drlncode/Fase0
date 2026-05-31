import { useEffect } from 'react';
import { useAuthReducer } from '@auth/hooks/useAuthReducer';
import { AuthContext } from '@auth/contexts/authContext';
import { useLocalStorage } from '@shared/hooks/useLocalStorage';
import { FullScreenLoader } from '@shared/components/FullScreenLoader';
import { SESSION_KEY } from '@auth/constants/auth.constants';

export function AuthContextProvider({ children }: {
    children: React.ReactNode
}) {
    const { checkSession, setAsInvalid, isVerifying, ...context } = useAuthReducer();
    const { getItem } = useLocalStorage();
    const contextStatus = context.status;

    useEffect(() => {
        if (contextStatus !== 'pending' || isVerifying) return;

        const session = getItem(SESSION_KEY);
        if (!session) return setAsInvalid();

        checkSession({ session });
    }, [
        contextStatus,
        isVerifying,
        getItem,
        checkSession,
        setAsInvalid
    ]);

    return (
        <AuthContext value={ context }>
            { contextStatus === 'pending' && <FullScreenLoader /> }
            { children }
        </AuthContext>
    );
}
