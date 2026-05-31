import { useFriendsStore } from '@friends/store/useFriendsStore';
import { useGetFriendsSentRequests } from '@friends/hooks/useGetFriendsSentRequests';
import { usePagination } from '@shared/hooks/usePagination';
import { CollapseableSection } from '@friends/components/CollapseableSection';
import { PendingSentRequestItem } from './PendingSentRequestItem';
import { FriendSectionSkeleton } from '@friends/components/FriendItemSkeleton';
import { EmptySentRequestsState } from './EmptySentRequestsState';
import { InfiniteLoader } from '@shared/components/InfiniteLoader';
import { UserShareIcon } from '@/shared/components/ui/Icons';

export function PendingSentRequestsSection({ highlight = false }) {
    const friendsSentRequestsFetch = useFriendsStore(state => state.friendsSentRequestsFetch);
    const friendsSentRequests = useFriendsStore(state => state.friendsSentRequests);
    const requestsCount = friendsSentRequests.length;
    const totalRequests = friendsSentRequestsFetch.pagination.total ?? 0;
    const isLoading = friendsSentRequestsFetch.status.status === 'loading';
    const isFetching = friendsSentRequestsFetch.status.status === 'fetching';

    const { loadFriendsSentRequests } = useGetFriendsSentRequests();
    const { canFetchMore, incrementPage } = usePagination({
        pagination: friendsSentRequestsFetch.pagination,
        setPagination: useFriendsStore.getState().setFriendsSentRequestsFetchPagination,
    });

    const handleLoadMore = () => {
        incrementPage();
        loadFriendsSentRequests();
    };

    return (
        <CollapseableSection
            title='Solicitudes enviadas'
            icon={<UserShareIcon size={16} />}
            loading={isLoading || isFetching}
            defaultOpen={highlight}
            highlight={highlight}
            notification={requestsCount}
            position='last'
            empty={friendsSentRequests.length === 0 && !isLoading}
        >
            {isLoading ? (
                <FriendSectionSkeleton />
            ) : friendsSentRequests.length === 0 ? (
                <EmptySentRequestsState />
            ) : (
                <>
                    {friendsSentRequests.map(request => (
                        <PendingSentRequestItem key={request._id} request={request} />
                    ))}
                    {(friendsSentRequestsFetch.status.status === 'success' || isFetching) && (
                        <InfiniteLoader
                            isFetching={isFetching}
                            canFetchMore={canFetchMore}
                            onLoadMore={handleLoadMore}
                        >
                            <>{requestsCount} de {totalRequests} enviadas</>
                        </InfiniteLoader>
                    )}
                </>
            )}
        </CollapseableSection>
    );
}