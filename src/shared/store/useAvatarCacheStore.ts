import { create } from 'zustand';

interface AvatarCacheEntry {
    blob: Blob;
    url: string;
    avatarName: string;
}

interface AvatarCacheStore {
    cache: Map<string, AvatarCacheEntry>;
    getAvatar: (userId: string, avatarName: string) => string | null;
    setAvatar: (userId: string, avatarName: string, blob: Blob, url: string) => void;
    removeAvatar: (userId: string) => void;
    invalidate: (userId: string) => void;
    clearAll: () => void;
}

export const useAvatarCacheStore = create<AvatarCacheStore>((set, get) => ({
    cache: new Map(),

    getAvatar: (userId: string, avatarName: string) => {
        const entry = get().cache.get(userId);

        if (!entry || entry.avatarName !== avatarName) {
            if (entry) {
                URL.revokeObjectURL(entry.url);
                const newCache = new Map(get().cache);
                newCache.delete(userId);
                set({ cache: newCache });
            }
            return null;
        }

        return entry.url;
    },

    setAvatar: (userId: string, avatarName: string, blob: Blob, url: string) => {
        const existing = get().cache.get(userId);

        if (existing) {
            URL.revokeObjectURL(existing.url);
        }

        const newCache = new Map(get().cache);
        newCache.set(userId, { avatarName, blob, url });
        set({ cache: newCache });
    },

    removeAvatar: (userId: string) => {
        const entry = get().cache.get(userId);
        if (entry) {
            URL.revokeObjectURL(entry.url);
            const newCache = new Map(get().cache);
            newCache.delete(userId);
            set({ cache: newCache });
        }
    },

    invalidate: (userId: string) => {
        const entry = get().cache.get(userId);
        if (entry) {
            URL.revokeObjectURL(entry.url);
            const newCache = new Map(get().cache);
            newCache.delete(userId);
            set({ cache: newCache });
        }
    },

    clearAll: () => {
        get().cache.forEach(entry => URL.revokeObjectURL(entry.url));
        set({ cache: new Map() });
    }
}));
