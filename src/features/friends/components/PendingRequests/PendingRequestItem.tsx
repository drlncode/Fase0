import { useAvatarUrl } from '@shared/hooks/useAvatarUrl';
import { useAcceptFriendRequest } from '@friends/hooks/useAcceptFriendRequest';
import { useRejectFriendRequest } from '@friends/hooks/useRejectFriendRequest';
import { CollapseableSectionItem } from '@friends/components/CollapseableSectionItem';
import { Avatar } from '@/shared/components/Avatar';
import { NameUsernameItem } from '@/features/friends/components/NameUsernameItem';
import { FriendsActionButton } from '@friends/components/FriendsActionButton';
import { UserCheckIcon, UserXIcon } from '@/shared/components/ui/Icons';

import type { FriendshipRequest } from '@friends/types/friends.types';

export interface PendingRequestItemProps {
    request: FriendshipRequest;
}

export function PendingRequestItem({ request }: PendingRequestItemProps) {
    const { url, onError } = useAvatarUrl(request.sender.avatar, request.sender._id);
    const { status: acceptStatus, accept } = useAcceptFriendRequest();
    const { status: rejectStatus, reject } = useRejectFriendRequest();

    const handleAccept = async () => {
        if (acceptStatus.status === 'loading') return;
        await accept(request._id);
    };

    const handleReject = async () => {
        if (rejectStatus.status === 'loading') return;
        await reject(request._id);
    };

    return (
        <CollapseableSectionItem>
            <div className='flex min-w-0 flex-1 items-center gap-2'>
                <div className='flex items-center'>
                    <Avatar
                        url={url}
                        externalError={onError}
                        alt={`${request.sender.name.split(' ')[0]}'s avatar`}
                        name={request.sender.name}
                        userUrlStatus={request.sender.avatar}
                        className='h-10.5 w-10.5'
                    />
                </div>
                <NameUsernameItem
                    name={request.sender.name}
                    username={request.sender.username}
                />
            </div>

            <div className='flex shrink-0 items-center justify-center gap-1.75 pr-1'>
                <FriendsActionButton
                    className='w-fit px-2.5 text-danger hover:text-red-300'
                    onClick={handleReject}
                    disabled={rejectStatus.status === 'loading' || acceptStatus.status === 'loading' }
                >
                    <UserXIcon size={16.5} />
                </FriendsActionButton>
                <FriendsActionButton
                    className='w-fit px-2.5'
                    onClick={handleAccept}
                    disabled={rejectStatus.status === 'loading' || acceptStatus.status === 'loading' }
                >
                    <UserCheckIcon size={16.5} />
                </FriendsActionButton>
            </div>
        </CollapseableSectionItem>
    );
}
