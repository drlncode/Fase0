import { useTranslation } from 'react-i18next';
import { Avatar } from '@shared/components/Avatar';
import { useAvatarUrl } from '@shared/hooks/useAvatarUrl';
import { useModal } from '@shared/hooks/useModal';
import { useChatListActions } from '@chats/hooks/useChatListActions';
import { ChatOptionsDropdownContext } from '@chats/components/ChatOptionsDropdown';
import { ChatOption } from '@chats/components/ChatOption';
import { Divisor } from '@shared/components/ui/Divisor';
import {
    PinIcon,
    PinOffIcon,
    StarIcon,
    StarOffIcon,
    MessageCheckIcon,
    MessageOffIcon,
    TrashIcon,
    CircleOffIcon
} from '@/shared/components/ui/Icons';

import type { Chat } from '@chats/types/chat.types';

const iconsSize = 20;

/**
 * Mobile BottomSheet content with the same actions as `ChatListDropdown`,
 * opened via horizontal swipe. Touch targets are larger (min 44px).
 */
export function ChatActionsSheetContent({ chat }: { chat: Chat }) {
    const { t } = useTranslation('chats');
    const { close } = useModal();
    const { onError, url } = useAvatarUrl(chat.participant.avatar, chat.participant._id);
    const { loadingStatus, handlers } = useChatListActions(chat, { onBeforeDialog: close });

    return (
        <ChatOptionsDropdownContext.Provider value={{ close }}>
            <div className='flex items-center gap-3 pr-10 pb-3'>
                <Avatar
                    url={url}
                    userUrlStatus={chat.participant.avatar}
                    externalError={onError}
                    alt={t('list.avatarAlt', { name: chat.participant.name.split(' ')[0] })}
                    name={chat.participant.name}
                />
                <div className='flex min-w-0 flex-col'>
                    <span className='truncate text-sm font-medium text-primary'>{chat.participant.name}</span>
                    <span className='truncate text-xs text-secondary'>@{chat.participant.username}</span>
                </div>
            </div>
            <Divisor />
            <div className='flex flex-col gap-0.5 pt-2'>
                <ChatOption
                    icon={chat.chatInfo.pinned ? <PinOffIcon size={iconsSize} /> : <PinIcon size={iconsSize} />}
                    label={chat.chatInfo.pinned ? t('dropdown.unpin') : t('dropdown.pin')}
                    handler={handlers.togglePin}
                    disabled={loadingStatus.pinned}
                    className='min-h-11 px-3 py-3 text-sm'
                />
                <ChatOption
                    icon={chat.chatInfo.favorite ? <StarOffIcon size={iconsSize} /> : <StarIcon size={iconsSize} />}
                    label={chat.chatInfo.favorite ? t('dropdown.removeFromFavorites') : t('dropdown.addToFavorites')}
                    handler={handlers.toggleFavorite}
                    disabled={loadingStatus.favorite}
                    className='min-h-11 px-3 py-3 text-sm'
                />
                <ChatOption
                    icon={<MessageCheckIcon size={iconsSize} />}
                    label={t('dropdown.markAsRead')}
                    handler={handlers.markAsRead}
                    disabled={!chat.chatInfo.unreadMessages || loadingStatus.read}
                    className='min-h-11 px-3 py-3 text-sm'
                />
                <Divisor className='my-1' />
                <ChatOption
                    icon={<MessageOffIcon size={iconsSize} />}
                    label={t('dropdown.clear')}
                    danger
                    handler={handlers.clearMessages}
                    disabled={loadingStatus.clear}
                    closeOnClick={false}
                    className='min-h-11 px-3 py-3 text-sm'
                />
                <ChatOption
                    icon={<TrashIcon size={iconsSize} />}
                    label={t('dropdown.delete')}
                    danger
                    handler={handlers.deleteChat}
                    disabled={loadingStatus.chatDeleted}
                    closeOnClick={false}
                    className='min-h-11 px-3 py-3 text-sm'
                />
                <ChatOption
                    icon={<CircleOffIcon size={iconsSize} />}
                    label={chat.chatInfo.status === 'BLOCKED'
                        ? t('dropdown.unblockUser', { username: chat.participant.username })
                        : t('dropdown.blockUser', { username: chat.participant.username })}
                    danger
                    handler={handlers.blockChat}
                    disabled={loadingStatus.chatBlocked}
                    closeOnClick={false}
                    className='min-h-11 px-3 py-3 text-sm'
                />
            </div>
        </ChatOptionsDropdownContext.Provider>
    );
}
