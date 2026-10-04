import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useUpdateChat } from '@chats/hooks/useUpdateChat';
import { useMarkAllAsRead } from '@chats/hooks/useMarkAllAsRead';
import { useClearAllChatMessages } from '@chats/hooks/useClearAllChatMessages';
import { useModal } from '@shared/hooks/useModal';

import type { Chat } from '@chats/types/chat.types';

interface ChatListLoadingStatus {
    pinned: boolean;
    favorite: boolean;
    read: boolean;
    clear: boolean;
    chatDeleted: boolean;
    chatBlocked: boolean;
}

/**
 * Shared chat-row actions used by both the desktop dropdown
 * (`ChatListDropdown`) and the mobile swipe BottomSheet
 * (`ChatActionsSheetContent`).
 *
 * @param onBeforeDialog - called right before opening a confirm dialog.
 * Pass the sheet close function so the sheet is dismissed first and the
 * dialog stacks cleanly on top (the modal store renders only the last modal).
 */
export function useChatListActions(chat: Chat, opts?: { onBeforeDialog?: () => void }) {
    const { t } = useTranslation('chats');
    const [ loadingStatus, setLoadingStatus ] = useState<ChatListLoadingStatus>({
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
    const onBeforeDialogRef = useRef(opts?.onBeforeDialog);
    onBeforeDialogRef.current = opts?.onBeforeDialog;
    const { update } = useUpdateChat();
    const { markAsRead } = useMarkAllAsRead();
    const { clearMessages } = useClearAllChatMessages();
    const { openConfirm } = useModal();

    function createToggleOrPersonalizedHandler(config: {
        field: keyof ChatListLoadingStatus;
        getValue: (c: Chat) => boolean;
    }): () => Promise<void>;
    function createToggleOrPersonalizedHandler(config: {
        field: keyof ChatListLoadingStatus;
        personalizedHandler: () => Promise<void>;
    }): () => Promise<void>;
    function createToggleOrPersonalizedHandler(config: {
        field: keyof ChatListLoadingStatus;
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

    const openDialogFirst = () => onBeforeDialogRef.current?.();

    const handlers = {
        togglePin: createToggleOrPersonalizedHandler({ field: 'pinned', getValue: c => c.chatInfo.pinned }),
        toggleFavorite: createToggleOrPersonalizedHandler({ field: 'favorite', getValue: c => c.chatInfo.favorite }),
        markAsRead: createToggleOrPersonalizedHandler({ field: 'read', personalizedHandler: () => markAsRead(chatRef.current._id) }),
        clearMessages: createToggleOrPersonalizedHandler({ field: 'clear', personalizedHandler: async () => {
            openDialogFirst();
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
            openDialogFirst();
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

            openDialogFirst();
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

    return { t, loadingStatus, handlers };
}
