import { useFriendsStore } from '@friends/store/useFriendsStore';
import { useGetFriends } from '@friends/hooks/useGetFriends';
import { usePagination } from '@shared/hooks/usePagination';
import { CollapseableSection } from '@friends/components/CollapseableSection';
import { FriendItem } from '@friends/components/FriendsList/FriendItem';
import { FriendSectionSkeleton } from '@friends/components/FriendItemSkeleton';
import { EmptyFriendsState } from '@friends/components/FriendsList/EmptyFriendsState';
import { InfiniteLoader } from '@shared/components/InfiniteLoader';
import { UsersIcon } from '@/shared/components/ui/Icons';

export function FriendsListSection({ highlight = false }) {
    const friendsFetch = useFriendsStore(state => state.friendsFetch);
    const friends = useFriendsStore(state => state.friends);
    const friendsCount = friends.length;
    const totalFriends = friendsFetch.pagination.total ?? 0;
    const isLoading = friendsFetch.status.status === 'loading';
    const isFetching = friendsFetch.status.status === 'fetching';

    const { loadFriends } = useGetFriends();
    const { canFetchMore, incrementPage } = usePagination({
        pagination: friendsFetch.pagination,
        setPagination: useFriendsStore.getState().setFriendsFetchPagination,
    });

    const handleLoadMore = () => {
        incrementPage();
        loadFriends();
    };

    return (
        <CollapseableSection
            title='amigos'
            icon={<UsersIcon size={16} />}
            loading={isLoading || isFetching}
            defaultOpen={highlight}
            highlight={highlight}
            notification={friendsCount}
            position='first'
            empty={friends.length === 0 && !isLoading}
        >
            {isLoading ? (
                <FriendSectionSkeleton />
            ) : friends.length === 0 ? (
                <EmptyFriendsState />
            ) : (
                <>
                    {friends.map(f => (
                        <FriendItem key={f._id} friendship={f} />
                    ))}
                    {(friendsFetch.status.status === 'success' || isFetching) && (
                        <InfiniteLoader
                            isFetching={isFetching}
                            canFetchMore={canFetchMore}
                            onLoadMore={handleLoadMore}
                        >
                            <>{friendsCount} de {totalFriends} amigos</>
                        </InfiniteLoader>
                    )}
                </>
            )}
        </CollapseableSection>
    );
}