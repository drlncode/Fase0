import { useCallback } from 'react';
import { useValidAuth } from '@auth/hooks/useValidAuth';
import { usePagination } from '@shared/hooks/usePagination';
import { getAllChats } from '@chats/lib/chatActions';
import { useChatStore } from '@chats/store/useChatStore';

export function useGetChats() {
    const { status: authStatus, user: { session } } = useValidAuth();

    const chatsFetch = useChatStore(state => state.chatsFetch);
    const setChatsSuccess = useChatStore(state => state.setChatsSuccess);
    const setChatsFetchStatus = useChatStore(state => state.setChatsFetchStatus);
    const setChatsFetchPagination = useChatStore(state => state.setChatsFetchPagination);

    const { canFetchMore, nextPage } = usePagination({
        pagination: chatsFetch.pagination,
        setPagination: setChatsFetchPagination,
    });

    const loadChats = useCallback(async () => {
        if (authStatus !== 'valid' || !session) {
            setChatsFetchStatus({ status: 'error', message: 'Sesión inválida.' });
            return;
        }

        const { chats, chatsFetch } = useChatStore.getState();
        const hasChats = chats.length > 0;
        setChatsFetchStatus(hasChats ? { status: 'fetching' } : { status: 'loading' });

        const currentPage = (nextPage && canFetchMore) ? nextPage : chatsFetch.pagination.page;
        const result = await getAllChats(session, { page: currentPage, limit: chatsFetch.pagination.limit });

        if (result.success) {
            const { totalCount, data } = result.data;
            setChatsFetchPagination({ total: totalCount, page: currentPage + 1 });
            setChatsSuccess(data.chats);
            return;
        }

        setChatsFetchStatus({ status: 'error', message: 'No fue posible recuperar los chats.' });
    }, [authStatus, session, canFetchMore, nextPage, setChatsSuccess, setChatsFetchStatus, setChatsFetchPagination]);

    return { status: chatsFetch.status, loadChats };
}