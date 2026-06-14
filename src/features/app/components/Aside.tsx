import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useValidAuth } from '@auth/hooks/useValidAuth';
import { useChatStore } from '@/features/chats/store/useChatStore';
import { useFriendsStore } from '@friends/store/useFriendsStore';
import { useToast } from '@/shared/hooks/useToast';
import { usePreferences } from '@shared/hooks/usePreferences';
import { useModal } from '@shared/hooks/useModal';
import { AsideLink } from '@app/components/AsideLink';
import { Divisor } from '@shared/components/ui/Divisor';
import { AsideUserSection } from '@app/components/AsideUserSection';
import { Dropdown, DropdownDivider, DropdownItem } from '@/shared/components/Dropdown';
import { SettingsModalContent } from '@users/components/SettingsModalContent';
import {
    MessageIcon,
    UsersIcon,
    UserClockIcon,
    UserPlusIcon,
    SettingsIcon,
    LogoutIcon,
    SidebarLeftCollapse,
    SidebarRightCollapse,
    UserShareIcon
} from '@/shared/components/ui/Icons';
import { cn } from '@/shared/utils/cn';

export function Aside() {
    const { t } = useTranslation('app');
    const [ onLogout, setOnLogout ] = useState(false);
    const numberOfFriends = useFriendsStore(state => state.friends.length);
    const numberOfPendingRequests = useFriendsStore(state => state.friendsRequests.length);
    const numberOfSentRequests = useFriendsStore(state => state.friendsSentRequests.length);
    const { preferences, setPreference } = usePreferences();
    const { success } = useToast();
    const { openInfo, openConfirm } = useModal();
    const collapsed = preferences.sidebarCollapsed;
    const { signout } = useValidAuth();
    const unreadChats = useChatStore(state => state.unreadChats);

    const handleSignOut = async () => {
        if (onLogout) return;
        setOnLogout(true);
        await signout();
        success(t('signOut.success'));
    };

    const handleCollapse = () => setPreference('sidebarCollapsed', !collapsed);

    return (
        <aside aria-label={t('nav.main')} className={cn(
            'h-full min-h-0 min-w-14 shrink-0 overflow-hidden bg-overlay pt-1.25 transition-[width] duration-300 ease-out',
            collapsed ? 'w-14' : 'w-61'
        )}>
            <nav aria-label={t('nav.menu')} className='flex h-full flex-col justify-between'>
                <div className='flex flex-col gap-1'>
                    { collapsed && (
                        <div className='w-5/6'>
                            <Divisor className='w-5/6' />
                        </div>
                    )}
                    <div className={cn(
                        'flex py-1 pr-2',
                        collapsed ? 'justify-center' : 'justify-end'
                    )}>
                        <button
                            type='button'
                            className={cn(
                                'group/collapse-btn rounded-md transition-all duration-200 ease-out',
                                'hover:cursor-pointer hover:bg-surface',
                                'focus-visible:ring-2 focus-visible:ring-strong focus-visible:ring-offset-1 focus-visible:outline-none',
                                'active:scale-[0.98]',
                                {
                                    'p-1.5': !collapsed,
                                    'p-2.5': collapsed,
                                }
                            )}
                            onClick={handleCollapse}
                            aria-label={collapsed ? t('nav.expandSidebar') : t('nav.collapseSidebar')}
                            aria-expanded={!collapsed}
                        >
                            <span className={cn(
                                'flex items-center justify-center',
                                'transition-transform duration-200 ease-out',
                                'group-hover/collapse-btn:-translate-y-px group-hover/collapse-btn:scale-105',
                            )}>
                                {collapsed ? <SidebarRightCollapse size={20} /> : <SidebarLeftCollapse size={20} />}
                            </span>
                        </button>
                    </div>
                    <div className='flex flex-col gap-1 pr-2'>
                        <AsideLink
                            label={t('nav.chats')}
                            icon={<MessageIcon size={20} />}
                            collapsed={collapsed}
                            notification={unreadChats}
                            to='app'
                            end
                            extraMatch='/app/chat/:id'
                        />
                        <Divisor className='my-3 w-5/6' />
                        <AsideLink
                            label={t('nav.friends')}
                            icon={<UsersIcon size={20} />}
                            collapsed={collapsed}
                            to='app/friends?section=active-friends'
                            notification={numberOfFriends}
                            end
                        />
                        <AsideLink
                            label={t('nav.requests')}
                            icon={<UserClockIcon size={20} />}
                            collapsed={collapsed}
                            to='app/friends?section=pending-requests'
                            notification={numberOfPendingRequests}
                            end
                        />
                        <AsideLink
                            label={t('nav.sentRequests')}
                            icon={<UserShareIcon size={20} />}
                            collapsed={collapsed}
                            to='app/friends?section=sent-requests'
                            notification={numberOfSentRequests}
                            end
                        />
                        <AsideLink
                            label={t('nav.addFriend')}
                            icon={<UserPlusIcon size={20} />}
                            collapsed={collapsed}
                            to='app/friends?section=add-friend'
                            end
                        />
                    </div>
                </div>
                <div className='pr-2'>
                    <Divisor className='w-5/6' />
                    <Dropdown
                        trigger={
                            <AsideUserSection collapsed={collapsed} />
                        }
                        className='w-56'
                    >
                        <DropdownItem
                            label={t('nav.settings')}
                            icon={<SettingsIcon size={16} />}
                            onClick={() => openInfo({
                                title: t('nav.settings'),
                                content: <SettingsModalContent />,
                                fullWidth: true
                            })}
                        />
                        <DropdownDivider />
                        <DropdownItem
                            label={t('nav.signOut')}
                            icon={<LogoutIcon size={16} />}
                            danger
                            onClick={() => openConfirm({
                                title: t('signOut.title'),
                                message: t('signOut.message'),
                                confirmText: t('signOut.confirm'),
                                onConfirm: handleSignOut,
                                awaitedAction: true,
                                danger: true
                            })}
                            disabled={onLogout}
                        />
                    </Dropdown>
                </div>
            </nav>
        </aside>
    );
}
