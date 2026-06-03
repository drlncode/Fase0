import { useEffect, useState } from 'react';
import { usePreValidAuth } from '@auth/hooks/usePreValidAuth';
import { CheckIcon } from '@/shared/components/ui/Icons';
import { SpinLoader } from '@shared/components/ui/SpinLoader';

export default function SuccessfullAuthConfirmation() {
    const [ countdown, setCountdown ] = useState(3);
    const { resetGlobalState } = usePreValidAuth();

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCountdown(prev => prev - 1);

            if (countdown <= 1) {
                resetGlobalState();
            }
        }, 1000);

        return () => clearInterval(intervalId);
    });

    return (
        <div className='flex w-full flex-col items-center overflow-x-hidden'>
            <div className='flex w-full max-w-sm flex-col items-center gap-6 text-center'>

                <img src="/fase0-logo-white.svg" alt="Fase0 logo" width="100" />

                <div className='flex flex-col items-center gap-2'>
                    <h1 className='text-2xl font-bold text-primary'>Sesión confirmada exitosamente.</h1>
                    <p className='text-muted'>Bienvenido de vuelta.</p>
                </div>

                <CheckIcon size={36} />

                <div className='flex items-center gap-2 text-sm text-muted'>
                    <SpinLoader size={18} />
                    <span>Redirigiendo en... { countdown }</span>
                </div>

            </div>
        </div>
    );
}
