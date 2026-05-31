import { Skeleton } from '@shared/components/ui/Skeleton';

interface ChatSkeletonProps {
    children: React.ReactNode;
}

export function ChatSkeleton({ children }: ChatSkeletonProps) {
    return (
        <section className='relative flex min-h-0 w-full flex-1 flex-col'>
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-0 opacity-[0.09]"
                style={{
                    backgroundImage: "url('/chat-background.avif')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            />
            <div className='relative z-10 flex min-h-0 w-full flex-1 flex-col'>
                <header className='flex items-center gap-3 border-b border-b-border-default bg-overlay px-4 py-2'>
                <Skeleton className='h-11 w-11 shrink-0 rounded-full' />
                <div className='flex flex-col gap-1.5'>
                    <Skeleton className='h-5 w-32 rounded' />
                    <Skeleton className='h-4 w-24 rounded' />
                </div>
            </header>
            {children}
            <div className='shrink-0 px-10 pb-3'>
                <div className='rounded-lg border border-default bg-overlay px-1.5 py-2 text-sm'>
                    <Skeleton className='h-5 w-full rounded' />
                </div>
                </div>
            </div>
        </section>
    );
}
