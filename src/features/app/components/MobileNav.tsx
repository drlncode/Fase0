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

function Badge({ count }: { count: string | number }) {
    if (!count) return null;
    return (
        <span className='absolute top-0.5 right-1/2 flex h-4 min-w-4 translate-x-4 items-center justify-center rounded-full bg-badge px-1 text-[10px] font-semibold text-secondary'>
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

    const linkBase = 'relative flex min-h-11 min-w-11 flex-1 flex-col items-center justify-center gap-0.5 rounded-md px-1 py-1 text-[10px] leading-none transition-colors';

    return (
        <nav
            aria-label={t('nav.main')}
            className='flex w-full shrink-0 items-stretch gap-1 border-t border-default bg-overlay px-2 pt-1 pb-[max(0.25rem,env(safe-area-inset-bottom))] md:hidden'
        >
            <NavLink to='app' end className='flex flex-1'>
                {({ isActive }) => (
                    <span className={cn(linkBase, isActive ? 'text-primary' : 'text-secondary')}>
                        <span className='relative flex'>
                            <MessageIcon size={22} />
                            <Badge count={unreadChats} />
                        </span>
                        <span className='max-w-full truncate'>{t('nav.chats')}</span>
                    </span>
                )}
            </NavLink>
            <NavLink to='app/friends?section=active-friends' end className='flex flex-1'>
                {({ isActive }) => (
                    <span className={cn(linkBase, isActive ? 'text-primary' : 'text-secondary')}>
                        <UsersIcon size={22} />
                        <span className='max-w-full truncate'>{t('nav.friends')}</span>
                    </span>
                )}
            </NavLink>
            <NavLink to='app/friends?section=add-friend' end className='flex flex-1'>
                {({ isActive }) => (
                    <span className={cn(linkBase, isActive ? 'text-primary' : 'text-secondary')}>
                        <UserPlusIcon size={22} />
                        <span className='max-w-full truncate'>{t('nav.addFriend')}</span>
                    </span>
                )}
            </NavLink>
            <button
                type='button'
                onClick={() => openInfo({
                    title: t('nav.settings'),
                    content: <SettingsModalContent />,
                    fullWidth: true
                })}
                className={cn(linkBase, 'flex-1 text-secondary')}
                aria-label={t('nav.settings')}
            >
                <span className='h-6 w-6 overflow-hidden rounded-full'>
                    <Avatar url={url} userUrlStatus={avatar} alt={t('avatarAlt', { name })} name={name} className='h-full w-full rounded-full' />
                </span>
                <span className='max-w-full truncate'>{t('nav.settings')}</span>
            </button>
        </nav>
    );
}
