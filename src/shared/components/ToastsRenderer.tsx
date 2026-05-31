import { createPortal } from 'react-dom';
import { useToastStore } from '@shared/store/useToastStore';
import { Toast } from '@shared/components/Toast';

export function ToastsRenderer() {
    const toasts = useToastStore((state) => state.toasts);

    if (toasts.length === 0) return null;

    return createPortal(
        <div
            className='pointer-events-none fixed inset-0 z-9999 flex flex-col items-end justify-start gap-2 p-4'
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
