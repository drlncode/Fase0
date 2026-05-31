import { Fragment, useRef, useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { useValidAuth } from '@auth/hooks/useValidAuth';
import { useGetMessages } from '@messages/hooks/useGetMessages';
import { Message } from '@messages/components/Message';
import { DateSeparator } from '@messages/components/DateSeparator';
import { MessagesGroupSeparation } from '@messages/components/MessagesGroupSeparation';
import { MessagesContainerSkeleton } from '@messages/components/MessagesContainerSkeleton';
import { groupMessagesByDate } from '@messages/utils/groupMessagesByDate';
import { InfiniteLoader } from '@shared/components/InfiniteLoader';
import { ChevronDownIcon } from '@/shared/components/ui/Icons';

const SCROLL_BOTTOM_THRESHOLD = 100;

function isNearBottom(container: HTMLElement): boolean {
    return container.scrollHeight - container.scrollTop - container.clientHeight < SCROLL_BOTTOM_THRESHOLD;
}

function scrollToBottom(container: HTMLElement, smooth = false) {
    let attempts = 0;
    const maxAttempts = 5;

    const tryScroll = () => {
        attempts++;
        const maxScroll = container.scrollHeight - container.clientHeight;
        container.scrollTo({ top: maxScroll, behavior: smooth ? 'smooth' : 'auto' });

        const diff = Math.abs(container.scrollTop - maxScroll);
        if (diff > 1 && attempts < maxAttempts) {
            requestAnimationFrame(tryScroll);
        }
    };

    requestAnimationFrame(tryScroll);
}

export function MessagesContainer({ chatId }: { chatId: string }) {
    const { user: { _id: currentUserId } } = useValidAuth();
    const { state, messages, pagination, loadMore } = useGetMessages(chatId);
    const sortedMessages = [...messages].reverse();
    const dateGroups = groupMessagesByDate(sortedMessages);
    const scrollRef = useRef<HTMLElement>(null);
    const scrollMetricsRef = useRef<{ height: number; top: number } | null>(null);
    const isInitialLoadRef = useRef(true);
    const wasFetchingRef = useRef(false);
    const prevMessageIdsRef = useRef(new Set<string>());
    const [showScrollButton, setShowScrollButton] = useState(false);

    const canFetchMore = pagination.total !== null && messages.length < pagination.total;
    const isFetching = state === 'fetching';

    const handleLoadMore = useCallback(() => {
        const container = scrollRef.current;
        if (!container) return;

        scrollMetricsRef.current = {
            height: container.scrollHeight,
            top: container.scrollTop
        };

        loadMore();
    }, [loadMore]);

    useEffect(() => {
        if (isFetching) {
            wasFetchingRef.current = true;
        }
    }, [isFetching]);

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        const handleScroll = () => {
            setShowScrollButton(!isNearBottom(container));
        };

        container.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => container.removeEventListener('scroll', handleScroll);
    }, [messages.length]);

    useLayoutEffect(() => {
        if (isFetching || !scrollRef.current) return;

        if (scrollMetricsRef.current) {
            const container = scrollRef.current;
            const { height: oldHeight, top: oldTop } = scrollMetricsRef.current;
            const newHeight = container.scrollHeight;
            container.scrollTop = newHeight - oldHeight + oldTop;
            scrollMetricsRef.current = null;
        }
    }, [isFetching, messages.length]);

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;
        const currentIds = new Set(messages.map(m => m._id));

        if (state === 'loading') {
            isInitialLoadRef.current = true;
            prevMessageIdsRef.current = new Set();
            return;
        }

        if (isInitialLoadRef.current && state === 'success' && messages.length > 0) {
            scrollToBottom(container, false);
            isInitialLoadRef.current = false;
            prevMessageIdsRef.current = currentIds;
            return;
        }

        const addedIds = [...currentIds].filter(id => !prevMessageIdsRef.current.has(id));

        if (addedIds.length > 0) {
            if (wasFetchingRef.current) {
                wasFetchingRef.current = false;
                prevMessageIdsRef.current = currentIds;
                return;
            }

            const hasNewOwnMessage = messages
                .filter(m => addedIds.includes(m._id))
                .some(m => m.senderId === currentUserId);

            if (hasNewOwnMessage || isNearBottom(container)) {
                scrollToBottom(container, true);
            }
        }

        prevMessageIdsRef.current = currentIds;
    }, [state, messages.length, currentUserId]);

    if (state === 'loading') {
        return <MessagesContainerSkeleton />;
    }

    return (
        <div className='relative flex min-h-0 flex-1 flex-col'>
            <section ref={scrollRef} className='messages-scroll flex min-h-0 w-full flex-1 flex-col gap-0.75 overflow-auto pt-2'>
                {(state === 'success' || isFetching) && (
                    <InfiniteLoader
                        isFetching={isFetching}
                        canFetchMore={canFetchMore}
                        onLoadMore={handleLoadMore}
                    />
                )}
                {dateGroups.map((group, groupIndex) => (
                    <div key={group.dateKey} className={`flex flex-col gap-0.75${groupIndex === dateGroups.length - 1 ? ' pb-5' : ''}`}>
                        <DateSeparator label={group.label} />
                        {group.messages.map((message, index) => {
                            const side = message.senderId === currentUserId ? 'sent' : 'received';
                            const firstOfGroup = index === 0 || group.messages[index - 1].senderId !== message.senderId;
                            return (
                                <Fragment key={message._id}>
                                    {firstOfGroup && <MessagesGroupSeparation />}
                                    <Message message={message} side={side} firstOfGroup={firstOfGroup} />
                                </Fragment>
                            );
                        })}
                    </div>
                ))}
            </section>
            <button
                type='button'
                onClick={() => {
                    const container = scrollRef.current;
                    if (container) scrollToBottom(container, true);
                }}
                className={`absolute left-11 bottom-6 z-20 cursor-pointer rounded-lg border border-default bg-subtle p-2 shadow-lg transition-all duration-200 hover:cursor-pointer ${showScrollButton ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}
                aria-label='Ir al final del chat'
            >
                <ChevronDownIcon size={20} />
            </button>
        </div>
    );
}
