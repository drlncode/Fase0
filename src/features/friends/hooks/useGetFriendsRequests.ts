import { useCallback } from 'react';
import { useValidAuth } from '@auth/hooks/useValidAuth';
import { usePagination } from '@shared/hooks/usePagination';
import { getFriendsRequests } from '@friends/lib/friendsActions';
import { useFriendsStore } from '@friends/store/useFriendsStore';
import i18n from '@/lib/i18n';

export function useGetFriendsRequests() {
    const { status: authStatus, user: { session } } = useValidAuth();

    const friendsRequestsFetch = useFriendsStore(state => state.friendsRequestsFetch);
    const setFriendsRequestsSuccess = useFriendsStore(state => state.setFriendsRequestsSuccess);
    const setFriendsRequestsFetchStatus = useFriendsStore(state => state.setFriendsRequestsFetchStatus);
    const setFriendsRequestsFetchPagination = useFriendsStore(state => state.setFriendsRequestsFetchPagination);

    const { canFetchMore, nextPage } = usePagination({
        pagination: friendsRequestsFetch.pagination,
        setPagination: setFriendsRequestsFetchPagination,
    });

    const loadFriendsRequests = useCallback(async () => {
        if (authStatus !== 'valid' || !session) {
            setFriendsRequestsFetchStatus({ status: 'error', message: i18n.t('friends:errors.invalidSession') });
            return;
        }

        const { friendsRequests, friendsRequestsFetch } = useFriendsStore.getState();
        const hasRequests = friendsRequests.length > 0;

        if (nextPage && canFetchMore) {
            setFriendsRequestsFetchStatus({ status: 'fetching' });
        } else {
            setFriendsRequestsFetchStatus(hasRequests ? { status: 'fetching' } : { status: 'loading' });
        }

        const currentPage = (nextPage && canFetchMore) ? nextPage : friendsRequestsFetch.pagination.page;
        const result = await getFriendsRequests({ page: currentPage, limit: friendsRequestsFetch.pagination.limit });

        if (result.success) {
            const { totalCount, data } = result.data;
            setFriendsRequestsFetchPagination({ total: totalCount, page: currentPage + 1 });
            setFriendsRequestsSuccess(data.friendsRequests);
            return;
        }

        setFriendsRequestsFetchStatus({ status: 'error', message: i18n.t('friends:errors.fetchRequests') });
    }, [authStatus, session, canFetchMore, nextPage, setFriendsRequestsSuccess, setFriendsRequestsFetchStatus, setFriendsRequestsFetchPagination]);

    return { status: friendsRequestsFetch.status, loadFriendsRequests };
}