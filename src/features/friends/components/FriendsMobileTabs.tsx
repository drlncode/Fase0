import { useTranslation } from 'react-i18next';
import { cn } from '@/shared/utils/cn';
import { UsersIcon, UserClockIcon, UserShareIcon, UserPlusIcon } from '@/shared/components/ui/Icons';

export type FriendsMobileTab = 'active-friends' | 'pending-requests' | 'sent-requests' | 'add-friend';

interface FriendsMobileTabsProps {
    active: FriendsMobileTab;
    onChange: (tab: FriendsMobileTab) => void;
}

export function FriendsMobileTabs({ active, onChange }: FriendsMobileTabsProps) {
    const { t } = useTranslation('friends');

    const tabs: { id: FriendsMobileTab; label: string; icon: React.ReactNode }[] = [
        { id: 'active-friends', label: t('friendsList.sectionTitle'), icon: <UsersIcon size={16} /> },
        { id: 'pending-requests', label: t('pendingRequests.sectionTitle'), icon: <UserClockIcon size={16} /> },
        { id: 'sent-requests', label: t('sentRequests.sectionTitle'), icon: <UserShareIcon size={16} /> },
        { id: 'add-friend', label: t('addNewFriends.tabLabel'), icon: <UserPlusIcon size={16} /> },
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
                            'flex min-h-9 shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors',
                            isActive
                                ? 'bg-surface text-primary border border-default'
                                : 'text-secondary hover:bg-surface hover:text-primary'
                        )}
                    >
                        <span className='flex shrink-0 items-center justify-center'>{tab.icon}</span>
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
}
