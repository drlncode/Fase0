import { useSendFriendRequest } from '@friends/hooks/useSendFriendRequest';
import { useAvatarUrl } from '@shared/hooks/useAvatarUrl';
import { Avatar } from '@/shared/components/Avatar';
import { NameUsernameItem } from '@friends/components/NameUsernameItem';
import { FriendsActionButton } from '@friends/components/FriendsActionButton';
import { SpinLoader } from '@shared/components/ui/SpinLoader';

import type { SearchedUserPublicProfile } from '@features/users/types/user.types';

function FriendRequestLabel({
    relationship
}: {
    relationship: SearchedUserPublicProfile['relationship'];
}) {
    if (relationship.isFriend) return <>Amigo</>;
    if (relationship.onRequest === 'sent') return <>Enviada</>;
    if (relationship.onRequest === 'received') return <>Pendiente</>;

    return <>Agregar</>;
}

export function UserFoundItem({ user, externalLoading }: { user: SearchedUserPublicProfile, externalLoading?: boolean }) {
    const { status: sendRequestStatus, send } = useSendFriendRequest();
    const { onError, url } = useAvatarUrl(user.avatar, user._id);
    const canAddFriend = !user.relationship.isFriend && !user.relationship.onRequest;
    const isDisabled = user.relationship.isFriend || user.relationship.onRequest === 'received' || user.relationship.onRequest === 'sent';
    const isLoading = sendRequestStatus.status === 'loading' || externalLoading;

    const handleAddFriend = () => {
        if (!canAddFriend) return;
        send(user._id);
    }

    return (
        <div className='flex gap-2.5 rounded-lg border border-default/70 px-2.5 py-2 transition-colors duration-250 hover:bg-subtle/50'>
            <div className='flex items-center'>
                <Avatar
                    url={url}
                    externalError={onError}
                    alt={`${user.name.split(' ')[0]}'s avatar`}
                    name={user.name}
                    userUrlStatus={user.avatar}
                    className='h-10.5 w-10.5'
                />
            </div>
            <NameUsernameItem
                name={user.name}
                username={user.username}
            />
            <div className='flex items-center'>
                <FriendsActionButton
                    disabled={isDisabled}
                    onClick={canAddFriend ? handleAddFriend : undefined}
                >
                    { !isLoading && <FriendRequestLabel relationship={user.relationship} /> }
                    { isLoading && <SpinLoader size={16} /> }
                </FriendsActionButton>
            </div>
        </div>
    );
}