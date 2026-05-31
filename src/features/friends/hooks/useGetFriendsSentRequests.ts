import { useCallback } from 'react';
import { useValidAuth } from '@auth/hooks/useValidAuth';
import { usePagination } from '@shared/hooks/usePagination';
import { getFriendsSentRequests } from '@friends/lib/friendsActions';
import { useFriendsStore } from '@friends/store/useFriendsStore';

export function useGetFriendsSentRequests() {
    const { status: authStatus, user: { session } } = useValidAuth();

    const friendsSentRequestsFetch = useFriendsStore(state => state.friendsSentRequestsFetch);
    const setFriendsSentRequestsSuccess = useFriendsStore(state => state.setFriendsSentRequestsSuccess);
    const setFriendsSentRequestsFetchStatus = useFriendsStore(state => state.setFriendsSentRequestsFetchStatus);
    const setFriendsSentRequestsFetchPagination = useFriendsStore(state => state.setFriendsSentRequestsFetchPagination);

    const { canFetchMore, nextPage } = usePagination({
        pagination: friendsSentRequestsFetch.pagination,
        setPagination: setFriendsSentRequestsFetchPagination,
    });

    const loadFriendsSentRequests = useCallback(async () => {
        if (authStatus !== 'valid' || !session) {
            setFriendsSentRequestsFetchStatus({ status: 'error', message: 'Sesión inválida.' });
            return;
        }

        const { friendsSentRequests, friendsSentRequestsFetch } = useFriendsStore.getState();
        const hasSentRequests = friendsSentRequests.length > 0;

        if (nextPage && canFetchMore) {
            setFriendsSentRequestsFetchStatus({ status: 'fetching' });
        } else {
            setFriendsSentRequestsFetchStatus(hasSentRequests ? { status: 'fetching' } : { status: 'loading' });
        }

        const currentPage = (nextPage && canFetchMore) ? nextPage : friendsSentRequestsFetch.pagination.page;
        const result = await getFriendsSentRequests(session, { page: currentPage, limit: friendsSentRequestsFetch.pagination.limit });

        if (result.success) {
            const { totalCount, data } = result.data;
            setFriendsSentRequestsFetchPagination({ total: totalCount, page: currentPage + 1 });
            setFriendsSentRequestsSuccess(data.friendsRequests);
            return;
        }

        setFriendsSentRequestsFetchStatus({ status: 'error', message: 'No fue posible recuperar las solicitudes enviadas.' });
    }, [authStatus, session, canFetchMore, nextPage, setFriendsSentRequestsSuccess, setFriendsSentRequestsFetchStatus, setFriendsSentRequestsFetchPagination]);

    return { status: friendsSentRequestsFetch.status, loadFriendsSentRequests };
}