import { create } from 'zustand';
import type { ToastStore, ToastData } from '@shared/types/global.types';

let toastIdCounter = 0;

const generateId = () => `toast-${++toastIdCounter}`;

export const useToastStore = create<ToastStore>((set) => ({
    toasts: [],

    addToast: (toast) => {
        const newToast: ToastData = {
            ...toast,
            id: generateId()
        };
        set((state) => ({
            toasts: [newToast, ...state.toasts]
        }));
    },

    removeToast: (id) => {
        set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id)
        }));
    },

    clearAll: () => {
        set({ toasts: [] });
    }
}));