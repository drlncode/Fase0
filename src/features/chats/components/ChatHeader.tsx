import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useAvatarUrl } from '@shared/hooks/useAvatarUrl';
import { Avatar } from '@shared/components/Avatar';
import { ArrowLeftIcon } from '@/shared/components/ui/Icons';

import type { UserPublicProfile } from '@users/types/user.types';
import { NameUsernameItem } from '@/features/friends/components/NameUsernameItem';

export function ChatHeader({ participant }: { participant: UserPublicProfile }) {
    const { t } = useTranslation('chats');
    const navigate = useNavigate();
    const avatarUrl = useAvatarUrl(participant.avatar, participant._id);

    return (
        <header className='flex min-w-0 items-center gap-2 border-b border-b-border-default bg-overlay px-2 py-2 sm:gap-3 sm:px-4'>
            <button
                type='button'
                onClick={() => navigate('/app')}
                className='shrink-0 rounded-md p-2 text-secondary transition-colors hover:bg-surface hover:text-primary md:hidden'
                aria-label={t('header.backAriaLabel')}
            >
                <ArrowLeftIcon size={20} />
            </button>
            <Avatar
                alt={t('list.avatarAlt', { name: participant.name.split(' ')[0] })}
                url={avatarUrl.url}
                userUrlStatus={participant.avatar}
                name={participant.name}
            />
            <div className='min-w-0 flex-1'>
                <NameUsernameItem
                    name={participant.name}
                    username={participant.username}
                />
            </div>
        </header>
    );
}