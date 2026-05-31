import { useModalStore } from '@shared/store/useModalStore';
import { CrossIcon } from '@/shared/components/ui/Icons';
import { cn } from '@shared/utils/cn';

import type { InfoModalProps } from '@shared/types/global.types';

interface InfoModalComponentProps extends InfoModalProps {
    id: string;
}

export function InfoModal({
    title,
    content,
    fullWidth = false
}: InfoModalComponentProps) {
    const close = useModalStore(state => state.close);

    return (
        <div className='flex h-full w-full cursor-default items-center justify-center'>
            <div
                role='dialog'
                aria-modal='true'
                aria-labelledby='modal-title'
                className={cn(
                    'animate-modal-enter relative flex flex-col gap-4 rounded-lg border border-default bg-overlay p-6 shadow-lg',
                    !fullWidth && 'max-w-md min-w-72'
                )}
            >
                <button
                    type='button'
                    onClick={close}
                    className={cn(
                        'absolute top-3 right-3 cursor-pointer rounded-md p-1 text-secondary transition-colors select-none',
                        'hover:bg-subtle'
                    )}
                    aria-label='Cerrar'
                >
                    <CrossIcon size={20} />
                </button>
                {title && (
                    <h2 id='modal-title' className='pr-6 text-lg font-semibold text-primary'>
                        {title}
                    </h2>
                )}
                <div className='pr-6'>
                    {content}
                </div>
            </div>
        </div>
    );
}