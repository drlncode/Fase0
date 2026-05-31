import { useState, useRef } from 'react';
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
                title: '¿Vaciar el chat?',
                message: 'Esta acción eliminará todos los mensajes del chat. Esta acción no se puede deshacer.',
                confirmText: 'Vaciar',
                onConfirm: async () => clearMessages(chatRef.current._id),
                danger: true,
                awaitedAction: true
            });
        }}),
        deleteChat: createToggleOrPersonalizedHandler({ field: 'chatDeleted', personalizedHandler: async () => {
            openConfirm({
                title: '¿Eliminar el chat?',
                message: 'Esta acción eliminará el chat y todos sus mensajes. Esta acción no se puede deshacer.',
                confirmText: 'Eliminar',
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
                    ? `¿Desbloquear a @${chatRef.current.participant.username}?`
                    : `¿Bloquear a @${chatRef.current.participant.username}?`,
                message: isBlocked
                    ? `Podrás volver a enviar y recibir mensajes de @${chatRef.current.participant.username}.`
                    : `Esta acción bloqueará a @${chatRef.current.participant.username} y no podrás enviar ni recibir mensajes de este usuario.`,
                confirmText: isBlocked ? 'Desbloquear' : 'Bloquear',
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
                label={chat.chatInfo.pinned ? 'Desfijar' : 'Fijar'}
                handler={handlers.togglePin}
                disabled={loadingStatus.pinned}
            />
            <ChatOption
                icon={chat.chatInfo.favorite ? <StarOffIcon size={iconsSize} /> : <StarIcon size={iconsSize} />}
                label={chat.chatInfo.favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                handler={handlers.toggleFavorite}
                disabled={loadingStatus.favorite}
            />
            <Divisor className='w-[95%]' />
            <ChatOption
                icon={<MessageCheckIcon size={iconsSize} />}
                label='Marcar mensajes como leidos'
                handler={handlers.markAsRead}
                disabled={!chat.chatInfo.unreadMessages || loadingStatus.read}
            />
            <Divisor className='w-[95%]' />
            <ChatOption
                icon={<MessageOffIcon size={iconsSize} />}
                label='Vaciar'
                danger
                handler={handlers.clearMessages}
                disabled={loadingStatus.clear}
            />
            <ChatOption
                icon={<TrashIcon size={iconsSize} />}
                label='Eliminar'
                danger
                handler={handlers.deleteChat}
                disabled={loadingStatus.chatDeleted}
            />
            <ChatOption
                icon={<CircleOffIcon size={iconsSize} />}
                label={chat.chatInfo.status === 'BLOCKED'
                    ? `Desbloquear a @${chat.participant.username}`
                    : `Bloquear a @${chat.participant.username}`}
                danger
                handler={handlers.blockChat}
                disabled={loadingStatus.chatBlocked}
            />
        </ChatOptionsDropdown>
    );
}
