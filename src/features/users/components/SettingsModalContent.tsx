import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AccountContent } from '@users/components/AccountContent';
import { PreferencesContent } from '@users/components/PreferencesContent';
import { UserCircleIcon, AdjustmentsHorizontalIcon } from '@/shared/components/ui/Icons';
import { cn } from '@shared/utils/cn';

type SettingsTab = 'account' | 'preferences';

export function SettingsModalContent() {
    const { t } = useTranslation('users');
    const [ activeTab, setActiveTab ] = useState<SettingsTab>('account');

    const tabs = useMemo<{ id: SettingsTab; label: string; icon: React.ReactNode }[]>(() => [
        { id: 'account', label: t('tabs.account'), icon: <UserCircleIcon size={20} /> },
        { id: 'preferences', label: t('tabs.preferences'), icon: <AdjustmentsHorizontalIcon size={20} /> },
    ], [t]);

    return (
        <div className='flex min-h-72 w-full min-w-0 flex-col gap-4 pt-2 sm:min-w-130 sm:flex-row sm:gap-6'>
            <nav className='flex w-full shrink-0 flex-row items-center justify-center gap-1 overflow-x-auto border-b border-default pb-3 sm:w-44 sm:flex-col sm:items-stretch sm:justify-start sm:overflow-visible sm:border-b-0 sm:border-r sm:pb-0 sm:pr-6'>
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            type='button'
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                'group/settings-item relative flex items-center rounded-md border border-transparent',
                                'transition-all duration-200 ease-out',
                                'hover:cursor-pointer hover:border-default/75 hover:bg-surface',
                                'active:border-default',
                                'active:scale-[0.98]',
                                'w-40 max-w-[calc(50%-0.25rem)] shrink-0 px-2 py-1.5 sm:mx-1 sm:w-full sm:max-w-none',
                                {
                                    'bg-surface text-primary': isActive,
                                    'text-secondary': !isActive,
                                }
                            )}
                        >
                            <div className='flex items-center gap-2'>
                                <span className='flex h-5 w-5 items-center justify-center transition-transform duration-200 ease-out group-hover/settings-item:-translate-y-px group-hover/settings-item:scale-105'>
                                    {tab.icon}
                                </span>
                                <span className='leading-none whitespace-nowrap transition-colors duration-200 group-hover/settings-item:text-primary'>
                                    {tab.label}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </nav>

            <section className='min-w-0 flex-1 sm:-mr-6 sm:min-w-82'>
                {activeTab === 'account' && <AccountContent />}
                {activeTab === 'preferences' && <PreferencesContent />}
            </section>
        </div>
    );
}
