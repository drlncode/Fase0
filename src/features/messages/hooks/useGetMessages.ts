import { useCallback } from 'react';
import { useValidAuth } from '@auth/hooks/useValidAuth';
import { useMessageStore } from '@messages/store/useMessageStore';
import { getMessages } from '@messages/lib/messageActions';

import type { ChatMessageState } from '@messages/types/message.types';

const IDLE_STATE: ChatMessageState = {
    state: 'idle',
    messages: [],
    pagination: { page: 1, limit: Number(import.meta.env.VITE_MESSAGES_PER_PAGE) || 30, total: null }
};

export function useGetMessages(chatId: string) {
    const { status: authStatus, user: { session } } = useValidAuth();
    const chatState = useMessageStore(state => state.messagesByChat.get(chatId)) ?? IDLE_STATE;

    const setMessages = useMessageStore(state => state.setMessages);
    const setChatFetchState = useMessageStore(state => state.setChatFetchState);
    const setChatPagination = useMessageStore(state => state.setChatPagination);

    const loadMore = useCallback(async () => {
        if (authStatus !== 'valid' || !session) return;

        const state = useMessageStore.getState();
        const chatEntry = state.messagesByChat.get(chatId);
        if (!chatEntry) return;

        const { pagination } = chatEntry;
        const canFetchMore = pagination.total !== null
            && pagination.page <= Math.ceil(pagination.total / pagination.limit);
        if (!canFetchMore) return;

        setChatFetchState(chatId, 'fetching');

        const result = await getMessages(session, chatId, { page: pagination.page, limit: pagination.limit });

        if (result.success) {
            const { totalCount, data } = result.data;
            setChatPagination(chatId, { total: totalCount, page: pagination.page + 1 });
            setMessages(chatId, data.messages);
            return;
        }

        setChatFetchState(chatId, 'error', 'No fue posible recuperar los mensajes.');
    }, [authStatus, session, chatId, setMessages, setChatFetchState, setChatPagination]);

    return {
        state: chatState.state,
        messages: chatState.messages,
        pagination: chatState.pagination,
        loadMore
    };
}