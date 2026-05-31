import { Skeleton } from '@shared/components/ui/Skeleton';

export function SearchedUserItemSkeleton() {
    return (
        <div className='flex gap-2.5 rounded-lg border border-default/70 px-2.5 py-2'>
            <Skeleton className='h-10.5 w-10.5 shrink-0 rounded-full' />
            <div className='flex min-w-0 flex-1 flex-col justify-center gap-0.5'>
                <Skeleton className='h-4 w-28 rounded' />
                <Skeleton className='h-3 w-20 rounded' />
            </div>
            <div className='flex flex-col justify-center'>
                <Skeleton className='h-8 w-16 rounded-lg' />
            </div>
        </div>
    );
}

export function SearchedUsersListSkeleton() {
    return (
        <div className='flex h-full w-full flex-1 flex-col gap-1.5 overflow-hidden'>
            {Array.from({ length: 8 }).map((_, i) => (
                <SearchedUserItemSkeleton key={i} />
            ))}
        </div>
    );
}
