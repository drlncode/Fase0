import { Skeleton } from '@shared/components/ui/Skeleton';

export function FriendItemSkeleton() {
    return (
        <div className='flex min-w-68 items-center gap-2 rounded-lg border border-default/70 p-2'>
            <Skeleton className='h-10.5 w-10.5 shrink-0 rounded-full' />
            <div className='flex min-w-0 flex-1 flex-col gap-0.5'>
                <Skeleton className='h-4 w-28 rounded' />
                <Skeleton className='h-3 w-20 rounded' />
            </div>
            <Skeleton className='h-8 w-16 rounded-lg' />
        </div>
    );
}

export function FriendSectionSkeleton() {
    return Array.from({ length: 6 }).map((_, i) => (
        <FriendItemSkeleton key={i} />
    ))
}
