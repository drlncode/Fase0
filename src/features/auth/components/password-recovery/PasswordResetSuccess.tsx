import { useEffect, useState } from 'react';
import { useAuthFlow } from '@auth/hooks/useAuthFlow';
import { CheckIcon } from '@/shared/components/ui/Icons';
import { SpinLoader } from '@shared/components/ui/SpinLoader';

export default function PasswordResetSuccess() {
    const [ countdown, setCountdown ] = useState(3);
    const { goToStep } = useAuthFlow();

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCountdown(prev => prev - 1);

            if (countdown <= 1) {
                goToStep('login');
            }
        }, 1000);

        return () => clearInterval(intervalId);
    });

    return (
        <div className='flex w-screen flex-col items-center'>
            <div className='flex w-full max-w-sm flex-col items-center gap-6 text-center'>
                <img src="/fase0-logo-white.svg" alt="Fase0 logo" width="100" />

                <div className='flex flex-col items-center gap-2'>
                    <h1 className='text-2xl font-bold text-primary'>Contraseña cambiada exitosamente.</h1>
                    <p className='text-muted'>Ya puedes iniciar sesión con tu nueva contraseña.</p>
                </div>

                <CheckIcon size={36} />

                <div className='flex items-center gap-2 text-sm text-muted'>
                    <SpinLoader size={18} />
                    <span>Redirigiendo en... {countdown}</span>
                </div>
            </div>
        </div>
    );
}
