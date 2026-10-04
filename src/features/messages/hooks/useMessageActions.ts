import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useValidAuth } from '@auth/hooks/useValidAuth';
import { useChatStore } from '@/features/chats/store/useChatStore';
import { useUpdateMessage } from '@messages/hooks/useUpdateMessage';
import { useCountdown } from '@shared/hooks/useCountdown';
import { useModal } from '@shared/hooks/useModal';
import { useToast } from '@shared/hooks/useToast';
import { isDeletedMessage } from '@messages/utils/isDeletedMessage';

import type { StoreMessage, OptimisticMessage } from '@messages/types/message.types';

export function isOptimisticMessage(message: StoreMessage): message is OptimisticMessage {
    return message.status === 'SENDING';
}

/**
 * Shared message actions used by both the desktop dropdown (`Message`)
 * and the mobile swipe BottomSheet (`MessageActionsSheetContent`).
 *
 * @param onBeforeDialog - called right before opening a confirm dialog.
 * Pass the sheet close function so the sheet is dismissed first and the
 * dialog stacks cleanly on top (the modal store renders only the last modal).
 */
export function useMessageActions(message: StoreMessage, opts?: { onBeforeDialog?: () => void }) {
    const { t } = useTranslation('messages');
    const { user: { _id: currentUserId } } = useValidAuth();
    const isSender = currentUserId === message.senderId;
    const [ copied, setCopied ] = useState(false);
    const { status: { status: updateStatus }, update } = useUpdateMessage();
    const { openConfirm } = useModal();
    const { success } = useToast();
    const isOptimisticMsg = isOptimisticMessage(message);
    const validToDelete = !isOptimisticMsg && !isDeletedMessage(message) && message.deletableUntil > Date.now();
    const validToEdit = !isOptimisticMsg && !isDeletedMessage(message) && message.editInfo.editableUntil > Date.now();
    const { isPending: isTimeRemainingForDelete } = useCountdown((() => {
        if (validToDelete && !isOptimisticMsg) return message.deletableUntil;
        return null;
    })());
    const { isPending: isTimeRemainingForEdit } = useCountdown((() => {
        if (validToEdit && !isOptimisticMsg) return message.editInfo.editableUntil;
        return null;
    })());

    const handleCopy = () => {
        if (isDeletedMessage(message) || isOptimisticMsg) return;
        navigator.clipboard.writeText(message.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    const handleEdit = () => {
        if (isDeletedMessage(message) || isOptimisticMsg) return;

        useChatStore.getState().setOnEditMessage({ chatId: message.chatId, message });
    }

    const handleReply = () => {
        useChatStore.getState().setOnReplyMessage({ chatId: message.chatId, messageId: message._id });
    }

    const handleDeleteForMe = () => {
        opts?.onBeforeDialog?.();
        openConfirm({
            title: t('dialogs.deleteForMe.title'),
            message: t('dialogs.deleteForMe.message'),
            confirmText: t('dialogs.deleteForMe.confirm'),
            onConfirm: () => update(message.chatId, message._id, { deleted: true }),
            onSuccess: () => success(t('toast.deletedForMe')),
            awaitedAction: true,
            danger: true
        });
    }

    const handleDeleteForEveryone = () => {
        opts?.onBeforeDialog?.();
        openConfirm({
            title: t('dialogs.deleteForEveryone.title'),
            message: t('dialogs.deleteForEveryone.message'),
            confirmText: t('dialogs.deleteForEveryone.confirm'),
            onConfirm: () => update(message.chatId, message._id, { deletedDef: true }),
            onSuccess: () => success(t('toast.deletedForEveryone')),
            awaitedAction: true,
            danger: true
        });
    }

    return {
        t,
        copied,
        updateStatus,
        isSender,
        isTimeRemainingForDelete,
        isTimeRemainingForEdit,
        handlers: {
            copy: handleCopy,
            edit: handleEdit,
            reply: handleReply,
            deleteForMe: handleDeleteForMe,
            deleteForEveryone: handleDeleteForEveryone,
        },
    };
}
