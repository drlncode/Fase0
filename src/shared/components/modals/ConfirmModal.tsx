import { useState } from 'react';
import { useModalStore } from '@shared/store/useModalStore';
import { CrossIcon } from '@/shared/components/ui/Icons';
import { cn } from '@shared/utils/cn';
import { SpinLoader } from '@shared/components/ui/SpinLoader';

import type { ConfirmModalProps, ModalData } from '@shared/types/global.types';

interface ConfirmModalComponentProps extends ConfirmModalProps {
    id: string;
}

export function ConfirmModal({
    id,
    title,
    message,
    danger = false,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    awaitedAction = false,
    fullWidth = false
}: ConfirmModalComponentProps) {
    const [ isWaiting, setIsWaiting ] = useState(false);
    const close = useModalStore(state => state.close);
    const modals = useModalStore(state => state.modals);
    const modal = modals.find(m => m.id === id) as Extract<ModalData, { type: 'confirm' }>;

    const handleConfirm = async () => {
        if (awaitedAction) {
            setIsWaiting(true);
            await modal.onConfirm();
            modal.onSuccess?.();
            close();
            setIsWaiting(false);
        } else {
            modal.onConfirm();
            modal.onSuccess?.();
            close();
        }
    };

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
                    disabled={isWaiting}
                    className={cn(
                        'absolute top-3 right-3 cursor-pointer rounded-md p-1 text-secondary transition-colors select-none',
                        'hover:bg-subtle',
                        'disabled:cursor-not-allowed disabled:opacity-50'
                    )}
                    aria-label='Cerrar'
                >
                    <CrossIcon size={20} />
                </button>
                <div className='flex flex-col gap-2 pr-6'>
                    <h2 id='modal-title' className='text-lg font-semibold text-primary'>
                        {title}
                    </h2>
                    <p className='text-sm text-secondary'>{message}</p>
                </div>
                <div className='flex justify-end gap-2'>
                    <button
                        type='button'
                        onClick={close}
                        disabled={isWaiting}
                        className={cn(
                            'min-w-22.5 cursor-pointer rounded-md px-4 py-2 text-left text-sm text-secondary transition-colors select-none',
                            'hover:bg-subtle',
                            'disabled:cursor-not-allowed disabled:opacity-50'
                        )}
                    >
                        {cancelText}
                    </button>
                    <button
                        type='button'
                        onClick={handleConfirm}
                        className={cn(
                            'flex min-w-22.5 cursor-pointer items-center justify-center gap-1.5 rounded-md px-4 py-2 text-left text-sm font-medium transition-colors select-none',
                            'disabled:cursor-not-allowed disabled:opacity-50',
                            danger
                                ? 'bg-red-800/20 text-danger hover:bg-red-800/40'
                                : 'bg-subtle text-primary hover:opacity-80'
                        )}
                        disabled={isWaiting}
                    >
                        {confirmText}
                        {isWaiting && <SpinLoader size={20} className='ml-2 text-white' />}
                    </button>
                </div>
            </div>
        </div>
    );
}
