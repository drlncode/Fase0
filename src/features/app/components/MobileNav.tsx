import { NavLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useChatStore } from '@/features/chats/store/useChatStore';
import { useValidAuth } from '@auth/hooks/useValidAuth';
import { useAvatarUrl } from '@shared/hooks/useAvatarUrl';
import { useModal } from '@shared/hooks/useModal';
import { Avatar } from '@shared/components/Avatar';
import { MessageIcon, UsersIcon, UserPlusIcon } from '@/shared/components/ui/Icons';
import { cn } from '@/shared/utils/cn';
import { SettingsModalContent } from '@users/components/SettingsModalContent';

const ICON_SIZE = 26;

const itemBase = 'group/mobile-nav relative flex flex-1 items-center justify-center rounded-lg border border-transparent py-2.5 transition-all duration-200 ease-out active:scale-[0.95] focus-visible:ring-2 focus-visible:ring-strong focus-visible:outline-none';

const iconWrap = 'flex transition-transform duration-200 ease-out group-hover/mobile-nav:-translate-y-px';

function itemState(isActive: boolean) {
    return isActive
        ? 'bg-surface text-primary border-default/75'
        : 'text-secondary hover:bg-surface/60 hover:text-primary';
}

function Badge({ count }: { count: string | number }) {
    if (!count) return null;
    return (
        <span className='absolute -top-1 -right-1.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-badge px-1 text-[10px] leading-none font-semibold text-secondary'>
            {count}
        </span>
    );
}

export function MobileNav() {
    const { t } = useTranslation('app');
    const unreadChats = useChatStore(state => state.unreadChats);
    const { user: { _id, name, avatar } } = useValidAuth();
    const { url } = useAvatarUrl(avatar, _id);
    const { openInfo } = useModal();

    return (
        <nav
            aria-label={t('nav.main')}
            className='flex w-full shrink-0 items-stretch gap-1.5 border-t border-default bg-overlay px-2.5 pt-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] md:hidden'
        >
            <NavLink
                to='app'
                end
                aria-label={t('nav.chats')}
                className={({ isActive }) => cn(itemBase, itemState(isActive))}
            >
                <span className={cn(iconWrap, 'relative')}>
                    <MessageIcon size={ICON_SIZE} />
                    <Badge count={unreadChats} />
                </span>
            </NavLink>
            <NavLink
                to='app/friends?section=active-friends'
                end
                aria-label={t('nav.friends')}
                className={({ isActive }) => cn(itemBase, itemState(isActive))}
            >
                <span className={iconWrap}>
                    <UsersIcon size={ICON_SIZE} />
                </span>
            </NavLink>
            <NavLink
                to='app/friends?section=add-friend'
                end
                aria-label={t('nav.addFriendShort')}
                className={({ isActive }) => cn(itemBase, itemState(isActive))}
            >
                <span className={iconWrap}>
                    <UserPlusIcon size={ICON_SIZE} />
                </span>
            </NavLink>
            <button
                type='button'
                onClick={() => openInfo({
                    title: t('nav.settings'),
                    content: <SettingsModalContent />,
                    fullWidth: true
                })}
                aria-label={t('nav.settings')}
                className={cn(itemBase, 'text-secondary hover:bg-surface/60 hover:text-primary')}
            >
                <span className={cn(iconWrap, 'h-7 w-7 overflow-hidden rounded-full')}>
                    <Avatar url={url} userUrlStatus={avatar} alt={t('avatarAlt', { name })} name={name} className='h-full w-full rounded-full' />
                </span>
            </button>
        </nav>
    );
}
