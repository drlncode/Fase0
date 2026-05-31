import { useCallback } from 'react';
import { usePreferences } from '@shared/hooks/usePreferences';

export function useNotificationPreferences() {
    const { preferences, setPreference } = usePreferences();

    const toggle = useCallback(() => {
        setPreference('notificationSound', !preferences.notificationSound);
    }, [preferences.notificationSound, setPreference]);

    return { enabled: preferences.notificationSound, toggle, setEnabled: (value: boolean) => setPreference('notificationSound', value) };
}

let audio: HTMLAudioElement | null = null;

export function useNotificationAudio() {
    const { preferences } = usePreferences();

    const playAudio = useCallback(() => {
        if (!preferences.notificationSound) return;

        if (!audio) {
            audio = new Audio('/audios/notification-effect.mp3');
            audio.preload = 'auto';
        }

        audio.currentTime = 0;
        audio.play().catch();
    }, [preferences.notificationSound]);

    return { playAudio };
}
