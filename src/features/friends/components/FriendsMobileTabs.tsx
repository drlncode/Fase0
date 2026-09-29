import { useTranslation } from 'react-i18next';
import { cn } from '@/shared/utils/cn';

export type FriendsMobileTab = 'active-friends' | 'pending-requests' | 'sent-requests' | 'add-friend';

interface FriendsMobileTabsProps {
    active: FriendsMobileTab;
    onChange: (tab: FriendsMobileTab) => void;
}

export function FriendsMobileTabs({ active, onChange }: FriendsMobileTabsProps) {
    const { t } = useTranslation('friends');

    const tabs: { id: FriendsMobileTab; label: string }[] = [
        { id: 'active-friends', label: t('friendsList.sectionTitle') },
        { id: 'pending-requests', label: t('pendingRequests.sectionTitle') },
        { id: 'sent-requests', label: t('sentRequests.sectionTitle') },
        { id: 'add-friend', label: t('addNewFriends.idleTitle') },
    ];

    return (
        <div
            role='tablist'
            aria-label={t('page.title')}
            className='flex w-full shrink-0 gap-1 overflow-x-auto border-b border-default bg-surface px-2 py-2 lg:hidden'
        >
            {tabs.map(tab => {
                const isActive = active === tab.id;
                return (
                    <button
                        key={tab.id}
                        role='tab'
                        aria-selected={isActive}
                        type='button'
                        onClick={() => onChange(tab.id)}
                        className={cn(
                            'min-h-9 shrink-0 rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors',
                            isActive
                                ? 'border border-default bg-surface text-primary'
                                : 'text-secondary hover:bg-surface hover:text-primary'
                        )}
                    >
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
}
