import { useState } from 'react';
import { AccountContent } from '@users/components/AccountContent';
import { PreferencesContent } from '@users/components/PreferencesContent';
import { UserCircleIcon, AdjustmentsHorizontalIcon } from '@/shared/components/ui/Icons';
import { cn } from '@shared/utils/cn';

type SettingsTab = 'account' | 'preferences';

interface TabConfig {
    id: SettingsTab;
    label: string;
    icon: React.ReactNode;
}

const TABS: TabConfig[] = [
    { id: 'account', label: 'Cuenta', icon: <UserCircleIcon size={20} /> },
    { id: 'preferences', label: 'Preferencias', icon: <AdjustmentsHorizontalIcon size={20} /> },
];

export function SettingsModalContent() {
    const [ activeTab, setActiveTab ] = useState<SettingsTab>('account');

    return (
        <div className='flex min-h-72 min-w-130 gap-6 pt-2'>
            <nav className='flex w-44 flex-col gap-1 border-r border-default pr-6'>
                {TABS.map((tab) => {
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
                                'mx-1',
                                'active:scale-[0.98]',
                                'w-full px-2 py-1.5',
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

            <section className='-mr-6 min-w-82 shrink-0'>
                {activeTab === 'account' && <AccountContent />}
                {activeTab === 'preferences' && <PreferencesContent />}
            </section>
        </div>
    );
}
