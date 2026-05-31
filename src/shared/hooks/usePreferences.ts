import { useState, useCallback } from 'react';
import { useLocalStorage } from '@shared/hooks/useLocalStorage';

const PREFERENCES_KEY = 'preferences';

interface Preferences {
    sidebarCollapsed: boolean;
    notificationSound: boolean;
    theme: 'dark' | 'light';
}

const DEFAULT_PREFERENCES: Preferences = {
    sidebarCollapsed: false,
    notificationSound: true,
    theme: 'dark',
};

function migrateOldKeys(getItem: (key: string) => string | null, removeItem: (key: string) => void): Partial<Preferences> {
    const migrated: Partial<Preferences> = {};

    const oldCollapsed = getItem('SIDEBAR_COLLAPSED');
    if (oldCollapsed !== null) {
        migrated.sidebarCollapsed = oldCollapsed === 'true';
        removeItem('SIDEBAR_COLLAPSED');
    }

    const oldNotification = getItem('preferences:notificationSound');
    if (oldNotification !== null) {
        migrated.notificationSound = oldNotification === 'true';
        removeItem('preferences:notificationSound');
    }

    return migrated;
}

export function usePreferences() {
    const { getItem, setJsonItem, getJsonItem, clearItem } = useLocalStorage();

    const readPreferences = (): Preferences => {
        const stored = getJsonItem<Partial<Preferences>>(PREFERENCES_KEY);
        if (stored) {
            const merged = { ...DEFAULT_PREFERENCES, ...stored };
            if (Object.keys(stored).length !== Object.keys(merged).length) {
                setJsonItem(PREFERENCES_KEY, merged);
            }
            return merged;
        }

        const migrated = migrateOldKeys(getItem, clearItem);
        if (Object.keys(migrated).length > 0) {
            const merged = { ...DEFAULT_PREFERENCES, ...migrated };
            setJsonItem(PREFERENCES_KEY, merged);
            return merged;
        }

        const defaults = { ...DEFAULT_PREFERENCES };
        setJsonItem(PREFERENCES_KEY, defaults);
        return defaults;
    };

    const [preferences, setPreferencesState] = useState<Preferences>(readPreferences);

    const updatePreference = useCallback(<K extends keyof Preferences>(key: K, value: Preferences[K]) => {
        setPreferencesState(prev => {
            const next = { ...prev, [key]: value };
            setJsonItem(PREFERENCES_KEY, next);
            return next;
        });
    }, [setJsonItem]);

    return {
        preferences,
        setPreference: updatePreference,
    };
}
