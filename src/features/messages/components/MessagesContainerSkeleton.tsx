import { Skeleton } from '@shared/components/ui/Skeleton';

const messagePattern = [
    { side: 'received' as const, width: 'w-52' },
    { side: 'received' as const, width: 'w-64' },
    { side: 'sent' as const, width: 'w-44' },
    { side: 'received' as const, width: 'w-72' },
    { side: 'received' as const, width: 'w-48' },
    { side: 'received' as const, width: 'w-36' },
    { side: 'sent' as const, width: 'w-56' },
    { side: 'sent' as const, width: 'w-40' },
    { side: 'received' as const, width: 'w-60' },
    { side: 'sent' as const, width: 'w-48' },
];

export function MessagesContainerSkeleton() {
    return (
        <section className='messages-scroll flex min-h-0 w-full flex-1 flex-col gap-0.75 overflow-auto pt-2 pb-5'>
            {messagePattern.map((msg, i) => {
                const prev = messagePattern[i - 1];
                const next = messagePattern[i + 1];
                const isFirstInGroup = !prev || prev.side !== msg.side;
                const isLastInGroup = !next || next.side !== msg.side;

                const bubbleRounded = msg.side === 'sent'
                    ? isLastInGroup
                        ? 'rounded-tl-md rounded-b-md'
                        : 'rounded-md'
                    : isLastInGroup
                        ? 'rounded-tr-md rounded-b-md'
                        : 'rounded-md';

                return (
                    <div key={i} className='flex flex-col'>
                        {isFirstInGroup && i > 0 && <div className='my-1' />}
                        <div className={`flex w-full px-11 ${msg.side === 'sent' ? 'justify-end' : 'justify-start'}`}>
                            <div className='relative w-fit max-w-[80%] min-w-0'>
                                {isFirstInGroup && (
                                    <span
                                        className={`absolute ${
                                            msg.side === 'received' ? 'right-[98.5%] text-overlay' : 'left-[98.5%] text-subtle'
                                        }`}
                                    >
                                        <Skeleton className='h-4 w-2 rounded-full' />
                                    </span>
                                )}
                                <div className={`relative flex min-w-0 items-end gap-1.5 overflow-hidden p-2 ${msg.side === 'sent' ? 'bg-subtle/70' : 'bg-overlay/70'} ${bubbleRounded}`}>
                                    <Skeleton className={`h-5 ${msg.width} rounded`} />
                                    <span className='relative h-fit shrink-0 self-end text-[11px]'>
                                        <Skeleton className='h-3 w-9 rounded' />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </section>
    );
}
