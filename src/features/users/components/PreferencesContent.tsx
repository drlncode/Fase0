import { useTranslation } from 'react-i18next';
import { useNotificationPreferences } from '@shared/hooks/useNotificationAudio';
import { Switch } from '@shared/components/ui/Switch';
import { cn } from '@shared/utils/cn';

const LANGUAGES = [
    { code: 'es', label: 'Español' },
    { code: 'en', label: 'English' },
] as const;

export function PreferencesContent() {
    const { enabled, toggle } = useNotificationPreferences();
    const { i18n } = useTranslation();

    return (
        <div className='flex flex-col gap-6'>
            <div className='flex items-center justify-between gap-4'>
                <div className='flex flex-col gap-0.5'>
                    <span className='text-sm font-medium text-primary'>Sonido de notificación</span>
                    <span className='text-xs text-secondary'>
                        Reproduce un sonido al recibir un mensaje nuevo
                    </span>
                </div>
                <Switch
                    checked={enabled}
                    onChange={toggle}
                    label='Sonido de notificación'
                />
            </div>

            <div className='flex items-center justify-between gap-4'>
                <div className='flex flex-col gap-0.5'>
                    <span className='text-sm font-medium text-primary'>Idioma</span>
                    <span className='text-xs text-secondary'>
                        Selecciona el idioma de la aplicación
                    </span>
                </div>
                <div className='flex overflow-hidden rounded-md border border-default'>
                    {LANGUAGES.map((lang) => {
                        const isActive = (i18n.language ?? '').startsWith(lang.code);

                        return (
                            <button
                                key={lang.code}
                                type='button'
                                onClick={() => i18n.changeLanguage(lang.code)}
                                className={cn(
                                    'px-3 py-1.5 text-xs transition-all duration-200 ease-out',
                                    'hover:cursor-pointer select-none',
                                    'active:scale-[0.98]',
                                    {
                                        'bg-surface text-primary': isActive,
                                        'text-secondary hover:bg-subtle': !isActive,
                                    }
                                )}
                            >
                                {lang.label}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}