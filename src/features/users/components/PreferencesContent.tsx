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
    const { t, i18n } = useTranslation('users');

    return (
        <div className='flex w-full flex-col gap-6'>
            <div className='flex w-full items-center justify-between gap-4'>
                <div className='flex flex-1 flex-col gap-0.5'>
                    <span className='text-sm font-medium text-primary'>{t('preferences.notificationSound')}</span>
                    <span className='text-xs text-secondary'>
                        {t('preferences.notificationSoundDesc')}
                    </span>
                </div>
                <Switch
                    checked={enabled}
                    onChange={toggle}
                    label={t('preferences.notificationSound')}
                />
            </div>

            <div className='flex w-full items-center justify-between gap-4'>
                <div className='flex flex-1 flex-col gap-0.5'>
                    <span className='text-sm font-medium text-primary'>{t('preferences.language')}</span>
                    <span className='text-xs text-secondary'>
                        {t('preferences.languageDesc')}
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
                                    'select-none hover:cursor-pointer',
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