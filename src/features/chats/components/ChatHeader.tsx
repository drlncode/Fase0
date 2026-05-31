import { useAvatarUrl } from '@shared/hooks/useAvatarUrl';
import { Avatar } from '@shared/components/Avatar';

import type { UserPublicProfile } from '@users/types/user.types';
import { NameUsernameItem } from '@/features/friends/components/NameUsernameItem';

export function ChatHeader({ participant }: { participant: UserPublicProfile }) {
    const avatarUrl = useAvatarUrl(participant.avatar, participant._id);

    return (
        <header className='bg-overlay flex items-center gap-3 px-4 py-2 border-b border-b-border-default'>
            <Avatar
                alt={`${participant.name.split(' ')[0]}'s avatar`}
                url={avatarUrl.url}
                userUrlStatus={participant.avatar}
                name={participant.name}
            />
            <NameUsernameItem
                name={participant.name}
                username={participant.username}
            />
        </header>
    );
}