import { useEffect, useRef, useState } from 'react';
import { useToastStore } from '@shared/store/useToastStore';
import { CheckIcon, CrossIcon, InfoIcon } from '@/shared/components/ui/Icons';
import { cn } from '@shared/utils/cn';
import type { ToastData } from '@shared/types/global.types';

const TOAST_DURATION = 5000;
const FADE_OUT_DURATION = 300;

const toastConfig = {
    success: { icon: CheckIcon, iconColor: 'text-[var(--color-success)]' },
    danger:  { icon: CrossIcon, iconColor: 'text-[var(--color-danger)]' },
    info:    { icon: InfoIcon,  iconColor: 'text-[var(--color-info)]' },
} as const;

interface ToastProps {
    toast: ToastData;
}

export function Toast({ toast }: ToastProps) {
    const removeToast = useToastStore((state) => state.removeToast);
    const { icon: Icon, iconColor } = toastConfig[toast.type];

    const [isExiting, setIsExiting]   = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isTruncated, setIsTruncated] = useState(false);
    const messageRef = useRef<HTMLButtonElement>(null);

    // Auto-dismiss
    useEffect(() => {
        const id = setTimeout(() => {
            setIsExiting(true);
            setTimeout(() => removeToast(toast.id), FADE_OUT_DURATION);
        }, TOAST_DURATION);
        return () => clearTimeout(id);
    }, [toast.id, removeToast]);

    // Detect truncation only in collapsed state
    useEffect(() => {
        if (isExpanded || !messageRef.current) return;
        const { scrollWidth, clientWidth } = messageRef.current;
        setIsTruncated(scrollWidth > clientWidth);
    }, [toast.message, isExpanded]);

    const handleDismiss = () => {
        setIsExiting(true);
        setTimeout(() => removeToast(toast.id), FADE_OUT_DURATION);
    };

    return (
        <div
            role='alert'
            className={cn(
                'pointer-events-auto flex w-80 shrink-0 items-start gap-2.5',
                'rounded-lg border border-default bg-overlay px-3.5 py-3',
                'opacity-95 shadow-dropdown',
                isExiting ? 'animate-toast-exit' : 'animate-toast-enter'
            )}
        >
            {/* Icono — shrink-0 + mt para alinearse con la primera línea de texto */}
            <span className={cn('mt-px mr-1.5 flex h-full shrink-0 items-center justify-center', iconColor)}>
                <Icon size={20} />
            </span>

            {/* Área de contenido */}
            <div className='flex min-w-0 flex-1 flex-col'>
                <button
                    ref={messageRef}
                    type='button'
                    onClick={() => isTruncated && setIsExpanded((prev) => !prev)}
                    className={cn(
                        'w-full min-w-0 text-left text-sm text-primary hover:cursor-pointer',
                        isTruncated ? 'cursor-pointer' : 'cursor-default select-text',
                        isExpanded
                            ? 'wrap-break-word whitespace-pre-wrap'
                            : 'truncate'
                    )}
                    aria-expanded={isTruncated ? isExpanded : undefined}
                >
                    {toast.message}
                </button>

                {isTruncated && !isExpanded && (
                    <button
                        className='mt-0.5 self-start text-xs text-secondary hover:cursor-pointer'
                        onClick={() => isTruncated && setIsExpanded((prev) => !prev)}
                    >
                        Click para ver más
                    </button>
                )}
            </div>

            {/* Botón cerrar — shrink-0 + mt para alinearse con el texto */}
            <button
                type='button'
                onClick={handleDismiss}
                aria-label='Cerrar notificación'
                className={cn(
                    'mt-px ml-1.5 flex h-full shrink-0 items-center justify-center rounded text-secondary'
                )}
            >
                <span className='rounded-md p-0.5 transition-colors duration-150 hover:cursor-pointer hover:bg-subtle hover:text-primary focus-visible:ring-2 focus-visible:ring-strong focus-visible:outline-none'>
                    <CrossIcon size={18} />
                </span>
            </button>
        </div>
    );
}
