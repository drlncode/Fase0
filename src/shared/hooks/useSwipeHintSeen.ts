import { useCallback, useRef, useState } from 'react';
import { useLocalStorage } from '@shared/hooks/useLocalStorage';

const SWIPE_HINT_KEY = 'fase0:swipe-hint-seen:v1';

/**
 * Tracks whether the swipe-gestures onboarding was already shown.
 * Persisted in localStorage so it appears a single time per device,
 * no matter how many sessions the user starts afterwards.
 */
export function useSwipeHintSeen() {
    const storage = useLocalStorage();
    const storageRef = useRef(storage);
    storageRef.current = storage;

    const [seen, setSeen] = useState<boolean>(() => {
        try {
            return storageRef.current.getItem(SWIPE_HINT_KEY) === '1';
        } catch {
            return false;
        }
    });

    const markSeen = useCallback(() => {
        storageRef.current.setItem(SWIPE_HINT_KEY, '1');
        setSeen(true);
    }, []);

    return { seen, markSeen };
}
