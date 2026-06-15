import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useUpdateChat } from '@chats/hooks/useUpdateChat';
import { useMarkAllAsRead } from '@chats/hooks/useMarkAllAsRead';
import { useClearAllChatMessages } from '@chats/hooks/useClearAllChatMessages';
import { useModal } from '@shared/hooks/useModal';
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
    const [ loadingStatus, setLoadingStatus ] = useState({
        pinned: false,
        favorite: false,
        read: false,
        clear: false,
        chatDeleted: false,
        chatBlocked: false,
    });
    const navigate = useNavigate();
    const chatRef = useRef(chat);
    chatRef.current = chat;
    const { update } = useUpdateChat();
    const { markAsRead } = useMarkAllAsRead();
    const { clearMessages } = useClearAllChatMessages();
    const { openConfirm } = useModal();

    function createToggleOrPersonalizedHandler(config: {
        field: keyof typeof loadingStatus;
        getValue: (c: Chat) => boolean;
    }): () => Promise<void>;
    function createToggleOrPersonalizedHandler(config: {
        field: keyof typeof loadingStatus;
        personalizedHandler: () => Promise<void>;
    }): () => Promise<void>;
    function createToggleOrPersonalizedHandler(config: {
        field: keyof typeof loadingStatus;
        getValue?: (c: Chat) => boolean;
        personalizedHandler?: () => Promise<void>;
    }) {
        return async () => {
            if (loadingStatus[config.field]) return;
            setLoadingStatus(prev => ({ ...prev, [config.field]: true }));
            
            const handler = config.personalizedHandler
                ? config.personalizedHandler
                : () => update(chatRef.current._id, { [config.field]: !config.getValue!(chatRef.current) });
            
            await handler();
            setLoadingStatus(prev => ({ ...prev, [config.field]: false }));
        };
    }

    const handlers = {
        togglePin: createToggleOrPersonalizedHandler({ field: 'pinned', getValue: c => c.chatInfo.pinned }),
        toggleFavorite: createToggleOrPersonalizedHandler({ field: 'favorite', getValue: c => c.chatInfo.favorite }),
        markAsRead: createToggleOrPersonalizedHandler({ field: 'read', personalizedHandler: () => markAsRead(chatRef.current._id) }),
        clearMessages: createToggleOrPersonalizedHandler({ field: 'clear', personalizedHandler: async () => {
            openConfirm({
                title: t('dialogs.clearTitle'),
                message: t('dialogs.clearMessage'),
                confirmText: t('dialogs.clearConfirm'),
                onConfirm: async () => clearMessages(chatRef.current._id),
                danger: true,
                awaitedAction: true
            });
        }}),
        deleteChat: createToggleOrPersonalizedHandler({ field: 'chatDeleted', personalizedHandler: async () => {
            openConfirm({
                title: t('dialogs.deleteTitle'),
                message: t('dialogs.deleteMessage'),
                confirmText: t('dialogs.deleteConfirm'),
                onConfirm: async () => {
                    await update(chatRef.current._id, { chatDeleted: true });
                    navigate('/app');
                },
                danger: true,
                awaitedAction: true
            })
        }}),
        blockChat: createToggleOrPersonalizedHandler({ field: 'chatBlocked', personalizedHandler: async () => {
            const isBlocked = chatRef.current.chatInfo.status === 'BLOCKED';

            openConfirm({
                title: isBlocked
                    ? t('dialogs.unblockTitle', { username: chatRef.current.participant.username })
                    : t('dialogs.blockTitle', { username: chatRef.current.participant.username }),
                message: isBlocked
                    ? t('dialogs.unblockMessage', { username: chatRef.current.participant.username })
                    : t('dialogs.blockMessage', { username: chatRef.current.participant.username }),
                confirmText: isBlocked ? t('dialogs.unblockConfirm') : t('dialogs.blockConfirm'),
                onConfirm: async () => update(chatRef.current._id, { chatBlocked: !isBlocked }),
                danger: true,
                awaitedAction: true
            })
        }})
    }

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
