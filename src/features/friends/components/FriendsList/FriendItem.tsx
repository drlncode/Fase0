import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAvatarUrl } from '@shared/hooks/useAvatarUrl';
import { useCreateChat } from '@chats/hooks/useCreateChat';
import { useDeleteFriend } from '@friends/hooks/useDeleteFriend';
import { useModal } from '@/shared/hooks/useModal';
import { CollapseableSectionItem } from '@friends/components/CollapseableSectionItem';
import { Avatar } from '@/shared/components/Avatar';
import { Dropdown, DropdownItem, DropdownLabel, DropdownDivider } from '@shared/components/Dropdown';
import { NewChatPopover } from '@friends/components/FriendsList/NewChatPopover';
import { UserProfile } from '@friends/components/FriendsList/UserProfile';
import { NameUsernameItem } from '@/features/friends/components/NameUsernameItem';
import { MessageShareIcon, MessagePlusIcon, DotsVerticalIcon, UserIcon, TrashIcon } from '@/shared/components/ui/Icons';
import { FriendsActionButton } from '@friends/components/FriendsActionButton';

import type { Friendship } from '@friends/types/friends.types';

interface FriendItemProps {
    friendship: Friendship;
}

export function FriendItem({ friendship }: FriendItemProps) {
    const navigate = useNavigate();
    const { url, onError } = useAvatarUrl(friendship.friend.avatar, friendship.friend._id);
    const { status: createChatStatus, create } = useCreateChat();
    const { status: deleteFriendStatus, remove } = useDeleteFriend();
    const { openConfirm, openInfo } = useModal();

    useEffect(() => {
        if (createChatStatus.status === 'success') {
            navigate(`/app/chat/${createChatStatus.data._id}`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [createChatStatus.status]);

    const handleOpenChat = () => {
        if (friendship.activeChatId) {
            navigate(`/app/chat/${friendship.activeChatId}`);
        }
    };

    const handleCreateChat = async (message: string) => {
        create(friendship.friend._id, message);
    }

    const handleSeeProfile = () => {
        openInfo({
            title: `Perfil de @${friendship.friend.username}`,
            content: <UserProfile user={friendship} />
        });
    }

    const handleDeleteFriend = () => {
        openConfirm({
            title: 'Eliminar amigo',
            message: `¿Estás seguro de que quieres eliminar a @${friendship.friend.username} de tu lista de amigos?`,
            onConfirm: () => remove(friendship._id),
            danger: true,
            awaitedAction: true
        });
    };

    return (
        <CollapseableSectionItem>
            <div className='flex min-w-0 flex-1 items-center gap-2'>
                <div className='flex items-center'>
                    <Avatar
                        url={url}
                        externalError={onError}
                        alt={`${friendship.friend.name.split(' ')[0]}'s avatar`}
                        name={friendship.friend.name}
                        userUrlStatus={friendship.friend.avatar}
                        className='h-10.5 w-10.5'
                    />
                </div>
                <NameUsernameItem
                    name={friendship.friend.name}
                    username={friendship.friend.username}
                />
            </div>

            <div className='flex shrink-0 items-center justify-center gap-1.75'>
                {(friendship.activeChatId && createChatStatus.status !== 'loading') ? (
                    <FriendsActionButton
                        className='w-fit px-2.5'
                        onClick={handleOpenChat}
                    >
                        <MessageShareIcon size={16} />
                        Abrir
                    </FriendsActionButton>
                ) : (
                    <NewChatDropdown
                        onSend={handleCreateChat}
                        loading={createChatStatus.status === 'loading'}
                    />
                )}
                <Dropdown
                    trigger={
                        <span className='flex items-center justify-center rounded-full p-1 hover:cursor-pointer hover:bg-subtle'>
                            <DotsVerticalIcon size={16} />
                        </span>
                    }
                    placement='bottom-end'
                    triggerClassName='w-fit'
                >
                    <DropdownItem
                        label='Ver perfil'
                        icon={<UserIcon size={16} />}
                        onClick={handleSeeProfile}
                    />
                    <DropdownDivider />
                    <DropdownItem
                        label='Eliminar amigo'
                        icon={<TrashIcon size={16} />}
                        danger
                        onClick={handleDeleteFriend}
                        disabled={deleteFriendStatus.status === 'loading'}
                    />
                </Dropdown>
            </div>
        </CollapseableSectionItem>
    );
}

interface NewChatDropdownProps {
    onSend: (message: string) => void | Promise<void>;
    loading: boolean;
}

function NewChatDropdown({ onSend, loading }: NewChatDropdownProps) {
    return (
        <Dropdown
            trigger={
                <FriendsActionButton className='w-fit px-2.5'>
                    <MessagePlusIcon size={16} />
                    Iniciar
                </FriendsActionButton>
            }
            className='p-0'
            placement='bottom-end'
            minWidth={280}
        >
            <DropdownLabel className='pt-1.5 pb-0 pl-2.75 text-xs font-semibold text-primary/80'>
                Escribir mensaje
            </DropdownLabel>
            <NewChatPopover onSend={onSend} loading={loading} />
        </Dropdown>
    );
}
