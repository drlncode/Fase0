import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import DetectetLanguage from 'i18next-browser-languagedetector';

// English translations
import enCommon from '@/lib/i18n/en/common.json';
import enApp from '@/lib/i18n/en/app.json';
import enUsers from '@/lib/i18n/en/users.json';
import enAuth from '@/lib/i18n/en/auth.json';

// Spanish translations
import esCommon from '@/lib/i18n/es/common.json';
import esApp from '@/lib/i18n/es/app.json';
import esUsers from '@/lib/i18n/es/users.json';
import esAuth from '@/lib/i18n/es/auth.json';

type AvailableLanguages = 'en' | 'es';

const PREFERENCES_KEY = 'preferences';

function readLanguage(): AvailableLanguages | undefined {
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

function saveLanguage(lng: AvailableLanguages): void {
    try {
        const raw = localStorage.getItem(PREFERENCES_KEY);
        const prefs = raw ? JSON.parse(raw) : {};
        prefs.language = lng;
        localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
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
                auth: esAuth,
            },
            en: {
                common: enCommon,
                app: enApp,
                users: enUsers,
                auth: enAuth,
            },
        },
        defaultNS: 'common',
        fallbackLng: 'en',
        supportedLngs: ['es', 'en'] satisfies AvailableLanguages[],
        nonExplicitSupportedLngs: true,
        detection: {
            order: ['navigator'],
            caches: [],
        },
        interpolation: {
            escapeValue: false,
        },
    });

i18n.on('languageChanged', (lng: AvailableLanguages) => {
    document.documentElement.lang = lng;
    saveLanguage(lng);
});

if (document.documentElement) {
    document.documentElement.lang = i18n.language;
}

export default i18n;
