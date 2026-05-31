import { create } from 'zustand';
import type { ModalData, ModalStore } from '@shared/types/global.types';

let modalIdCounter = 0;

const generateId = () => `modal-${++modalIdCounter}`;

export const useModalStore = create<ModalStore>((set, get) => ({
    modals: [],

    open: (modal) => {
        const newModal = {
            ...modal,
            id: generateId()
        } as ModalData;
        set((state) => ({
            modals: [...state.modals, newModal]
        }));
    },

    close: () => {
        const { modals } = get();
        const lastModal = modals[modals.length - 1];
        lastModal?.onDismiss?.();
        set((state) => ({
            modals: state.modals.slice(0, -1)
        }));
    },

    closeAll: () => {
        const { modals } = get();
        modals.forEach((modal) => modal.onDismiss?.());
        set({ modals: [] });
    }
}));