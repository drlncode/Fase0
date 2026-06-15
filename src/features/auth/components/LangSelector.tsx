import { useTranslation } from 'react-i18next';
import { LangIcon } from '@/shared/components/ui/Icons';
import { cn } from '@/shared/utils/cn';

const LANGUAGES = [
    { code: 'es', label: 'Español' },
    { code: 'en', label: 'English' },
] as const;

export function LangSelector() {
    const { t, i18n } = useTranslation('auth');

    return (
        <div className='flex items-center justify-center gap-1'>
            <span className='mt-px'>
                <LangIcon size={22} />
            </span>
            <span className='pr-2 text-secondary'>{t('langSelector.label')}</span>
            <div className='flex overflow-hidden rounded-md border border-default'>
                {LANGUAGES.map((lang) => {
                    const isActive = (i18n.language ?? '').startsWith(lang.code);

                    return (
                        <button
                            key={lang.code}
                            type='button'
                            onClick={() => i18n.changeLanguage(lang.code)}
                            className={cn(
                                'px-2.5 py-1 text-xs transition-all duration-200 ease-out',
                                'select-none hover:cursor-pointer',
                                'active:scale-[0.98]',
                                {
                                    'bg-primary text-overlay': isActive,
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
    );
}
