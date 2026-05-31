import { useEffect, useRef } from 'react';
import { useValidAuth } from '@auth/hooks/useValidAuth';
import { useChatStore } from '@chats/store/useChatStore';
import { useMessageStore } from '@messages/store/useMessageStore';
import { getMessages } from '@messages/lib/messageActions';

const MESSAGES_PER_PAGE = Number(import.meta.env.VITE_MESSAGES_PER_PAGE) || 30;

async function fetchInitialMessages(session: string, chatId: string) {
    const { registerChat, setMessages, setChatFetchState, setChatPagination } = useMessageStore.getState();

    registerChat(chatId);
    setChatFetchState(chatId, 'loading');

    const result = await getMessages(session, chatId, { page: 1, limit: MESSAGES_PER_PAGE });

    if (result.success) {
        const { totalCount, data } = result.data;
        setChatPagination(chatId, { total: totalCount, page: 2 });
        setMessages(chatId, data.messages);
        return;
    }

    setChatFetchState(chatId, 'error', 'No fue posible recuperar los mensajes.');
}

export function useMessageSync() {
    const { status: authStatus, user: { session } } = useValidAuth();
    const isInitialized = useRef(false);
    const previousChatIds = useRef(new Set<string>());

    useEffect(() => {
        if (authStatus !== 'valid' || !session) return;

        const unsubscribe = useChatStore.subscribe(
            (state) => ({ chats: state.chats, chatsFetch: state.chatsFetch }),
            ({ chats, chatsFetch }) => {
                if (chatsFetch.status.status !== 'success' && chatsFetch.status.status !== 'fetching') return;

                const currentChatIds = new Set(chats.map(c => c._id));
                const messageStore = useMessageStore.getState();

                const addedChatIds = [...currentChatIds].filter(id => !previousChatIds.current.has(id));
                const removedChatIds = [...previousChatIds.current].filter(id => !currentChatIds.has(id));

                addedChatIds.forEach(chatId => {
                    if (!messageStore.messagesByChat.has(chatId)) {
                        fetchInitialMessages(session, chatId);
                    }
                });

                removedChatIds.forEach(chatId => {
                    messageStore.clearChatMessages(chatId);
                });

                previousChatIds.current = currentChatIds;
            }
        );

        return () => {
            unsubscribe();
            isInitialized.current = false;
        };
    }, [authStatus, session]);

    useEffect(() => {
        if (authStatus !== 'valid' || !session || isInitialized.current) return;

        const { chats } = useChatStore.getState();
        if (chats.length === 0) return;

        isInitialized.current = true;
        const messageStore = useMessageStore.getState();

        const chatIds = new Set(chats.map(c => c._id));
        const addedChatIds = [...chatIds].filter(id => !previousChatIds.current.has(id));

        addedChatIds.forEach(chatId => {
            if (!messageStore.messagesByChat.has(chatId)) {
                fetchInitialMessages(session, chatId);
            }
        });

        previousChatIds.current = chatIds;
    }, [authStatus, session]);
}