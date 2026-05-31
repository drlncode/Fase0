import { create } from 'zustand';

interface DropdownStore {
    openId: string | null;
    open: (id: string) => void;
    close: () => void;
}

export const useDropdownStore = create<DropdownStore>((set) => ({
    openId: null,
    open: (id) => set({ openId: id }),
    close: () => set({ openId: null }),
}));