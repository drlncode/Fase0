import { ActionHookState } from '@shared/types/global.types';
import { SpinLoader } from '@shared/components/ui/SpinLoader';
import { CheckIcon, CrossIcon } from '@/shared/components/ui/Icons';
import { cn } from '@/shared/utils/cn';

export function UsernameAvailability({ state, currentLenght }: {
    state: ActionHookState<{ isAvailable: boolean }>,
    currentLenght: number
}) {
    if (currentLenght < 4 || state.status === 'idle') return null;

    const color = cn(
        state.status === 'error' && 'text-red-500',
        state.status === 'success' && state.data.isAvailable && 'text-green-500',
        state.status === 'success' && !state.data.isAvailable && 'text-red-500'
    );

    return (
        <div className={cn('flex items-center gap-1 text-[13px]', color)}>
            <div>
                { state.status === 'loading' && <SpinLoader size={18} /> }
                { state.status === 'error' && <CrossIcon size={18} /> }
                { state.status === 'success' && state.data.isAvailable && <CheckIcon size={18} /> }
                { state.status === 'success' && !state.data.isAvailable && <CrossIcon size={18} /> }
            </div>
            <div>
                <span>
                    { state.status === 'loading' && 'Verificando disponibilidad...' }
                    { state.status === 'error' && state.message }
                    { state.status === 'success' && state.data.isAvailable && 'Nombre de usuario disponible.' }
                    { state.status === 'success' && !state.data.isAvailable && 'Nombre de usuario no disponible.' }
                </span>
            </div>
        </div>
    );
}
