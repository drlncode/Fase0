import { useLayoutEffect, useRef } from 'react';
import { useChatStore } from '@chats/store/useChatStore';
import { useGetChats } from '@chats/hooks/useGetChats';
import { usePagination } from '@shared/hooks/usePagination';
import { ChatListContainerHeader } from '@chats/components/ChatListContainerHeader';
import { ChatList } from '@chats/components/ChatList';
import { ChatListSkeleton } from '@chats/components/ChatListSkeleton';
import { EmptyChatsState } from '@chats/components/EmptyChatsState';
import { FilterIdleState } from '@chats/components/FilterIdleState';
import { InfiniteLoader } from '@shared/components/InfiniteLoader';

export function ChatsListContainer() {
    const status = useChatStore(state => state.chatsFetch.status);
    const chats = useChatStore(state => state.filteredChats);
    const allChats = useChatStore(state => state.chats);
    const chatsFetched = useChatStore(state => state.chats).length;
    const totalChats = useChatStore(state => state.chatsFetch.pagination.total);
    const pagination = useChatStore(state => state.chatsFetch.pagination);
    const setPagination = useChatStore(state => state.setChatsFetchPagination);
    const selectedChatsFilter = useChatStore(state => state.selectedChatsFilter);
    const searchQuery = useChatStore(state => state.searchQuery);

    const { loadChats } = useGetChats();
    const { canFetchMore } = usePagination({ pagination, setPagination });

    const isFetching = status.status === 'fetching';
    const containerRef = useRef<HTMLDivElement>(null);
    const prevScrollTopRef = useRef<number | null>(null);

    const handleLoadMore = () => {
        const el = containerRef.current;
        if (el) {
            prevScrollTopRef.current = el.scrollTop;
        }
        const nextPage = pagination.page + 1;
        setPagination({ ...pagination, page: nextPage });
        loadChats();
    };

    useLayoutEffect(() => {
        if (!isFetching && prevScrollTopRef.current !== null) {
            const el = containerRef.current;
            if (el) {
                el.scrollTop = prevScrollTopRef.current;
            }
            prevScrollTopRef.current = null;
        }
    }, [isFetching]);

    const showFilterIdle = chats && chats.length === 0 && allChats.length > 0 && status.status === 'success';
    const idleFilterType = searchQuery ? 'SEARCH' : selectedChatsFilter;

    return (
        <div ref={containerRef} className='flex h-full min-h-0 w-91.5 shrink-0 flex-col gap-1 overflow-auto border-r border-r-default px-2.5'>
            <ChatListContainerHeader />
            <section className='flex h-full w-full flex-1 flex-col justify-between gap-1 pb-4'>
                {status.status === 'loading' && <ChatListSkeleton />}
                {chats && chats.length === 0 && allChats.length === 0 && status.status === 'success' && <EmptyChatsState />}
                {showFilterIdle && <FilterIdleState filter={idleFilterType} searchQuery={searchQuery} />}
                {chats && chats.length > 0 && (
                    <div className='flex flex-col gap-1'>
                        {chats.map(chat => (
                            <ChatList chat={chat} key={chat._id} />
                        ))}
                    </div>
                )}
                {(status.status === 'success' || isFetching) && (
                    <InfiniteLoader
                        isFetching={isFetching}
                        canFetchMore={canFetchMore}
                        onLoadMore={handleLoadMore}
                    >
                        <>{chatsFetched} de {totalChats} chats</>
                    </InfiniteLoader>
                )}
            </section>
        </div>
    );
}