function checkAvailability(): boolean {
    try {
        const testKey = '__localStorage_test__';
        window.localStorage.setItem(testKey, 'ok');
        window.localStorage.removeItem(testKey);
        return true;
    } catch {
        return false;
    }
}

export function useLocalStorage() {
    const isAvailable = checkAvailability();
    const warn = (message: string, error?: unknown) => {
        if (typeof import.meta.env !== 'undefined' && import.meta.env.NODE_ENV === 'production') return;
        if (error !== undefined) {
            console.warn(message, error);
            return;
        }
        console.warn(message);
    }

    const setItem = (key: string, value: string): boolean => {
        if (!isAvailable) return false;
        try {
            window.localStorage.setItem(key, value);
            return true;
        } catch (error) {
            warn(`[useLocalStorage] Failed to set "${key}":`, error);
            return false;
        }
    }
    
    const clearByPrefix = (prefix: string): boolean => {
        if (!isAvailable) return false;
        try {
            const keysToRemove: string[] = [];
            for (let i = 0; i < window.localStorage.length; i++) {
                const key = window.localStorage.key(i);
                if (key && key.startsWith(prefix)) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach((key) => window.localStorage.removeItem(key));
            return true;
        } catch (error) {
            warn(`[useLocalStorage] Failed to clear by prefix "${prefix}":`, error);
            return false;
        }
    }

    const getItem = (key: string): string | null => {
        if (!isAvailable) return null;
        try {
            return window.localStorage.getItem(key);
        } catch (error) {
            warn(`[useLocalStorage] Failed to get "${key}":`, error);
            return null;
        }
    }

    const clearItem = (key: string): boolean => {
        if (!isAvailable) return false;
        try {
            window.localStorage.removeItem(key);
            return true;
        } catch (error) {
            warn(`[useLocalStorage] Failed to remove "${key}":`, error);
            return false;
        }
    }

    const clearAll = (): boolean => {
        if (!isAvailable) return false;
        try {
            window.localStorage.clear();
            return true;
        } catch (error) {
            warn('[useLocalStorage] Failed to clear storage:', error);
            return false;
        }
    }

    const setJsonItem = <T>(key: string, value: T): boolean => {
        if (!isAvailable) return false;
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            warn(`[useLocalStorage] Failed to set JSON "${key}":`, error);
            return false;
        }
    }

    const getJsonItem = <T>(key: string): T | null => {
        if (!isAvailable) return null;
        try {
            const raw = window.localStorage.getItem(key);
            if (raw === null) return null;
            return JSON.parse(raw) as T;
        } catch (error) {
            warn(`[useLocalStorage] Failed to parse JSON "${key}":`, error);
            return null;
        }
    }

    const hasItem = (key: string): boolean => {
        if (!isAvailable) return false;
        try {
            return window.localStorage.getItem(key) !== null;
        } catch {
            return false;
        }
    }

    return {
        isAvailable,
        setItem,
        getItem,
        clearItem,
        clearAll,
        clearByPrefix,
        setJsonItem,
        getJsonItem,
        hasItem
    }
}
