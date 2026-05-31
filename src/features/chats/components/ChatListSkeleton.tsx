import { Skeleton } from '@shared/components/ui/Skeleton';

export function ChatListSkeleton() {
    return (
        <div className='flex w-full flex-col gap-1'>
            {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className='flex items-center gap-2 rounded-lg p-2.5'>
                    <Skeleton className='h-11 w-11 shrink-0 rounded-full' />
                    <div className='flex min-w-0 flex-1 flex-col gap-1.5'>
                        <div className='flex items-center gap-2'>
                            <Skeleton className='h-5 w-32 rounded' />
                            <Skeleton className='ml-auto h-4 w-12 rounded' />
                        </div>
                        <Skeleton className='h-4 w-48 rounded' />
                    </div>
                </div>
            ))}
        </div>
    );
}
