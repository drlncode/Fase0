import { useState } from 'react';
import { useValidAuth } from '@auth/hooks/useValidAuth';
import { useChatStore } from '@chats/store/useChatStore';
import { useToast } from '@/shared/hooks/useToast';
import { updateChat } from '@chats/lib/chatActions';

import type { ActionHookState } from '@shared/types/global.types';
import type { Chat, UpdatableChatData } from '@chats/types/chat.types';

function buildOptimisticChat(previousChat: Chat, toUpdate: UpdatableChatData) {
    if (toUpdate.chatDeleted) return null;

    const nextChatInfo = {
        ...previousChat.chatInfo,
        ...(toUpdate.favorite !== undefined ? { favorite: toUpdate.favorite } : {}),
        ...(toUpdate.pinned !== undefined ? { pinned: toUpdate.pinned } : {}),
        ...(toUpdate.chatBlocked !== undefined
            ? { status: toUpdate.chatBlocked ? 'BLOCKED' as const : previousChat.chatInfo.status }
            : {})
    };

    return {
        ...previousChat,
        chatInfo: nextChatInfo
    };
}

export function useUpdateChat() {
    const { status: authStatus, user: { session } } = useValidAuth();
    const findChat = useChatStore(state => state.findChat);
    const updateStoredChat = useChatStore(state => state.updateChat);
    const removeStoredChat = useChatStore(state => state.removeChat);
    const { success, danger } = useToast();

    if (authStatus !== 'valid' || !session)
        throw new Error('Cannot update a chat without a valid user session.');

    const [ status, setStatus ] = useState<ActionHookState<Chat | null>>({ status: 'idle' });

    function getSuccessMessage(toUpdate: UpdatableChatData): string {
        if (toUpdate.chatDeleted) return 'Chat eliminado correctamente.';
        if (toUpdate.chatBlocked !== undefined) return `Usuario ${toUpdate.chatBlocked ? 'bloqueado' : 'desbloqueado'} correctamente.`;
        if (toUpdate.favorite !== undefined) return `Chat ${toUpdate.favorite ? 'agregado a' : 'removido de'} favoritos.`;
        if (toUpdate.pinned !== undefined) return `Chat ${toUpdate.pinned ? 'fijado' : 'desfijado'} correctamente.`;
        return 'Chat actualizado correctamente.';
    }

    async function update(chatId: string, toUpdate: UpdatableChatData) {
        const previousChat = findChat(chatId);
        if (!previousChat) return;

        const optimisticChat = buildOptimisticChat(previousChat, toUpdate);
        const shouldUseOptimisticUpdate = optimisticChat !== null && !toUpdate.chatDeleted;

        if (shouldUseOptimisticUpdate) {
            updateStoredChat(optimisticChat);
        }

        if (toUpdate.chatDeleted) {
            removeStoredChat(previousChat);
        }

        setStatus({ status: 'loading' });

        const result = await updateChat(session, chatId, toUpdate);

        if (result.success) {
            success(getSuccessMessage(toUpdate));

            if (toUpdate.chatDeleted) {
                removeStoredChat(previousChat);
                return;
            }

            setStatus({ status: 'success' as const, data: result.data });
            return;
        } else {
            if (shouldUseOptimisticUpdate) {
                updateStoredChat(previousChat);
                return;
            }

            const name = `@${previousChat.participant.username}`;
            danger(`Error al actualizar el chat de ${name}. Intenta de nuevo más tarde.`);
            
            setStatus({
                status: 'error' as const,
                message: 'No fue posible actualizar el chat.'
            });
        }
    }

    return {
        status,
        update
    }
}
