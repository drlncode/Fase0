import { useEffect, useRef, type ReactNode } from 'react';
import { SpinLoader } from '@shared/components/ui/SpinLoader';

const OBSERVER_START_DELAY = 1000;

interface InfiniteLoaderProps {
    isFetching: boolean;
    canFetchMore: boolean;
    onLoadMore: () => void;
    children?: ReactNode;
}

export function InfiniteLoader({ isFetching, canFetchMore, onLoadMore, children }: InfiniteLoaderProps) {
    const observerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = observerRef.current;
        if (!element) return;

        let observer: IntersectionObserver | null = null;

        const timeoutId = setTimeout(() => {
            observer = new IntersectionObserver(([entry]) => {
                if (!entry.isIntersecting) return;
                if (isFetching) return;
                if (!canFetchMore) return;
                onLoadMore();
            }, { threshold: 0.1 });

            observer.observe(element);
        }, OBSERVER_START_DELAY);

        return () => {
            clearTimeout(timeoutId);
            observer?.disconnect();
        };
    }, [canFetchMore, onLoadMore, isFetching]);

    return (
        <div ref={observerRef} className='col-span-full flex w-full justify-center text-xs'>
            <span>
                {isFetching ? <SpinLoader /> : children}
            </span>
        </div>
    );
}