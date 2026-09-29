import { createPortal } from 'react-dom';
import { useToastStore } from '@shared/store/useToastStore';
import { Toast } from '@shared/components/Toast';

export function ToastsRenderer() {
    const toasts = useToastStore((state) => state.toasts);

    if (toasts.length === 0) return null;

    return createPortal(
        <div
            className='pointer-events-none fixed inset-0 z-9999 flex flex-col items-center justify-start gap-2 p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-20 sm:items-end sm:justify-start sm:pb-4'
            aria-live='polite'
            aria-atomic='false'
        >
            {toasts.map((toast) => (
                <Toast key={toast.id} toast={toast} />
            ))}
        </div>,
        document.getElementById('modals-root')!
    );
}
