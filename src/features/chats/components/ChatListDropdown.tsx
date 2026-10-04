import { useTranslation } from 'react-i18next';
import { useChatListActions } from '@chats/hooks/useChatListActions';
import { ChatOptionsDropdown } from '@chats/components/ChatOptionsDropdown';
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

const iconsSize = 16;

export function ChatListDropdown({ chat }: { chat: Chat }) {
    const { t } = useTranslation('chats');
    const { loadingStatus, handlers } = useChatListActions(chat);

    return (
        <ChatOptionsDropdown 
            pinned={chat.chatInfo.pinned}
            favorite={chat.chatInfo.favorite}
            unreadMessages={chat.chatInfo.unreadMessages}
        >
            <ChatOption
                icon={chat.chatInfo.pinned ? <PinOffIcon size={iconsSize} /> : <PinIcon size={iconsSize} />}
                label={chat.chatInfo.pinned ? t('dropdown.unpin') : t('dropdown.pin')}
                handler={handlers.togglePin}
                disabled={loadingStatus.pinned}
            />
            <ChatOption
                icon={chat.chatInfo.favorite ? <StarOffIcon size={iconsSize} /> : <StarIcon size={iconsSize} />}
                label={chat.chatInfo.favorite ? t('dropdown.removeFromFavorites') : t('dropdown.addToFavorites')}
                handler={handlers.toggleFavorite}
                disabled={loadingStatus.favorite}
            />
            <Divisor className='w-[95%]' />
            <ChatOption
                icon={<MessageCheckIcon size={iconsSize} />}
                label={t('dropdown.markAsRead')}
                handler={handlers.markAsRead}
                disabled={!chat.chatInfo.unreadMessages || loadingStatus.read}
            />
            <Divisor className='w-[95%]' />
            <ChatOption
                icon={<MessageOffIcon size={iconsSize} />}
                label={t('dropdown.clear')}
                danger
                handler={handlers.clearMessages}
                disabled={loadingStatus.clear}
            />
            <ChatOption
                icon={<TrashIcon size={iconsSize} />}
                label={t('dropdown.delete')}
                danger
                handler={handlers.deleteChat}
                disabled={loadingStatus.chatDeleted}
            />
            <ChatOption
                icon={<CircleOffIcon size={iconsSize} />}
                label={chat.chatInfo.status === 'BLOCKED'
                    ? t('dropdown.unblockUser', { username: chat.participant.username })
                    : t('dropdown.blockUser', { username: chat.participant.username })}
                danger
                handler={handlers.blockChat}
                disabled={loadingStatus.chatBlocked}
            />
        </ChatOptionsDropdown>
    );
}
