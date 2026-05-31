import { cn } from '@shared/utils/cn';

interface MessageBubbleProps {
    side: 'received' | 'sent';
    children: React.ReactNode;
}

export function MessageBubble({ side, children }: MessageBubbleProps) {
    return (
        <div className={cn('relative flex min-w-0 gap-1.5 overflow-hidden p-2 text-[14px] text-primary/70', {
            'rounded-tl-md rounded-b-md bg-subtle': side === 'sent',
            'rounded-tr-md rounded-b-md bg-overlay': side === 'received',
        })}>
            {children}
        </div>
    );
}
