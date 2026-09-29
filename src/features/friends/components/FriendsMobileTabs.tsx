import { Fragment, useTranslation } from 'react-i18next';
import { useFriendsStore } from '@friends/store/useFriendsStore';
import { cn } from '@/shared/utils/cn';
import { UsersIcon, UserClockIcon, UserShareIcon, UserPlusIcon } from '@/shared/components/ui/Icons';

export type FriendsMobileTab = 'active-friends' | 'pending-requests' | 'sent-requests' | 'add-friend';

interface FriendsMobileTabsProps {
    active: FriendsMobileTab;
    onChange: (tab: FriendsMobileTab) => void;
}

export function FriendsMobileTabs({ active, onChange }: FriendsMobileTabsProps) {
    const { t } = useTranslation('friends');
    const numberOfFriends = useFriendsStore(state => state.friends.length);
    const numberOfPendingRequests = useFriendsStore(state => state.friendsRequests.length);
    const numberOfSentRequests = useFriendsStore(state => state.friendsSentRequests.length);

    const tabs: { id: FriendsMobileTab; label: string; icon: React.ReactNode; notification?: number }[] = [
        { id: 'active-friends', label: t('friendsList.shortTitle'), icon: <UsersIcon size={20} />, notification: numberOfFriends },
        { id: 'pending-requests', label: t('pendingRequests.shortTitle'), icon: <UserClockIcon size={20} />, notification: numberOfPendingRequests },
        { id: 'sent-requests', label: t('sentRequests.shortTitle'), icon: <UserShareIcon size={20} />, notification: numberOfSentRequests },
        { id: 'add-friend', label: t('addNewFriends.tabLabel'), icon: <UserPlusIcon size={20} /> },
    ];

    return (
        <div
            role='tablist'
            aria-label={t('page.title')}
            className='flex w-full shrink-0 items-stretch gap-1.5 border-b border-default bg-surface px-2 py-2 lg:hidden'
        >
            {tabs.map(tab => {
                const isActive = active === tab.id;
                const showBadge = !!tab.notification;

                return (
                    <Fragment key={tab.id}>
                        {tab.id === 'add-friend' && (
                            <span aria-hidden='true' className='my-1.5 w-px shrink-0 bg-default' />
                        )}
                        <button
                            role='tab'
                            aria-selected={isActive}
                            type='button'
                            onClick={() => onChange(tab.id)}
                            className={cn(
                                'group/friend-tab relative flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-lg border border-transparent px-1 py-1.5',
                                'transition-all duration-200 ease-out active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-strong focus-visible:outline-none',
                                isActive
                                    ? 'bg-overlay text-primary border-default/75'
                                    : 'text-secondary hover:bg-overlay/60 hover:text-primary'
                            )}
                        >
                            <span className='relative flex transition-transform duration-200 ease-out group-hover/friend-tab:-translate-y-px'>
                                {tab.icon}
                                {showBadge && (
                                    <span className='absolute -top-1 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-badge px-1 text-[9px] leading-none font-semibold text-secondary'>
                                        {tab.notification}
                                    </span>
                                )}
                            </span>
                            <span className='max-w-full truncate text-[10px] leading-tight'>{tab.label}</span>
                        </button>
                    </Fragment>
                );
            })}
        </div>
    );
}
