import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import DetectetLanguage from 'i18next-browser-languagedetector';

import enCommon from '@/lib/i18n/en/common.json';
import enApp from '@/lib/i18n/en/app.json';

import esCommon from '@/lib/i18n/es/common.json';
import esApp from '@/lib/i18n/es/app.json';

const DETECTOR_STORAGE_KEY = 'i18nextLng';

const stored = localStorage.getItem(DETECTOR_STORAGE_KEY);
if (stored && !['es', 'en'].includes(stored)) {
    localStorage.removeItem(DETECTOR_STORAGE_KEY);
}

i18n
    .use(DetectetLanguage)
    .use(initReactI18next)
    .init({
        resources: {
            es: {
                common: esCommon,
                app: esApp,
            },
            en: {
                common: enCommon,
                app: enApp,
            },
        },
        defaultNS: 'common',
        fallbackLng: 'en',
        supportedLngs: ['es', 'en'],
        nonExplicitSupportedLngs: true,
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },
        interpolation: {
            escapeValue: false,
        },
    });

i18n.on('languageChanged', (lng) => {
    document.documentElement.lang = lng;
});

if (document.documentElement) {
    document.documentElement.lang = i18n.language;
}

export default i18n;
