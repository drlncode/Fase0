import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import DetectetLanguage from 'i18next-browser-languagedetector';

import enCommon from '@/lib/i18n/en/common.json';
import enApp from '@/lib/i18n/en/app.json';
import enUsers from '@/lib/i18n/en/users.json';

import esCommon from '@/lib/i18n/es/common.json';
import esApp from '@/lib/i18n/es/app.json';
import esUsers from '@/lib/i18n/es/users.json';

const PREFERENCES_KEY = 'preferences';
const OLD_DETECTOR_KEY = 'i18nextLng';

function readLanguage(): string | undefined {
    try {
        const raw = localStorage.getItem(PREFERENCES_KEY);
        if (raw) {
            const prefs = JSON.parse(raw);
            if (typeof prefs.language === 'string' && ['es', 'en'].includes(prefs.language)) {
                return prefs.language;
            }
        }
    } catch { /* noop */ }
    return undefined;
}

function saveLanguage(lng: string): void {
    try {
        const raw = localStorage.getItem(PREFERENCES_KEY);
        const prefs = raw ? JSON.parse(raw) : {};
        prefs.language = lng;
        localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
    } catch { /* noop */ }
}

// Migrate old i18nextLng key → preferences.language
const oldVal = localStorage.getItem(OLD_DETECTOR_KEY);
if (oldVal !== null) {
    if (['es', 'en'].includes(oldVal) && !readLanguage()) {
        saveLanguage(oldVal);
    }
    localStorage.removeItem(OLD_DETECTOR_KEY);
}

// Clean up stale region-coded values that may have been stored before migration
const stale = localStorage.getItem(PREFERENCES_KEY);
if (stale) {
    try {
        const prefs = JSON.parse(stale);
        if (prefs.language && !['es', 'en'].includes(prefs.language)) {
            prefs.language = 'en';
            localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
        }
    } catch { /* noop */ }
}

const initialLng = readLanguage() || navigator.language?.split('-')[0] || 'en';

i18n
    .use(DetectetLanguage)
    .use(initReactI18next)
    .init({
        lng: initialLng,
        resources: {
            es: {
                common: esCommon,
                app: esApp,
                users: esUsers,
            },
            en: {
                common: enCommon,
                app: enApp,
                users: enUsers,
            },
        },
        defaultNS: 'common',
        fallbackLng: 'en',
        supportedLngs: ['es', 'en'],
        nonExplicitSupportedLngs: true,
        detection: {
            order: ['navigator'],
            caches: [],
        },
        interpolation: {
            escapeValue: false,
        },
    });

i18n.on('languageChanged', (lng) => {
    document.documentElement.lang = lng;
    saveLanguage(lng);
});

if (document.documentElement) {
    document.documentElement.lang = i18n.language;
}

export default i18n;
