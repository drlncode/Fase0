import { useCancelFriendRequest } from '@friends/hooks/useCancelFriendRequest';
import { useAvatarUrl } from '@shared/hooks/useAvatarUrl';
import { CollapseableSectionItem } from '@friends/components/CollapseableSectionItem';
import { Avatar } from '@/shared/components/Avatar';
import { NameUsernameItem } from '@/features/friends/components/NameUsernameItem';
import { FriendsActionButton } from '@friends/components/FriendsActionButton';

import type { FriendshipRequestSent } from '@friends/types/friends.types';

interface SentRequestItemProps {
    request: FriendshipRequestSent;
}

export function PendingSentRequestItem({ request }: SentRequestItemProps) {
    const { status: cancelFriendRequestStatus, cancel } = useCancelFriendRequest();
    const { url, onError } = useAvatarUrl(request.receiver.avatar, request.receiver._id);

    const handleCancelRequest = async () => {
        if (cancelFriendRequestStatus.status === 'loading') return;
        await cancel(request._id);
    }

    return (
        <CollapseableSectionItem>
            <div className='flex min-w-0 flex-1 items-center gap-2'>
                <div className='flex items-center'>
                    <Avatar
                        url={url}
                        externalError={onError}
                        alt={`${request.receiver.name.split(' ')[0]}'s avatar`}
                        name={request.receiver.name}
                        userUrlStatus={request.receiver.avatar}
                        className='h-10.5 w-10.5'
                    />
                </div>
                <NameUsernameItem
                    name={request.receiver.name}
                    username={request.receiver.username}
                />
            </div>

            <div className='flex shrink-0 items-center justify-center gap-1.75 pr-1'>
                <FriendsActionButton
                    className='w-fit px-2.5 text-danger hover:text-red-300'
                    onClick={handleCancelRequest}
                    disabled={cancelFriendRequestStatus.status === 'loading'}
                >
                    Cancelar
                </FriendsActionButton>
            </div>
        </CollapseableSectionItem>
    );
}