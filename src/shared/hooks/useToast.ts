import { useToastStore } from '@shared/store/useToastStore';
import type { ToastType } from '@shared/types/global.types';

export function useToast() {
    const addToast = useToastStore((state) => state.addToast);

    function toast(type: ToastType, message: string) {
        addToast({ type, message });
    }

    return {
        success: (message: string) => toast('success', message),
        danger: (message: string) => toast('danger', message),
        info: (message: string) => toast('info', message)
    };
}