import { useCallback } from 'react';
import { useValidAuth } from '@auth/hooks/useValidAuth';
import { usePagination } from '@shared/hooks/usePagination';
import { getFriendsSentRequests } from '@friends/lib/friendsActions';
import { useFriendsStore } from '@friends/store/useFriendsStore';
import i18n from '@/lib/i18n';

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
            setFriendsSentRequestsFetchStatus({ status: 'error', message: i18n.t('friends:errors.invalidSession') });
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
        const result = await getFriendsSentRequests({ page: currentPage, limit: friendsSentRequestsFetch.pagination.limit });

        if (result.success) {
            const { totalCount, data } = result.data;
            setFriendsSentRequestsFetchPagination({ total: totalCount, page: currentPage + 1 });
            setFriendsSentRequestsSuccess(data.friendsRequests);
            return;
        }

        setFriendsSentRequestsFetchStatus({ status: 'error', message: i18n.t('friends:errors.fetchSentRequests') });
    }, [authStatus, session, canFetchMore, nextPage, setFriendsSentRequestsSuccess, setFriendsSentRequestsFetchStatus, setFriendsSentRequestsFetchPagination]);

    return { status: friendsSentRequestsFetch.status, loadFriendsSentRequests };
}