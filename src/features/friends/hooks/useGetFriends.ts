import { useCallback } from 'react';
import { useValidAuth } from '@auth/hooks/useValidAuth';
import { usePagination } from '@shared/hooks/usePagination';
import { getFriends } from '@friends/lib/friendsActions';
import { useFriendsStore } from '@friends/store/useFriendsStore';

export function useGetFriends() {
    const { status: authStatus, user: { session } } = useValidAuth();

    const friendsFetch = useFriendsStore(state => state.friendsFetch);
    const setFriendsSuccess = useFriendsStore(state => state.setFriendsSuccess);
    const setFriendsFetchStatus = useFriendsStore(state => state.setFriendsFetchStatus);
    const setFriendsFetchPagination = useFriendsStore(state => state.setFriendsFetchPagination);

    const { canFetchMore, nextPage } = usePagination({
        pagination: friendsFetch.pagination,
        setPagination: setFriendsFetchPagination,
    });

    const loadFriends = useCallback(async () => {
        if (authStatus !== 'valid' || !session) {
            setFriendsFetchStatus({ status: 'error', message: 'Sesión inválida.' });
            return;
        }

        const { friends, friendsFetch } = useFriendsStore.getState();
        const hasFriends = friends.length > 0;

        if (nextPage && canFetchMore) {
            setFriendsFetchStatus({ status: 'fetching' });
        } else {
            setFriendsFetchStatus(hasFriends ? { status: 'fetching' } : { status: 'loading' });
        }

        const currentPage = (nextPage && canFetchMore) ? nextPage : friendsFetch.pagination.page;
        const result = await getFriends(session, { page: currentPage, limit: friendsFetch.pagination.limit });

        if (result.success) {
            const { totalCount, data } = result.data;
            setFriendsFetchPagination({ total: totalCount, page: currentPage + 1 });
            setFriendsSuccess(data.friends);
            return;
        }

        setFriendsFetchStatus({ status: 'error', message: 'No fue posible recuperar los amigos.' });
    }, [authStatus, session, canFetchMore, nextPage, setFriendsSuccess, setFriendsFetchStatus, setFriendsFetchPagination]);

    return { status: friendsFetch.status, loadFriends };
}