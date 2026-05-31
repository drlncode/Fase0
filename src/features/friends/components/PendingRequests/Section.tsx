import { useFriendsStore } from '@friends/store/useFriendsStore';
import { useGetFriendsRequests } from '@friends/hooks/useGetFriendsRequests';
import { usePagination } from '@shared/hooks/usePagination';
import { CollapseableSection } from '@friends/components/CollapseableSection';
import { PendingRequestItem } from '@friends/components/PendingRequests/PendingRequestItem';
import { FriendSectionSkeleton } from '@friends/components/FriendItemSkeleton';
import { EmptyPendingRequestsState } from '@friends/components/PendingRequests/EmptyPendingRequestsState';
import { InfiniteLoader } from '@shared/components/InfiniteLoader';
import { UserClockIcon } from '@/shared/components/ui/Icons';

export function PendingRequestsSection({ highlight = false }) {
    const friendsRequestsFetch = useFriendsStore(state => state.friendsRequestsFetch);
    const friendsRequests = useFriendsStore(state => state.friendsRequests);
    const requestsCount = friendsRequests.length;
    const totalRequests = friendsRequestsFetch.pagination.total ?? 0;
    const isLoading = friendsRequestsFetch.status.status === 'loading';
    const isFetching = friendsRequestsFetch.status.status === 'fetching';

    const { loadFriendsRequests } = useGetFriendsRequests();
    const { canFetchMore, incrementPage } = usePagination({
        pagination: friendsRequestsFetch.pagination,
        setPagination: useFriendsStore.getState().setFriendsRequestsFetchPagination,
    });

    const handleLoadMore = () => {
        incrementPage();
        loadFriendsRequests();
    };

    return (
        <CollapseableSection
            title='Solicitudes pendientes'
            icon={<UserClockIcon size={16} />}
            loading={isLoading || isFetching}
            defaultOpen={highlight}
            highlight={highlight}
            notification={requestsCount}
            position='middle'
            empty={friendsRequests.length === 0 && !isLoading}
        >
            {isLoading ? (
                <FriendSectionSkeleton />
            ) : friendsRequests.length === 0 ? (
                <EmptyPendingRequestsState />
            ) : (
                <>
                    {friendsRequests.map(request => (
                        <PendingRequestItem key={request._id} request={request} />
                    ))}
                    {(friendsRequestsFetch.status.status === 'success' || isFetching) && (
                        <InfiniteLoader
                            isFetching={isFetching}
                            canFetchMore={canFetchMore}
                            onLoadMore={handleLoadMore}
                        >
                            <>{requestsCount} de {totalRequests} solicitudes</>
                        </InfiniteLoader>
                    )}
                </>
            )}
        </CollapseableSection>
    );
}