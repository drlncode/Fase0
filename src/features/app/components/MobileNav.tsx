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

const itemBase = 'group/mobile-nav relative flex min-h-12 flex-1 flex-col items-center justify-center gap-1 rounded-md border border-transparent px-1.5 py-2 text-[11px] leading-tight transition-all duration-200 ease-out active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-strong focus-visible:outline-none';

function itemState(isActive: boolean) {
    return isActive
        ? 'bg-surface text-primary border-default/75'
        : 'text-secondary hover:bg-surface/60 hover:text-primary';
}

function Badge({ count }: { count: string | number }) {
    if (!count) return null;
    return (
        <span className='absolute -top-1 -right-2 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-badge px-1 text-[10px] leading-none font-semibold text-secondary'>
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
            className='flex w-full shrink-0 items-stretch gap-1.5 border-t border-default bg-overlay px-2.5 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:hidden'
        >
            <NavLink to='app' end className={({ isActive }) => cn(itemBase, itemState(isActive))}>
                <span className='relative flex transition-transform duration-200 ease-out group-hover/mobile-nav:-translate-y-px'>
                    <MessageIcon size={24} />
                    <Badge count={unreadChats} />
                </span>
                <span className='max-w-full truncate'>{t('nav.chats')}</span>
            </NavLink>
            <NavLink to='app/friends?section=active-friends' end className={({ isActive }) => cn(itemBase, itemState(isActive))}>
                <span className='flex transition-transform duration-200 ease-out group-hover/mobile-nav:-translate-y-px'>
                    <UsersIcon size={24} />
                </span>
                <span className='max-w-full truncate'>{t('nav.friends')}</span>
            </NavLink>
            <NavLink to='app/friends?section=add-friend' end className={({ isActive }) => cn(itemBase, itemState(isActive))}>
                <span className='flex transition-transform duration-200 ease-out group-hover/mobile-nav:-translate-y-px'>
                    <UserPlusIcon size={24} />
                </span>
                <span className='max-w-full truncate'>{t('nav.addFriend')}</span>
            </NavLink>
            <button
                type='button'
                onClick={() => openInfo({
                    title: t('nav.settings'),
                    content: <SettingsModalContent />,
                    fullWidth: true
                })}
                className={cn(itemBase, 'text-secondary hover:bg-surface/60 hover:text-primary')}
                aria-label={t('nav.settings')}
            >
                <span className='h-6.5 w-6.5 overflow-hidden rounded-full transition-transform duration-200 ease-out group-hover/mobile-nav:-translate-y-px'>
                    <Avatar url={url} userUrlStatus={avatar} alt={t('avatarAlt', { name })} name={name} className='h-full w-full rounded-full' />
                </span>
                <span className='max-w-full truncate'>{t('nav.settings')}</span>
            </button>
        </nav>
    );
}
