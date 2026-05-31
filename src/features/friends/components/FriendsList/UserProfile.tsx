import { useAvatarUrl } from '@shared/hooks/useAvatarUrl';
import { Avatar } from '@shared/components/Avatar';
import { CalendarIcon } from '@/shared/components/ui/Icons';

import type { Friendship } from '@friends/types/friends.types';

export function UserProfile({ user }: { user: Friendship }) {
    const { url, onError } = useAvatarUrl(user.friend.avatar, user.friend._id);

    return (
        <div className='mt-2 flex w-md gap-3 text-primary'>
            <Avatar
                url={url}
                externalError={onError}
                alt={`${user.friend.name.split(' ')[0]}'s avatar`}
                name={user.friend.name}
                userUrlStatus={user.friend.avatar}
                className='h-37 w-37'
                defaultClassName='text-7xl flex items-center justify-center *:-mt-2'
            />
            <div className='flex flex-col gap-1'>
                <h2 className='text-xl font-semibold'>{user.friend.name}</h2>
                <p className='text-sm text-secondary'>@{user.friend.username}</p>
                <span className='flex w-fit items-center gap-0.5 border-b border-b-transparent pt-1 pb-px text-[13px] text-secondary transition-colors duration-250 hover:border-secondary/80'>
                    <CalendarIcon size={17} />
                    <span>
                        Amigos desde {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                </span>
            </div>
        </div>
    );
}
